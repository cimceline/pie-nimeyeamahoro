import Announcement from '../models/Announcement.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.priority) filter.priority = req.query.priority;

    const [items, total] = await Promise.all([
      Announcement.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Announcement.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getPublic = async (req, res, next) => {
  try {
    const now = new Date();
    const filter = {
      status: 'active',
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    };
    if (req.query.displayOn) {
      filter.$or = [
        { displayOn: req.query.displayOn },
        { displayOn: 'all' },
      ];
    }

    const items = await Announcement.find(filter).sort({ priority: -1, createdAt: -1 }).lean();
    return sendSuccess(res, 200, 'Announcements retrieved', items);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await Announcement.findById(req.params.id).lean();
    if (!item) return sendError(res, 404, 'Announcement not found');
    return sendSuccess(res, 200, 'Announcement retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, message, type, priority, startDate, endDate, displayOn, status } = req.body;
    if (!title || !message || !startDate || !endDate) {
      return sendError(res, 400, 'Title, message, startDate, and endDate are required');
    }

    const announcement = await Announcement.create({
      ...req.body,
      user: req.user._id,
      status: status || 'draft',
    });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Announcement',
      entityId: announcement._id,
      description: `Created announcement: ${title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, announcement, 'Announcement created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Announcement not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Announcement',
      entityId: item._id,
      description: `Updated announcement: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Announcement updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Announcement.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Announcement not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Announcement',
      entityId: item._id,
      description: `Deleted announcement: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Announcement deleted');
  } catch (error) {
    return next(error);
  }
};

export const trackView = async (req, res, next) => {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    return sendSuccess(res, 200, 'View tracked');
  } catch (error) {
    return next(error);
  }
};

export const trackClick = async (req, res, next) => {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });
    return sendSuccess(res, 200, 'Click tracked');
  } catch (error) {
    return next(error);
  }
};
