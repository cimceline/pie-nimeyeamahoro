import mongoose from 'mongoose';
import slugify from 'slugify';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: String,
  category: {
    type: String,
    enum: ['research_material', 'teaching_resource', 'report', 'policy_document', 'guide', 'manual', 'presentation', 'spreadsheet', 'other'],
    default: 'other'
  },
  tags: [String],
  authors: [String],
  publicationDate: Date,
  documentType: String,
  researchArea: String,
  language: { type: String, default: 'en' },
  isFeatured: { type: Boolean, default: false },
  downloadCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'registered', 'restricted'],
    default: 'public'
  },
  filePath: String,
  fileName: String,
  fileSize: Number,
  mimeType: String,
  currentVersion: { type: Number, default: 1 },
  displayOrder: { type: Number, default: 0 },
  relatedPublications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
  relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ResearchProject' }],
  relatedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

resourceSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

resourceSchema.index({ category: 1 });
resourceSchema.index({ status: 1 });
resourceSchema.index({ language: 1 });
resourceSchema.index({ tags: 1 });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
