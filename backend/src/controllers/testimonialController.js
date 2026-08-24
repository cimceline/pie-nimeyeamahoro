import Testimonial from '../models/Testimonial.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [items, total] = await Promise.all([
      Testimonial.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Testimonial.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await Testimonial.find({ isFeatured: true, isActive: true }).lean();
    return sendSuccess(res, 200, 'Featured testimonials', items);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { authorName, quote } = req.body;
    if (!authorName || !quote) return sendError(res, 400, 'Author name and quote are required');

    const item = await Testimonial.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Testimonial',
      entityId: item._id,
      description: `Created testimonial from: ${item.authorName}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Testimonial created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Testimonial not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Testimonial',
      entityId: item._id,
      description: `Updated testimonial from: ${item.authorName}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Testimonial updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Testimonial not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Testimonial',
      entityId: item._id,
      description: `Deleted testimonial from: ${item.authorName}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Testimonial deleted');
  } catch (error) {
    return next(error);
  }
};
