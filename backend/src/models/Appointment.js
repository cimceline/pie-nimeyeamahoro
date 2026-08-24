import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  preferredDate: Date,
  alternativeDate: Date,
  timezone: String,
  duration: { type: Number, default: 60 },
  meetingType: {
    type: String,
    enum: ['video_call', 'phone_call', 'in_person', 'online'],
    default: 'video_call'
  },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

appointmentSchema.index({ status: 1 });
appointmentSchema.index({ preferredDate: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
