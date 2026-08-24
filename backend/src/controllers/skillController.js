import Skill from '../models/Skill.js';
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
      Skill.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Skill.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await Skill.findById(req.params.id).lean();
    if (!item) return sendError(res, 404, 'Skill not found');
    return sendSuccess(res, 200, 'Skill retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await Skill.find({ isFeatured: true, isActive: true }).sort({ displayOrder: 1 }).lean();
    return sendSuccess(res, 200, 'Featured skills', items);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return sendError(res, 400, 'Skill name is required');

    const item = await Skill.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Skill',
      entityId: item._id,
      description: `Created skill: ${item.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Skill created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Skill not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Skill',
      entityId: item._id,
      description: `Updated skill: ${item.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Skill updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Skill.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Skill not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Skill',
      entityId: item._id,
      description: `Deleted skill: ${item.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Skill deleted');
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

    await Skill.bulkWrite(bulkOps);

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Skill',
      description: 'Reordered skills',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Skills reordered');
  } catch (error) {
    return next(error);
  }
};
