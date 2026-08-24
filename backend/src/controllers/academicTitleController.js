import AcademicTitle from '../models/AcademicTitle.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: 'displayOrder' });
    const filter = {};
    if (req.query.country) filter.country = req.query.country;

    const [items, total] = await Promise.all([
      AcademicTitle.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      AcademicTitle.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await AcademicTitle.findById(req.params.id).lean();
    if (!item) return sendError(res, 404, 'Academic title not found');
    return sendSuccess(res, 200, 'Academic title retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, country } = req.body;
    if (!title || !country) return sendError(res, 400, 'Title and country are required');

    const item = await AcademicTitle.create(req.body);

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'AcademicTitle',
      entityId: item._id,
      description: `Created academic title: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Academic title created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await AcademicTitle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Academic title not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'AcademicTitle',
      entityId: item._id,
      description: `Updated academic title: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Academic title updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await AcademicTitle.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Academic title not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'AcademicTitle',
      entityId: item._id,
      description: `Deleted academic title: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Academic title deleted');
  } catch (error) {
    return next(error);
  }
};
