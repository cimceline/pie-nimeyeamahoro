import mongoose from 'mongoose';
import slugify from 'slugify';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: String,
  category: {
    type: String,
    enum: ['Research', 'Methodology', 'Evaluation', 'Project Management', 'Policy', 'Education', 'Consulting', 'Technical', 'Soft Skills', 'Language'],
    default: 'Research'
  },
  proficiency: {
    type: String,
    enum: ['expert', 'advanced', 'intermediate', 'beginner'],
    default: 'advanced'
  },
  yearsOfExperience: Number,
  relatedExpertise: [String],
  displayOrder: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

skillSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

skillSchema.index({ category: 1 });
skillSchema.index({ isFeatured: 1 });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
