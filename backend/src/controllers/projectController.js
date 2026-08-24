import Project from '../models/Project.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: 'displayOrder' });
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';

    const [items, total] = await Promise.all([
      Project.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Project.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await Project.findById(req.params.id).lean();
    if (!item) return sendError(res, 404, 'Project not found');
    return sendSuccess(res, 200, 'Project retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await Project.find({ isFeatured: true }).sort({ displayOrder: 1 }).lean();
    return sendSuccess(res, 200, 'Featured projects', items);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return sendError(res, 400, 'Title is required');

    const item = await Project.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Project',
      entityId: item._id,
      description: `Created project: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Project created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Project not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Project',
      entityId: item._id,
      description: `Updated project: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Project updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Project.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Project not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Project',
      entityId: item._id,
      description: `Deleted project: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Project deleted');
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

    await Project.bulkWrite(bulkOps);

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Project',
      description: 'Reordered projects',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Projects reordered');
  } catch (error) {
    return next(error);
  }
};
