import fs from 'fs';
import path from 'path';
import Media from '../models/Media.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const upload = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'No file uploaded');

    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      altText: req.body.altText || '',
      title: req.body.title || req.file.originalname,
      caption: req.body.caption || '',
      category: req.body.category || 'other',
      uploadedBy: req.user._id,
    });

    return sendCreated(res, media, 'File uploaded');
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const [items, total] = await Promise.all([
      Media.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Media.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Media.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Media not found');

    if (item.path) {
      const filePath = path.resolve(item.path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    return sendSuccess(res, 200, 'Media deleted');
  } catch (error) {
    return next(error);
  }
};
