import Appointment from '../models/Appointment.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-preferredDate' });
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [items, total] = await Promise.all([
      Appointment.find(filter).sort(sort).skip(skip).limit(limit).populate('service', 'title slug').lean(),
      Appointment.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await Appointment.findById(req.params.id).populate('service', 'title slug').lean();
    if (!item) return sendError(res, 404, 'Appointment not found');
    return sendSuccess(res, 200, 'Appointment retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, email, preferredDate } = req.body;
    if (!name || !email || !preferredDate) {
      return sendError(res, 400, 'Name, email, and preferred date are required');
    }

    const item = await Appointment.create(req.body);
    return sendCreated(res, item, 'Appointment request submitted');
  } catch (error) {
    return next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return sendError(res, 400, 'Status is required');

    const item = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!item) return sendError(res, 404, 'Appointment not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Appointment',
      entityId: item._id,
      description: `Updated appointment status to: ${status}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Status updated', item);
  } catch (error) {
    return next(error);
  }
};
