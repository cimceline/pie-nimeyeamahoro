import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: String,
  mimeType: String,
  size: Number,
  width: Number,
  height: Number,
  path: { type: String, required: true },
  url: String,
  altText: String,
  title: String,
  caption: String,
  category: {
    type: String,
    enum: ['profile', 'publication', 'project', 'event', 'article', 'resource', 'service', 'other'],
    default: 'other'
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

mediaSchema.index({ category: 1 });

const Media = mongoose.model('Media', mediaSchema);
export default Media;
