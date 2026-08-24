import Service from '../models/Service.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: 'displayOrder' });
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [items, total] = await Promise.all([
      Service.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Service.countDocuments(filter),
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
      item = await Service.findById(req.params.id).lean();
    } else {
      item = await Service.findOne({ slug: req.params.id }).lean();
    }
    if (!item) return sendError(res, 404, 'Service not found');
    return sendSuccess(res, 200, 'Service retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await Service.find({ isFeatured: true, isActive: true }).sort({ displayOrder: 1 }).lean();
    return sendSuccess(res, 200, 'Featured services', items);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) return sendError(res, 400, 'Title and category are required');

    const item = await Service.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Service',
      entityId: item._id,
      description: `Created service: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Service created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Service not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Service',
      entityId: item._id,
      description: `Updated service: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Service updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Service.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Service not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Service',
      entityId: item._id,
      description: `Deleted service: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Service deleted');
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

    await Service.bulkWrite(bulkOps);

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Service',
      description: 'Reordered services',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Services reordered');
  } catch (error) {
    return next(error);
  }
};
