import mongoose from 'mongoose';
import slugify from 'slugify';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  excerpt: String,
  body: String,
  featuredImage: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: {
    type: String,
    enum: ['research', 'education', 'policy', 'consulting', 'methodology', 'opinion', 'news', 'tutorial'],
    default: 'education'
  },
  tags: [String],
  language: { type: String, default: 'en' },
  seoTitle: String,
  seoDescription: String,
  canonicalUrl: String,
  status: {
    type: String,
    enum: ['draft', 'review', 'scheduled', 'published', 'archived'],
    default: 'draft'
  },
  scheduledPublishDate: Date,
  isFeatured: { type: Boolean, default: false },
  readingTime: Number,
  viewCount: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

articleSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('body') && this.body) {
    const words = this.body.split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(words / 200));
  }
});

articleSchema.index({ status: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ tags: 1 });

const Article = mongoose.model('Article', articleSchema);
export default Article;
