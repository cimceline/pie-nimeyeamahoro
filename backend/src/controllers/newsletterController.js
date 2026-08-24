import Newsletter from '../models/Newsletter.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

export const subscribe = async (req, res, next) => {
  try {
    const { email, name, language } = req.body;
    if (!email) return sendError(res, 400, 'Email is required');

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'pending';
        existing.unsubscribedAt = undefined;
        await existing.save();
        return sendSuccess(res, 200, 'Re-subscribed. Please verify your email.');
      }
      return sendError(res, 409, 'Email already subscribed');
    }

    const item = await Newsletter.create({
      email: email.toLowerCase(),
      name,
      language,
      source: req.body.source || 'website',
    });

    return sendCreated(res, {
      message: 'Subscribed successfully. Please verify your email.',
      verificationToken: item.verificationToken,
    }, 'Subscription created');
  } catch (error) {
    return next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) return sendError(res, 400, 'Unsubscribe token is required');

    const item = await Newsletter.findOne({ unsubscribeToken: token });
    if (!item) return sendError(res, 404, 'Invalid unsubscribe token');

    item.status = 'unsubscribed';
    item.unsubscribedAt = new Date();
    await item.save();

    return sendSuccess(res, 200, 'Unsubscribed successfully');
  } catch (error) {
    return next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) return sendError(res, 400, 'Verification token is required');

    const item = await Newsletter.findOne({ verificationToken: token });
    if (!item) return sendError(res, 404, 'Invalid verification token');

    item.status = 'active';
    item.verifiedAt = new Date();
    item.verificationToken = undefined;
    await item.save();

    return sendSuccess(res, 200, 'Email verified successfully');
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [items, total] = await Promise.all([
      Newsletter.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Newsletter.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Newsletter.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Newsletter subscriber not found');
    return sendSuccess(res, 200, 'Subscriber deleted');
  } catch (error) {
    return next(error);
  }
};
