import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

/**
 * Storage service abstraction.
 * Currently uses local filesystem. Designed to be swappable for cloud providers.
 */
class StorageService {
  constructor(uploadDir) {
    this.uploadDir = uploadDir || config.uploadDir;
    this.ensureUploadDir();
  }

  async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      logger.info(`Created upload directory: ${this.uploadDir}`);
    }
  }

  /**
   * Upload a file from a buffer or file path.
   * @param {Buffer|Object} fileData - Buffer with file data or multer file object
   * @param {object} options - { folder, filename, mimeType }
   * @returns {Promise<object>} Storage metadata
   */
  async upload(fileData, options = {}) {
    const folder = options.folder || '';
    const filename = options.filename || `${uuidv4()}${path.extname(fileData.originalname || '')}`;
    const relativePath = folder ? `${folder}/${filename}` : filename;
    const fullPath = path.join(this.uploadDir, relativePath);

    // Ensure subdirectory exists
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    if (Buffer.isBuffer(fileData)) {
      await fs.writeFile(fullPath, fileData);
    } else if (fileData.path) {
      // Multer file — move from temp location
      await fs.copyFile(fileData.path, fullPath);
      await fs.unlink(fileData.path).catch(() => {});
    } else if (fileData.buffer) {
      await fs.writeFile(fullPath, fileData.buffer);
    }

    const stats = await fs.stat(fullPath);

    return {
      filename,
      originalName: fileData.originalname || filename,
      path: relativePath,
      fullPath,
      size: stats.size,
      mimeType: fileData.mimetype || options.mimeType || 'application/octet-stream',
      url: `/uploads/${relativePath}`,
    };
  }

  /**
   * Download a file.
   * @param {string} filePath - Relative path to the file
   * @returns {Promise<Buffer>} File buffer
   */
  async download(filePath) {
    const fullPath = path.join(this.uploadDir, filePath);
    return fs.readFile(fullPath);
  }

  /**
   * Delete a file.
   * @param {string} filePath - Relative path to the file
   */
  async delete(filePath) {
    const fullPath = path.join(this.uploadDir, filePath);
    try {
      await fs.unlink(fullPath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  /**
   * Get a signed URL (placeholder for cloud storage integration).
   * For local storage, returns the direct URL.
   * @param {string} filePath - Relative path to the file
   * @param {number} expiresIn - Expiration in seconds (ignored for local)
   * @returns {Promise<string>} URL
   */
  async getSignedUrl(filePath, expiresIn = 3600) {
    return `/uploads/${filePath}`;
  }

  /**
   * List files in a directory.
   * @param {string} folder - Relative folder path
   * @returns {Promise<Array<object>>} File metadata list
   */
  async list(folder = '') {
    const dirPath = path.join(this.uploadDir, folder);
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const files = [];

      for (const entry of entries) {
        if (entry.isFile()) {
          const fullPath = path.join(dirPath, entry.name);
          const stats = await fs.stat(fullPath);
          const relativePath = folder ? `${folder}/${entry.name}` : entry.name;
          files.push({
            filename: entry.name,
            path: relativePath,
            size: stats.size,
            url: `/uploads/${relativePath}`,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
          });
        }
      }

      return files;
    } catch {
      return [];
    }
  }

  /**
   * Check if a file exists.
   * @param {string} filePath - Relative path
   * @returns {Promise<boolean>}
   */
  async exists(filePath) {
    const fullPath = path.join(this.uploadDir, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

const storageService = new StorageService();
export default storageService;
export { StorageService };
