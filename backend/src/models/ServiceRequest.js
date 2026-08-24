import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  organization: String,
  country: String,
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp', 'video_call'],
    default: 'email'
  },
  budget: String,
  preferredTimeline: String,
  projectDescription: { type: String, required: true },
  goals: String,
  additionalMessage: String,
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'contacted', 'proposal_sent', 'accepted', 'rejected', 'completed', 'archived'],
    default: 'pending'
  },
  internalNotes: [{
    note: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  ipAddress: String
}, { timestamps: true });

serviceRequestSchema.index({ status: 1 });
serviceRequestSchema.index({ createdAt: -1 });
serviceRequestSchema.index({ service: 1 });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;
