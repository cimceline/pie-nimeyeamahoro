import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['resource', 'publication', 'article', 'service', 'profile', 'faq', 'education', 'experience', 'expertise', 'skill'],
    required: true
  },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  language: { type: String, required: true },
  translatedTitle: String,
  translatedDescription: String,
  translatedContent: String,
  translatedFile: String,
  status: {
    type: String,
    enum: ['missing', 'draft', 'review', 'published', 'outdated'],
    default: 'missing'
  },
  translator: String,
  originalVersion: Number
}, { timestamps: true });

translationSchema.index({ entityType: 1, entityId: 1, language: 1 }, { unique: true });

const Translation = mongoose.model('Translation', translationSchema);
export default Translation;
