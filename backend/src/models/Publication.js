import mongoose from 'mongoose';
import slugify from 'slugify';

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  subtitle: String,
  publicationType: {
    type: String,
    enum: ['journal_article', 'book', 'book_chapter', 'conference_paper', 'report', 'policy_brief', 'working_paper', 'research_report', 'dataset', 'teaching_material', 'other'],
    required: true
  },
  abstract: String,
  authors: [String],
  coAuthors: [String],
  journal: String,
  publisher: String,
  publicationDate: Date,
  doi: String,
  isbn: String,
  issn: String,
  volume: String,
  issue: String,
  pages: String,
  keywords: [String],
  researchArea: String,
  citation: {
    apa: String,
    chicago: String,
    mla: String,
    simplified: String
  },
  externalUrl: String,
  pdfFile: String,
  coverImage: String,
  language: { type: String, default: 'en' },
  isFeatured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'under_review'],
    default: 'draft'
  },
  viewCount: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

publicationSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

publicationSchema.index({ publicationType: 1 });
publicationSchema.index({ status: 1 });
publicationSchema.index({ publicationDate: -1 });
publicationSchema.index({ keywords: 1 });

const Publication = mongoose.model('Publication', publicationSchema);
export default Publication;
