import mongoose from 'mongoose';

const resourceVersionSchema = new mongoose.Schema({
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  version: { type: Number, required: true },
  filePath: { type: String, required: true },
  fileName: String,
  fileSize: Number,
  mimeType: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changeDescription: String,
  status: {
    type: String,
    enum: ['current', 'archived', 'superseded'],
    default: 'current'
  }
}, { timestamps: true });

resourceVersionSchema.index({ resource: 1, version: 1 });

const ResourceVersion = mongoose.model('ResourceVersion', resourceVersionSchema);
export default ResourceVersion;
