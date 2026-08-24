import mongoose from 'mongoose';
import slugify from 'slugify';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: true },
  content: { type: String },
  author: { type: String, required: true },
  authorBio: String,
  coverImage: String,
  category: {
    type: String,
    enum: ['academic', 'research', 'education', 'social_science', 'policy', 'guide', 'report', 'other'],
    default: 'other'
  },
  tags: [String],
  language: { type: String, default: 'en' },
  isbn: String,
  publisher: String,
  publishedAt: Date,
  edition: String,
  pageCount: Number,
  filePath: String,
  fileName: String,
  fileSize: Number,
  mimeType: String,
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  visibility: {
    type: String,
    enum: ['public', 'registered'],
    default: 'public'
  },
  relatedPublications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
  relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ResearchProject' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

bookSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

bookSchema.index({ category: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ tags: 1 });
bookSchema.index({ createdAt: -1 });

const Book = mongoose.model('Book', bookSchema);
export default Book;
