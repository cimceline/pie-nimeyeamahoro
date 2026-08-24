import AnalyticsEvent from '../models/AnalyticsEvent.js';

class AnalyticsService {
  /**
   * Track an analytics event.
   * @param {object} eventData
   * @returns {Promise<object>} Saved event
   */
  async trackEvent(eventData) {
    const event = new AnalyticsEvent({
      eventType: eventData.eventType,
      entityType: eventData.contentType || null,
      entityId: eventData.contentId || null,
      sessionId: eventData.sessionId || null,
      ipAddress: eventData.ip || null,
      userAgent: eventData.userAgent || null,
      metadata: {
        userId: eventData.userId || null,
        path: eventData.path || null,
        referrer: eventData.referrer || null,
        query: eventData.query || null,
        duration: eventData.duration || null,
        ...eventData.metadata,
      },
    });
    return event.save();
  }

  /**
   * Get event statistics for a date range.
   * @param {object} options - { startDate, endDate, eventType, groupBy }
   * @returns {Promise<Array>} Aggregated stats
   */
  async getEventStats(options = {}) {
    const match = {};
    if (options.startDate || options.endDate) {
      match.createdAt = {};
      if (options.startDate) match.createdAt.$gte = new Date(options.startDate);
      if (options.endDate) match.createdAt.$lte = new Date(options.endDate);
    }
    if (options.eventType) {
      match.eventType = options.eventType;
    }

    const groupBy = options.groupBy || 'day';
    let dateFormat;
    switch (groupBy) {
      case 'hour':
        dateFormat = '%Y-%m-%dT%H:00:00';
        break;
      case 'week':
        dateFormat = '%Y-W%V';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    return AnalyticsEvent.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          uniqueUsers: { $size: { $ifNull: ['$uniqueUsers', []] } },
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ]);
  }

  /**
   * Get most popular content items.
   * @param {object} options - { contentType, limit, startDate, endDate }
   * @returns {Promise<Array>} Popular content
   */
  async getPopularContent(options = {}) {
    const limit = options.limit || 10;
    const match = { contentId: { $ne: null } };

    if (options.contentType) {
      match.contentType = options.contentType;
    }
    if (options.startDate || options.endDate) {
      match.createdAt = {};
      if (options.startDate) match.createdAt.$gte = new Date(options.startDate);
      if (options.endDate) match.createdAt.$lte = new Date(options.endDate);
    }

    return AnalyticsEvent.aggregate([
      { $match: match },
      {
        $group: {
          _id: { contentId: '$contentId', contentType: '$contentType' },
          totalViews: {
            $sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0] },
          },
          totalDownloads: {
            $sum: { $cond: [{ $eq: ['$eventType', 'download'] }, 1, 0] },
          },
          totalShares: {
            $sum: { $cond: [{ $eq: ['$eventType', 'share'] }, 1, 0] },
          },
          totalInteractions: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          contentId: '$_id.contentId',
          contentType: '$_id.contentType',
          totalViews: 1,
          totalDownloads: 1,
          totalShares: 1,
          totalInteractions: 1,
          uniqueVisitors: { $size: { $ifNull: ['$uniqueVisitors', []] } },
          _id: 0,
        },
      },
      { $sort: { totalViews: -1 } },
      { $limit: limit },
    ]);
  }

  /**
   * Get top search queries.
   * @param {object} options - { limit, startDate, endDate }
   * @returns {Promise<Array>} Search query stats
   */
  async getSearchQueries(options = {}) {
    const limit = options.limit || 20;
    const match = { eventType: 'search', query: { $ne: null } };

    if (options.startDate || options.endDate) {
      match.createdAt = {};
      if (options.startDate) match.createdAt.$gte = new Date(options.startDate);
      if (options.endDate) match.createdAt.$lte = new Date(options.endDate);
    }

    return AnalyticsEvent.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $toLower: '$query' },
          count: { $sum: 1 },
          lastSearched: { $max: '$createdAt' },
        },
      },
      {
        $project: {
          query: '$_id',
          count: 1,
          lastSearched: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
export { AnalyticsEvent, AnalyticsService };
