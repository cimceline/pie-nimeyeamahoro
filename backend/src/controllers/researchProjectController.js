import ResearchProject from '../models/ResearchProject.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.researchArea) filter.researchArea = req.query.researchArea;

    const [items, total] = await Promise.all([
      ResearchProject.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ResearchProject.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    let item;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await ResearchProject.findById(req.params.id).populate('publications', 'title slug').lean();
    } else {
      item = await ResearchProject.findOne({ slug: req.params.id }).populate('publications', 'title slug').lean();
    }
    if (!item) return sendError(res, 404, 'Research project not found');
    return sendSuccess(res, 200, 'Research project retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const items = await ResearchProject.find({ isFeatured: true }).sort({ startDate: -1 }).lean();
    return sendSuccess(res, 200, 'Featured research projects', items);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return sendError(res, 400, 'Title is required');

    const item = await ResearchProject.create({ ...req.body, user: req.user._id });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'ResearchProject',
      entityId: item._id,
      description: `Created research project: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Research project created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await ResearchProject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Research project not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'ResearchProject',
      entityId: item._id,
      description: `Updated research project: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Research project updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await ResearchProject.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Research project not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'ResearchProject',
      entityId: item._id,
      description: `Deleted research project: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Research project deleted');
  } catch (error) {
    return next(error);
  }
};
