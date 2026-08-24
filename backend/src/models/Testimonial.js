import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorPosition: String,
  authorOrganization: String,
  quote: { type: String, required: true },
  authorImage: String,
  date: Date,
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sourceUrl: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

testimonialSchema.index({ isFeatured: 1 });
testimonialSchema.index({ isActive: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
