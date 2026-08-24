import mongoose from 'mongoose';
import slugify from 'slugify';

const expertiseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: String,
  icon: String,
  category: {
    type: String,
    enum: ['evaluation', 'research', 'policy', 'services', 'consulting', 'training', 'csr', 'methodology'],
    default: 'research'
  },
  keywords: [String],
  relatedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

expertiseSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

expertiseSchema.index({ category: 1 });
expertiseSchema.index({ isFeatured: 1 });

const Expertise = mongoose.model('Expertise', expertiseSchema);
export default Expertise;
