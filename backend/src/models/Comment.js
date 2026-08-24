import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  authorName: { type: String, required: true },
  authorEmail: String,
  entityType: {
    type: String,
    enum: ['resource', 'publication', 'article', 'service', 'event', 'project', 'book'],
    required: true
  },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'hidden', 'rejected', 'spam'],
    default: 'pending'
  },
  ipAddress: String,
  userAgent: String,
  reported: { type: Boolean, default: false },
  reportReason: String,
  reportedAt: Date,
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderatedAt: Date,
  moderationNote: String,
  isTranslated: { type: Boolean, default: false },
  translations: [{
    language: String,
    content: String,
    translatedBy: String,
    translatedAt: Date
  }]
}, { timestamps: true });

commentSchema.index({ entityId: 1, entityType: 1 });
commentSchema.index({ status: 1 });
commentSchema.index({ createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
