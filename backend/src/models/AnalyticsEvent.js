import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['page_view', 'document_view', 'document_download', 'publication_view', 'service_request', 'contact_submit', 'resource_search', 'service_page_visit', 'article_view', 'event_view'],
    required: true
  },
  entityType: String,
  entityId: mongoose.Schema.Types.ObjectId,
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});

analyticsEventSchema.index({ eventType: 1 });
analyticsEventSchema.index({ entityType: 1, entityId: 1 });
analyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
export default AnalyticsEvent;
