import Expertise from '../models/Expertise.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: 'displayOrder' });
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';

    const [items, total] = await Promise.all([
      Expertise.find(filter).sort(sort).skip(skip).limit(limit)
        .populate('relatedServices', 'title slug')
        .populate('relatedProjects', 'title slug')
        .lean(),
      Expertise.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await Expertise.findById(req.params.id)
      .populate('relatedServices', 'title slug')
      .populate('relatedProjects', 'title slug')
      .lean();
    if (!item) return sendError(res, 404, 'Expertise not found');
    return sendSuccess(res, 200, 'Expertise retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await Expertise.find({ isFeatured: true, isActive: true }).sort({ displayOrder: 1 }).lean();
    return sendSuccess(res, 200, 'Featured expertise', items);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return sendError(res, 400, 'Title is required');

    const item = await Expertise.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Expertise',
      entityId: item._id,
      description: `Created expertise: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Expertise created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Expertise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Expertise not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Expertise',
      entityId: item._id,
      description: `Updated expertise: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Expertise updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Expertise.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Expertise not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Expertise',
      entityId: item._id,
      description: `Deleted expertise: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Expertise deleted');
  } catch (error) {
    return next(error);
  }
};

export const reorder = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return sendError(res, 400, 'Items array is required');

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));

    await Expertise.bulkWrite(bulkOps);

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Expertise',
      description: 'Reordered expertise',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Expertise reordered');
  } catch (error) {
    return next(error);
  }
};
