import fs from 'fs';
import path from 'path';
import Resource from '../models/Resource.js';
import AuditLog from '../models/AuditLog.js';
import analyticsService from '../services/analyticsService.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.language) filter.language = req.query.language;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.tags) filter.tags = { $in: req.query.tags.split(',').map((t) => t.trim()) };
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Resource.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Resource.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    let item;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Resource.findById(req.params.id).lean();
    } else {
      item = await Resource.findOne({ slug: req.params.id }).lean();
    }
    if (!item) return sendError(res, 404, 'Resource not found');

    await Resource.findByIdAndUpdate(item._id, { $inc: { viewCount: 1 } });

    return sendSuccess(res, 200, 'Resource retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await Resource.find({ isFeatured: true, status: 'published' }).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, 200, 'Featured resources', items);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return sendError(res, 400, 'Title is required');

    const resourceData = { ...req.body, user: req.user._id };

    if (req.file) {
      resourceData.filePath = req.file.path;
      resourceData.fileName = req.file.originalname;
      resourceData.fileSize = req.file.size;
      resourceData.mimeType = req.file.mimetype;
    }

    const item = await Resource.create(resourceData);

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Resource',
      entityId: item._id,
      description: `Created resource: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Resource created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await Resource.findById(req.params.id);
    if (!existing) return sendError(res, 404, 'Resource not found');

    if (req.file && existing.filePath) {
      const oldPath = path.resolve(existing.filePath);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.filePath = req.file.path;
      updates.fileName = req.file.originalname;
      updates.fileSize = req.file.size;
      updates.mimeType = req.file.mimetype;
    }

    const item = await Resource.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Resource',
      entityId: item._id,
      description: `Updated resource: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Resource updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Resource.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Resource not found');

    if (item.filePath) {
      const filePath = path.resolve(item.filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Resource',
      entityId: item._id,
      description: `Deleted resource: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Resource deleted');
  } catch (error) {
    return next(error);
  }
};

export const download = async (req, res, next) => {
  try {
    const item = await Resource.findById(req.params.id);
    if (!item) return sendError(res, 404, 'Resource not found');
    if (!item.filePath) return sendError(res, 404, 'No file attached to this resource');

    const filePath = path.resolve(item.filePath);
    if (!fs.existsSync(filePath)) {
      return sendError(res, 404, 'File not found on server');
    }

    await Resource.findByIdAndUpdate(item._id, { $inc: { downloadCount: 1 } });

    await analyticsService.trackEvent({
      eventType: 'download',
      contentId: item._id,
      contentType: 'resource',
      userId: req.user ? req.user._id : null,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.download(filePath, item.fileName || path.basename(filePath));
  } catch (error) {
    return next(error);
  }
};
