import mongoose from 'mongoose';
import slugify from 'slugify';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  answer: { type: String, required: true },
  category: {
    type: String,
    enum: ['services', 'research', 'training', 'resources', 'consultation', 'general'],
    default: 'general'
  },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

faqSchema.pre('save', function () {
  if (this.isModified('question')) {
    this.slug = slugify(this.question, { lower: true, strict: true });
  }
});

faqSchema.index({ category: 1 });
faqSchema.index({ displayOrder: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;
