import mongoose from 'mongoose';
import slugify from 'slugify';

const researchProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  researchQuestion: String,
  abstract: String,
  description: String,
  objectives: [String],
  methodology: String,
  theoreticalFramework: String,
  researchArea: String,
  collaborators: [String],
  institutions: [String],
  fundingSource: String,
  fundingAmount: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['proposed', 'active', 'completed', 'archived', 'unpublished'],
    default: 'proposed'
  },
  publications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
  documents: [String],
  images: [String],
  projectUrl: String,
  externalResources: [String],
  keywords: [String],
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  },
  isFeatured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

researchProjectSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

researchProjectSchema.index({ status: 1 });
researchProjectSchema.index({ researchArea: 1 });

const ResearchProject = mongoose.model('ResearchProject', researchProjectSchema);
export default ResearchProject;
