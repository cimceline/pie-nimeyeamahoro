import Experience from '../models/Experience.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: 'displayOrder' });
    const filter = {};
    if (req.query.employmentType) filter.employmentType = req.query.employmentType;
    if (req.query.isCurrent !== undefined) filter.isCurrent = req.query.isCurrent === 'true';

    const [items, total] = await Promise.all([
      Experience.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Experience.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await Experience.findById(req.params.id)
      .populate('projects', 'title slug')
      .populate('publications', 'title slug')
      .populate('relatedServices', 'title slug')
      .lean();
    if (!item) return sendError(res, 404, 'Experience not found');
    return sendSuccess(res, 200, 'Experience retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, organization, startDate } = req.body;
    if (!title || !organization || !startDate) {
      return sendError(res, 400, 'Title, organization, and start date are required');
    }

    const item = await Experience.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Experience',
      entityId: item._id,
      description: `Created experience: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Experience created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Experience not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Experience',
      entityId: item._id,
      description: `Updated experience: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Experience updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Experience not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Experience',
      entityId: item._id,
      description: `Deleted experience: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Experience deleted');
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

    await Experience.bulkWrite(bulkOps);

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Experience',
      description: 'Reordered experiences',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Experiences reordered');
  } catch (error) {
    return next(error);
  }
};
