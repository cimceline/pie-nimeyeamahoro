import Article from '../models/Article.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.tags) filter.tags = { $in: req.query.tags.split(',').map((t) => t.trim()) };
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { excerpt: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Article.find(filter).sort(sort).skip(skip).limit(limit).populate('author', 'name').lean(),
      Article.countDocuments(filter),
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
      item = await Article.findById(req.params.id).populate('author', 'name').lean();
    } else {
      item = await Article.findOne({ slug: req.params.id }).populate('author', 'name').lean();
    }
    if (!item) return sendError(res, 404, 'Article not found');

    await Article.findByIdAndUpdate(item._id, { $inc: { viewCount: 1 } });

    return sendSuccess(res, 200, 'Article retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await Article.find({ isFeatured: true, status: 'published' })
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .lean();
    return sendSuccess(res, 200, 'Featured articles', items);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return sendError(res, 400, 'Title is required');

    const item = await Article.create({ ...req.body, user: req.user._id, author: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Article',
      entityId: item._id,
      description: `Created article: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Article created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Article not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Article',
      entityId: item._id,
      description: `Updated article: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Article updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Article.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Article not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Article',
      entityId: item._id,
      description: `Deleted article: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Article deleted');
  } catch (error) {
    return next(error);
  }
};
