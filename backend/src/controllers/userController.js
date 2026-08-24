import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';
import { PERMISSIONS, getEffectivePermissions } from '../middleware/rbac.js';

export const getAll = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [items, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const item = await User.findById(req.params.id).lean();
    if (!item) return sendError(res, 404, 'User not found');
    item.effectivePermissions = getEffectivePermissions(item.role, item.permissions);
    return sendSuccess(res, 200, 'User retrieved', item);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, email, password, role, permissions } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return sendError(res, 409, 'User with this email already exists');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'editor',
      permissions: permissions || [],
      createdBy: req.user._id,
    });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'User',
      entityId: user._id,
      description: `Created user: ${user.email} (role: ${user.role})`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, user, 'User created');
  } catch (error) {
    return next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) return sendError(res, 400, 'Role is required');

    if (req.params.id === req.user._id.toString()) {
      return sendError(res, 400, 'Cannot change your own role');
    }

    const item = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });
    if (!item) return sendError(res, 404, 'User not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'role_change',
      entityType: 'User',
      entityId: item._id,
      description: `Changed role of ${item.email} to ${role}`,
      metadata: { previousRole: item.role, newRole: role },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Role updated', item);
  } catch (error) {
    return next(error);
  }
};

export const updatePermissions = async (req, res, next) => {
  try {
    const { permissions } = req.body;
    if (!Array.isArray(permissions)) return sendError(res, 400, 'Permissions must be an array');

    const invalidPerms = permissions.filter(p => !Object.values(PERMISSIONS).includes(p));
    if (invalidPerms.length > 0) {
      return sendError(res, 400, `Invalid permissions: ${invalidPerms.join(', ')}`);
    }

    const item = await User.findByIdAndUpdate(req.params.id, { permissions }, { new: true });
    if (!item) return sendError(res, 404, 'User not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'User',
      entityId: item._id,
      description: `Updated permissions for ${item.email}`,
      metadata: { permissions },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Permissions updated', item);
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return sendError(res, 400, 'New password is required');

    const user = await User.findById(req.params.id).select('+password');
    if (!user) return sendError(res, 404, 'User not found');

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    await AuditLog.create({
      actor: req.user._id,
      action: 'password_reset',
      entityType: 'User',
      entityId: user._id,
      description: `Reset password for ${user.email}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Password reset successfully');
  } catch (error) {
    return next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('sessions name email').lean();
    if (!user) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, 'Sessions retrieved', user.sessions || []);
  } catch (error) {
    return next(error);
  }
};

export const revokeSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    user.sessions = user.sessions.filter(s => s._id.toString() !== req.params.sessionId);
    await user.save();

    await AuditLog.create({
      actor: req.user._id,
      action: 'session_revoke',
      entityType: 'User',
      entityId: user._id,
      description: `Revoked session for ${user.email}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Session revoked');
  } catch (error) {
    return next(error);
  }
};

export const revokeAllSessions = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    user.sessions = [];
    user.refreshTokens = [];
    await user.save();

    await AuditLog.create({
      actor: req.user._id,
      action: 'session_revoke_all',
      entityType: 'User',
      entityId: user._id,
      description: `Revoked all sessions for ${user.email}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'All sessions revoked');
  } catch (error) {
    return next(error);
  }
};

export const activate = async (req, res, next) => {
  try {
    const item = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!item) return sendError(res, 404, 'User not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'User',
      entityId: item._id,
      description: `Activated user: ${item.email}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'User activated', item);
  } catch (error) {
    return next(error);
  }
};

export const deactivate = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return sendError(res, 400, 'Cannot deactivate your own account');
    }

    const item = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!item) return sendError(res, 404, 'User not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'update',
      entityType: 'User',
      entityId: item._id,
      description: `Deactivated user: ${item.email}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'User deactivated', item);
  } catch (error) {
    return next(error);
  }
};

export const getPermissionsList = async (req, res, next) => {
  return sendSuccess(res, 200, 'Available permissions', Object.values(PERMISSIONS));
};
