import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  category: {
    type: String,
    enum: ['academic', 'professional', 'consulting', 'community', 'other'],
    default: 'professional'
  },
  description: String,
  objectives: [String],
  responsibilities: [String],
  methodology: String,
  technologies: [String],
  partners: [String],
  outcomes: [String],
  impact: String,
  images: [String],
  documents: [String],
  externalLinks: [String],
  githubUrl: String,
  projectUrl: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'archived', 'planning'],
    default: 'planning'
  },
  isFeatured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

projectSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ isFeatured: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
