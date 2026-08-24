import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sessionSchema = new mongoose.Schema({
  token: { type: String, required: true },
  device: String,
  browser: String,
  ip: String,
  location: String,
  loginAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, { _id: true });

const passwordHistorySchema = new mongoose.Schema({
  password: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['super_admin', 'content_manager', 'communication_manager', 'translator', 'analyst', 'editor', 'moderator', 'research_manager', 'service_manager'],
    default: 'editor'
  },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  refreshTokens: [String],
  avatar: String,
  // 2FA
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, select: false },
  twoFactorRecoveryCodes: [{ type: String, select: false }],
  // Sessions
  sessions: [sessionSchema],
  // Password history
  passwordHistory: [passwordHistorySchema],
  passwordExpiresAt: Date,
  // Password reset
  resetToken: { type: String, select: false },
  resetTokenExpires: { type: Date, select: false },
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.twoFactorSecret;
  delete obj.twoFactorRecoveryCodes;
  delete obj.sessions;
  delete obj.passwordHistory;
  return obj;
};

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.hasPermission = function (permission) {
  if (this.role === 'super_admin') return true;
  return this.permissions.includes(permission);
};

userSchema.methods.hasAnyPermission = function (...perms) {
  if (this.role === 'super_admin') return true;
  return perms.some(p => this.permissions.includes(p));
};

const User = mongoose.model('User', userSchema);
export default User;
