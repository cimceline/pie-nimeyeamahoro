import mongoose from 'mongoose';

const academicTitleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  country: {
    type: String,
    enum: ['italy', 'us', 'uk', 'other'],
    required: true
  },
  equivalentIt: String,
  equivalentUs: String,
  equivalentUk: String,
  description: String,
  requirements: String,
  notes: String,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

academicTitleSchema.index({ country: 1 });

const AcademicTitle = mongoose.model('AcademicTitle', academicTitleSchema);
export default AcademicTitle;
