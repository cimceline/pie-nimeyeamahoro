import mongoose from 'mongoose';
import slugify from 'slugify';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  shortDescription: String,
  detailedDescription: String,
  category: {
    type: String,
    enum: ['evaluation', 'consulting', 'research', 'design', 'grants', 'policy', 'pedagogy', 'training', 'csr', 'facilitation'],
    required: true
  },
  benefits: [String],
  deliverables: [String],
  process: [String],
  expectedDuration: String,
  startingPrice: String,
  image: String,
  icon: String,
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  displayOrder: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

serviceSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

serviceSchema.index({ category: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ isActive: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
