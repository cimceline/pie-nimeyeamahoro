import mongoose from 'mongoose';

const contentVersionSchema = new mongoose.Schema({
  resourceType: {
    type: String,
    required: true,
    enum: ['profile', 'education', 'experience', 'expertise', 'skill', 'project', 'publication', 'service', 'resource', 'article', 'academic_title', 'faq', 'setting'],
    index: true
  },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  versionNumber: { type: Number, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  changeSummary: String,
  previousData: { type: mongoose.Schema.Types.Mixed },
  newData: { type: mongoose.Schema.Types.Mixed },
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'approved', 'published', 'archived'],
    default: 'draft'
  },
  reviewComment: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  // Scheduled publishing
  publishAt: Date,
  unpublishAt: Date,
  publishedAt: Date,
  archivedAt: Date,
  isLatest: { type: Boolean, default: true },
}, { timestamps: true });

contentVersionSchema.index({ resourceType: 1, resourceId: 1, versionNumber: -1 });
contentVersionSchema.index({ status: 1 });
contentVersionSchema.index({ publishAt: 1, status: 1 });
contentVersionSchema.index({ unpublishAt: 1, status: 1 });

const ContentVersion = mongoose.model('ContentVersion', contentVersionSchema);
export default ContentVersion;
