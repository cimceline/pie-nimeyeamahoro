import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  qualification: { type: String, required: true },
  degreeType: {
    type: String,
    enum: ['PhD', 'Master', 'Bachelor', 'Diploma', 'Certificate', 'Fellowship', 'Professional Qualification', 'Other'],
    required: true
  },
  institution: { type: String, required: true },
  faculty: String,
  department: String,
  fieldOfStudy: String,
  country: String,
  city: String,
  startDate: Date,
  endDate: Date,
  completionDate: Date,
  description: String,
  thesisTitle: String,
  supervisor: String,
  grade: String,
  researchArea: String,
  certificates: [{
    name: String,
    fileUrl: String,
    fileName: String
  }],
  displayOrder: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

educationSchema.index({ displayOrder: 1 });
educationSchema.index({ isPublished: 1 });

const Education = mongoose.model('Education', educationSchema);
export default Education;
