import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.action) filter.action = req.query.action;
    if (req.query.actor) filter.actor = req.query.actor;
    if (req.query.entityType) filter.entityType = req.query.entityType;

    const [items, total] = await Promise.all([
      AuditLog.find(filter).sort(sort).skip(skip).limit(limit).populate('actor', 'name email').lean(),
      AuditLog.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getByEntity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const logs = await AuditLog.find({ entityType, entityId })
      .sort({ createdAt: -1 })
      .populate('actor', 'name email')
      .lean();

    return sendSuccess(res, 200, 'Audit logs retrieved', logs);
  } catch (error) {
    return next(error);
  }
};
