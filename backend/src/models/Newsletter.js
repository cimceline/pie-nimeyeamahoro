import mongoose from 'mongoose';
import crypto from 'crypto';

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: String,
  language: { type: String, default: 'en' },
  status: {
    type: String,
    enum: ['pending', 'active', 'unsubscribed', 'bounced'],
    default: 'pending'
  },
  verificationToken: String,
  unsubscribeToken: String,
  verifiedAt: Date,
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date,
  source: String
}, { timestamps: true });

newsletterSchema.pre('save', function () {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  }
  if (!this.verificationToken) {
    this.verificationToken = crypto.randomBytes(32).toString('hex');
  }
});

newsletterSchema.index({ email: 1 }, { unique: true });
newsletterSchema.index({ status: 1 });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;
