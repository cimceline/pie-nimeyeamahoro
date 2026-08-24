import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  department: String,
  employmentType: {
    type: String,
    enum: ['full_time', 'part_time', 'contract', 'freelance', 'volunteer', 'internship'],
    default: 'full_time'
  },
  country: String,
  city: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  description: String,
  responsibilities: [String],
  achievements: [String],
  skillsUsed: [String],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  publications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
  relatedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  displayOrder: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

experienceSchema.index({ displayOrder: 1 });
experienceSchema.index({ isCurrent: 1 });

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
