import ServiceRequest from '../models/ServiceRequest.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.service) filter.service = req.query.service;

    const [items, total] = await Promise.all([
      ServiceRequest.find(filter).sort(sort).skip(skip).limit(limit).populate('service', 'title slug').lean(),
      ServiceRequest.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await ServiceRequest.findById(req.params.id).populate('service', 'title slug').lean();
    if (!item) return sendError(res, 404, 'Service request not found');
    return sendSuccess(res, 200, 'Service request retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, email, projectDescription } = req.body;
    if (!name || !email || !projectDescription) {
      return sendError(res, 400, 'Name, email, and project description are required');
    }

    const item = await ServiceRequest.create({
      ...req.body,
      ipAddress: req.ip,
    });

    return sendCreated(res, item, 'Service request submitted');
  } catch (error) {
    return next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return sendError(res, 400, 'Status is required');

    const item = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!item) return sendError(res, 404, 'Service request not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'ServiceRequest',
      entityId: item._id,
      description: `Updated service request status to: ${status}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Status updated', item);
  } catch (error) {
    return next(error);
  }
};

export const addInternalNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note) return sendError(res, 400, 'Note is required');

    const item = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          internalNotes: {
            note,
            addedBy: req.user._id,
            addedAt: new Date(),
          },
        },
      },
      { new: true }
    );
    if (!item) return sendError(res, 404, 'Service request not found');

    return sendSuccess(res, 200, 'Note added', item);
  } catch (error) {
    return next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await ServiceRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return sendSuccess(res, 200, 'Service request stats', stats);
  } catch (error) {
    return next(error);
  }
};
