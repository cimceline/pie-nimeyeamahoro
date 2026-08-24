import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index.js';
import { sendError } from '../utils/apiResponse.js';

const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  presentation: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  archive: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
};

const ALL_ALLOWED_MIME_TYPES = Object.values(ALLOWED_MIME_TYPES).flat();

/**
 * Storage configuration for multer using local filesystem.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}${ext}`;
    cb(null, safeName);
  },
});

/**
 * File filter to validate MIME types.
 */
function fileFilter(req, file, cb) {
  if (ALL_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
}

/**
 * Base multer instance with common configuration.
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
    files: 5,
  },
});

/**
 * Middleware for single file upload.
 * @param {string} fieldName - The form field name
 */
export function uploadSingle(fieldName = 'file') {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, 413, `File too large. Maximum size is ${config.maxFileSize / (1024 * 1024)}MB`);
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return sendError(res, 400, 'Too many files');
        }
        return sendError(res, 400, err.message);
      }
      if (err) {
        return sendError(res, 400, err.message);
      }
      next();
    });
  };
}

/**
 * Middleware for multiple file upload.
 * @param {string} fieldName - The form field name
 * @param {number} maxCount - Maximum number of files
 */
export function uploadMultiple(fieldName = 'files', maxCount = 5) {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, 413, `File too large. Maximum size is ${config.maxFileSize / (1024 * 1024)}MB`);
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return sendError(res, 400, `Too many files. Maximum is ${maxCount}`);
        }
        return sendError(res, 400, err.message);
      }
      if (err) {
        return sendError(res, 400, err.message);
      }
      next();
    });
  };
}

/**
 * Middleware for mixed file uploads (different field names).
 * @param {Array<{name: string, maxCount: number}>} fields
 */
export function uploadFields(fields) {
  return (req, res, next) => {
    upload.fields(fields)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return sendError(res, 400, err.message);
      }
      if (err) {
        return sendError(res, 400, err.message);
      }
      next();
    });
  };
}

export { ALLOWED_MIME_TYPES, ALL_ALLOWED_MIME_TYPES };
export default upload;
