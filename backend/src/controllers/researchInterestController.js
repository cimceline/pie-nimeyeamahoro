import ResearchInterest from '../models/ResearchInterest.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: 'displayOrder' });
    const filter = {};
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [items, total] = await Promise.all([
      ResearchInterest.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ResearchInterest.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await ResearchInterest.find({ isFeatured: true, isActive: true })
      .sort({ displayOrder: 1 })
      .lean();
    return sendSuccess(res, 200, 'Featured research interests', items);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return sendError(res, 400, 'Title is required');

    const item = await ResearchInterest.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'ResearchInterest',
      entityId: item._id,
      description: `Created research interest: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Research interest created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await ResearchInterest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Research interest not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'ResearchInterest',
      entityId: item._id,
      description: `Updated research interest: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Research interest updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await ResearchInterest.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Research interest not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'ResearchInterest',
      entityId: item._id,
      description: `Deleted research interest: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Research interest deleted');
  } catch (error) {
    return next(error);
  }
};
