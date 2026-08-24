import FAQ from '../models/FAQ.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: 'displayOrder' });
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [items, total] = await Promise.all([
      FAQ.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      FAQ.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await FAQ.findById(req.params.id).lean();
    if (!item) return sendError(res, 404, 'FAQ not found');
    return sendSuccess(res, 200, 'FAQ retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) return sendError(res, 400, 'Question and answer are required');

    const item = await FAQ.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'FAQ',
      entityId: item._id,
      description: `Created FAQ: ${item.question}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'FAQ created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'FAQ not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'FAQ',
      entityId: item._id,
      description: `Updated FAQ: ${item.question}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'FAQ updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await FAQ.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'FAQ not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'FAQ',
      entityId: item._id,
      description: `Deleted FAQ: ${item.question}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'FAQ deleted');
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

    await FAQ.bulkWrite(bulkOps);

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'FAQ',
      description: 'Reordered FAQs',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'FAQs reordered');
  } catch (error) {
    return next(error);
  }
};
