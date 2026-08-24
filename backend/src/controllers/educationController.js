import Education from '../models/Education.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: 'displayOrder' });
    const filter = {};
    if (req.query.degreeType) filter.degreeType = req.query.degreeType;
    if (req.query.isPublished !== undefined) filter.isPublished = req.query.isPublished === 'true';

    const [items, total] = await Promise.all([
      Education.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Education.countDocuments(filter),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);
    return sendPaginated(res, items, pagination);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await Education.findById(req.params.id).lean();
    if (!item) return sendError(res, 404, 'Education record not found');
    return sendSuccess(res, 200, 'Education record retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { qualification, degreeType, institution } = req.body;
    if (!qualification || !degreeType || !institution) {
      return sendError(res, 400, 'Qualification, degree type, and institution are required');
    }

    const item = await Education.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Education',
      entityId: item._id,
      description: `Created education: ${item.qualification}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Education record created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Education record not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Education',
      entityId: item._id,
      description: `Updated education: ${item.qualification}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Education record updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Education.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Education record not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Education',
      entityId: item._id,
      description: `Deleted education: ${item.qualification}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Education record deleted');
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

    await Education.bulkWrite(bulkOps);

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Education',
      description: 'Reordered education records',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Education records reordered');
  } catch (error) {
    return next(error);
  }
};
