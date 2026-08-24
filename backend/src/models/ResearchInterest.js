import mongoose from 'mongoose';
import slugify from 'slugify';

const researchInterestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: String,
  keywords: [String],
  category: {
    type: String,
    enum: ['Research Area', 'Methodology', 'Theoretical Framework', 'Theme', 'Keyword'],
    default: 'Research Area'
  },
  displayOrder: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

researchInterestSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

researchInterestSchema.index({ category: 1 });
researchInterestSchema.index({ isFeatured: 1 });

const ResearchInterest = mongoose.model('ResearchInterest', researchInterestSchema);
export default ResearchInterest;
