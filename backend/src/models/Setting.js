import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, default: null },
  category: {
    type: String,
    enum: ['general', 'seo', 'email', 'upload', 'comments', 'services', 'newsletter', 'security', 'appearance'],
    default: 'general'
  },
  description: String
}, { timestamps: true });

settingSchema.index({ category: 1 });

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
