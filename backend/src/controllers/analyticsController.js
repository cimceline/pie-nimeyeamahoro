import mongoose from 'mongoose';
import analyticsService from '../services/analyticsService.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const trackEvent = async (req, res, next) => {
  try {
    const { eventType, contentId, contentType, metadata, query } = req.body;
    if (!eventType) return sendError(res, 400, 'Event type is required');

    const event = await analyticsService.trackEvent({
      eventType,
      userId: req.user ? req.user._id : null,
      sessionId: req.headers['x-session-id'] || null,
      contentId,
      contentType,
      metadata,
      query,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer || req.headers.referrer || null,
      path: req.body.path || null,
    });

    return sendSuccess(res, 201, 'Event tracked', event);
  } catch (error) {
    return next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const collectionDocs = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collectionDocs.map(c => c.name);

    const countPromises = {};
    for (const name of collectionNames) {
      countPromises[name] = mongoose.connection.db.collection(name).countDocuments();
    }
    const counts = {};
    for (const [key, promise] of Object.entries(countPromises)) {
      counts[key] = await promise;
    }

    // Map collection names to dashboard-friendly keys
    // Mongoose default pluralization: lowercase model name + 's'
    const stats = {
      publications: counts['publications'] || 0,
      projects: counts['projects'] || 0,
      research: counts['researchprojects'] || 0,
      articles: counts['articles'] || 0,
      events: counts['events'] || 0,
      contacts: counts['contactmessages'] || 0,
      messages: counts['contactmessages'] || 0,
      users: counts['users'] || 0,
      skills: counts['skills'] || 0,
      experience: counts['experiences'] || 0,
      education: counts['educations'] || 0,
      expertise: counts['expertises'] || 0,
      services: counts['services'] || 0,
      resources: counts['resources'] || 0,
      comments: counts['comments'] || 0,
      books: counts['books'] || 0,
      appointments: counts['appointments'] || 0,
      newsletter: counts['newsletters'] || 0,
      faqs: counts['faqs'] || 0,
      testimonials: counts['testimonials'] || 0,
      academicTitles: counts['academictitles'] || 0,
    };

    return sendSuccess(res, 200, 'Stats retrieved', stats);
  } catch (error) {
    return next(error);
  }
};

export const getPopularContent = async (req, res, next) => {
  try {
    const { contentType, limit, startDate, endDate } = req.query;
    const items = await analyticsService.getPopularContent({
      contentType,
      limit: parseInt(limit, 10) || 10,
      startDate,
      endDate,
    });

    return sendSuccess(res, 200, 'Popular content', items);
  } catch (error) {
    return next(error);
  }
};

export const getEventTypes = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const types = await AnalyticsEvent.aggregate([
      { $match: match },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return sendSuccess(res, 200, 'Event types', types);
  } catch (error) {
    return next(error);
  }
};

export const getTimeline = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    const timeline = await analyticsService.getEventStats({
      startDate,
      endDate,
      groupBy: groupBy || 'day',
    });

    return sendSuccess(res, 200, 'Timeline data', timeline);
  } catch (error) {
    return next(error);
  }
};
