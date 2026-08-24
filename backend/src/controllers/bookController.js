import Book from '../models/Book.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { author: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Book.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Book.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getPublished = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-publishedAt' });
    const filter = { status: 'published' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured) filter.isFeatured = req.query.featured === 'true';

    const [items, total] = await Promise.all([
      Book.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Book.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getBySlug = async (req, res, next) => {
  try {
    const item = await Book.findOne({ slug: req.params.slug })
      .populate('relatedPublications', 'title slug')
      .populate('relatedProjects', 'title slug')
      .lean();
    if (!item) return sendError(res, 404, 'Book not found');

    await Book.findByIdAndUpdate(item._id, { $inc: { viewCount: 1 } });

    return sendSuccess(res, 200, 'Book retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await Book.findById(req.params.id).lean();
    if (!item) return sendError(res, 404, 'Book not found');
    return sendSuccess(res, 200, 'Book retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, description, content, author, category, tags, language, isbn, publisher, publishedAt, edition, pageCount, status, isFeatured, visibility, coverImage, authorBio } = req.body;
    if (!title || !description || !author) {
      return sendError(res, 400, 'Title, description, and author are required');
    }

    const item = await Book.create({
      title, description, content, author, category, tags, language, isbn, publisher, publishedAt, edition, pageCount, status, isFeatured, visibility, coverImage, authorBio,
      user: req.user._id,
    });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Book',
      entityId: item._id,
      description: `Created book: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, item, 'Book created');
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'Book not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'Book',
      entityId: item._id,
      description: `Updated book: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Book updated', item);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Book.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Book not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Book',
      entityId: item._id,
      description: `Deleted book: ${item.title}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Book deleted');
  } catch (error) {
    return next(error);
  }
};

export const incrementDownload = async (req, res, next) => {
  try {
    const item = await Book.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } }, { new: true });
    if (!item) return sendError(res, 404, 'Book not found');
    return sendSuccess(res, 200, 'Download counted', item);
  } catch (error) {
    return next(error);
  }
};
