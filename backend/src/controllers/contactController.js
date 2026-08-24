import ContactMessage from '../models/ContactMessage.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [items, total] = await Promise.all([
      ContactMessage.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ContactMessage.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await ContactMessage.findById(req.params.id).lean();
    if (!item) return sendError(res, 404, 'Contact message not found');
    return sendSuccess(res, 200, 'Contact message retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return sendError(res, 400, 'Name, email, and message are required');
    }

    const item = await ContactMessage.create({ ...req.body, ipAddress: req.ip });
    return sendCreated(res, item, 'Message sent successfully');
  } catch (error) {
    return next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return sendError(res, 400, 'Status is required');

    const item = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!item) return sendError(res, 404, 'Contact message not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'ContactMessage',
      entityId: item._id,
      description: `Updated contact message status to: ${status}`,
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

    const item = await ContactMessage.findByIdAndUpdate(
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
    if (!item) return sendError(res, 404, 'Contact message not found');

    return sendSuccess(res, 200, 'Note added', item);
  } catch (error) {
    return next(error);
  }
};
