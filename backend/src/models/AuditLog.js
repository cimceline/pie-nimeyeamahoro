import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: {
    type: String,
    enum: ['login', 'logout', 'login_failed', 'create', 'update', 'delete', 'upload', 'replace', 'publish', 'moderate', 'role_change', 'settings_change', 'export', 'password_reset', 'session_revoke', 'session_revoke_all', 'restore', 'status_change'],
    required: true
  },
  entityType: String,
  entityId: mongoose.Schema.Types.ObjectId,
  description: String,
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

auditLogSchema.index({ actor: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entityType: 1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
