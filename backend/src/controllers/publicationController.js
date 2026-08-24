import Publication from '../models/Publication.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-publicationDate' });
    const filter = {};
    if (req.query.publicationType) filter.publicationType = req.query.publicationType;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.year) {
      const year = parseInt(req.query.year, 10);
      filter.publicationDate = { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) };
    }
    if (req.query.language) filter.language = req.query.language;
    if (req.query.researchArea) filter.researchArea = req.query.researchArea;
    if (req.query.keyword) {
      const escapedKeyword = req.query.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.keywords = { $in: [new RegExp(escapedKeyword, 'i')] };
    }

    const [items, total] = await Promise.all([
      Publication.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Publication.countDocuments(filter),
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
      item = await Publication.findById(req.params.id).lean();
    } else {
      item = await Publication.findOne({ slug: req.params.id }).lean();
    }
    if (!item) return sendError(res, 404, 'Publication not found');

    await Publication.findByIdAndUpdate(item._id, { $inc: { viewCount: 1 } });

    return sendSuccess(res, 200, 'Publication retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await Publication.find({ isFeatured: true, status: 'published' }).sort({ publicationDate: -1 }).lean();
    return sendSuccess(res, 200, 'Featured publications', items);
  } catch (error) {
    return next(error);
  }
};

export const getByType = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-publicationDate' });
    const filter = { publicationType: req.params.type };

    const [items, total] = await Promise.all([
      Publication.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Publication.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, publicationType } = req.body;
    if (!title || !publicationType) {
      return sendError(res, 400, 'Title and publication type are required');
    }

    const item = await Publication.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Publication',
      entityId: item._id,
      description: `Created publication: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Publication created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Publication not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Publication',
      entityId: item._id,
      description: `Updated publication: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Publication updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Publication.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Publication not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Publication',
      entityId: item._id,
      description: `Deleted publication: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Publication deleted');
  } catch (error) {
    return next(error);
  }
};
