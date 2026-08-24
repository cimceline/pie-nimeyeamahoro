import Comment from '../models/Comment.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.entityType) filter.entityType = req.query.entityType;
    if (req.query.entityId) filter.entityId = req.query.entityId;
    if (req.query.status) filter.status = req.query.status;

    const [items, total] = await Promise.all([
      Comment.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Comment.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { content, authorName, entityType, entityId } = req.body;
    if (!content || !authorName || !entityType || !entityId) {
      return sendError(res, 400, 'Content, author name, entity type, and entity ID are required');
    }

    const item = await Comment.create({
      ...req.body,
      status: 'pending',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Comment submitted for moderation');
  } catch (error) {
    return next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status, moderationNote } = req.body;
    if (!status) return sendError(res, 400, 'Status is required');

    const validStatuses = ['approved', 'hidden', 'rejected', 'spam'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 400, `Status must be one of: ${validStatuses.join(', ')}`);
    }

    const item = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        moderatedBy: req.user._id,
        moderatedAt: new Date(),
        moderationNote,
      },
      { new: true }
    );
    if (!item) return sendError(res, 404, 'Comment not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'moderate',
      entityType: 'Comment',
      entityId: item._id,
      description: `Comment status changed to: ${status}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Comment status updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Comment.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Comment not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Comment',
      entityId: item._id,
      description: 'Comment deleted',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Comment deleted');
  } catch (error) {
    return next(error);
  }
};

export const report = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const item = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        reported: true,
        reportReason: reason,
        reportedAt: new Date(),
      },
      { new: true }
    );
    if (!item) return sendError(res, 404, 'Comment not found');

    return sendSuccess(res, 200, 'Comment reported', item);
  } catch (error) {
    return next(error);
  }
};

export const getByEntity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const items = await Comment.find({
      entityType,
      entityId,
      status: 'approved',
    })
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, 200, 'Comments retrieved', items);
  } catch (error) {
    return next(error);
  }
};
