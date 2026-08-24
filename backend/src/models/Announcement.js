import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  image: String,
  ctaText: String,
  ctaLink: String,
  type: {
    type: String,
    enum: ['information', 'academic', 'research', 'service', 'event', 'important'],
    default: 'information'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'expired', 'archived'],
    default: 'draft'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  displayOn: [{
    type: String,
    enum: ['homepage', 'resources', 'services', 'events', 'publications', 'all'],
    default: ['homepage']
  }],
  isActive: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

announcementSchema.index({ status: 1, startDate: 1, endDate: 1 });
announcementSchema.index({ displayOn: 1 });

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
