import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import emailService from '../services/emailService.js';
import { sendSuccess, sendError, sendCreated } from '../utils/apiResponse.js';
import { generateTokens } from '../middleware/auth.js';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

async function logAudit(actor, action, description, req, metadata = {}) {
  await AuditLog.create({
    actor,
    action,
    description,
    entityType: 'User',
    entityId: actor,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    metadata,
  });
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }

    if (req.user && req.user.role !== 'super_admin') {
      return sendError(res, 403, 'Only super_admin can create users');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 409, 'User with this email already exists');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'editor',
    });

    await logAudit(user._id, 'create', 'User registered', req, { email });

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshTokens.push(refreshToken);
    await user.save();

    return sendCreated(res, {
      user,
      accessToken,
      refreshToken,
    }, 'User registered successfully');
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Account has been deactivated');
    }

    // Auto-unlock if lock period has expired
    if (user.lockUntil && user.lockUntil <= new Date()) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }

    if (user.isLocked) {
      return sendError(res, 423, 'Account is temporarily locked due to too many failed login attempts. Try again later.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
      }
      await user.save();

      await logAudit(user._id, 'login_failed', 'Failed login attempt', req, { email, attempts: user.loginAttempts });

      return sendError(res, 401, 'Invalid email or password');
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshTokens.push(refreshToken);
    await user.save();

    await logAudit(user._id, 'login', 'User logged in', req, { email });

    return sendSuccess(res, 200, 'Login successful', {
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;

    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }

    await logAudit(user._id, 'logout', 'User logged out', req);

    return sendSuccess(res, 200, 'Logged out successfully');
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 400, 'Refresh token is required');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch {
      return sendError(res, 401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user) {
      return sendError(res, 401, 'User not found');
    }

    if (!user.refreshTokens.includes(refreshToken)) {
      user.refreshTokens = [];
      await user.save();
      return sendError(res, 401, 'Refresh token has been revoked');
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const tokens = generateTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return sendSuccess(res, 200, 'Tokens refreshed', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendSuccess(res, 200, 'User profile', user);
  } catch (error) {
    return next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'Current password and new password are required');
    }

    if (newPassword.length < 8) {
      return sendError(res, 400, 'New password must be at least 8 characters');
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 401, 'Current password is incorrect');
    }

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    await logAudit(user._id, 'update', 'Password changed', req);

    return sendSuccess(res, 200, 'Password updated successfully. Please log in again.');
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, 'Email is required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendSuccess(res, 200, 'If an account exists with that email, a reset link has been sent.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    await User.findByIdAndUpdate(user._id, {
      $set: {
        resetToken: resetTokenHash,
        resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    try {
      await emailService.sendPasswordReset(user, resetToken);
    } catch (emailErr) {
      console.error('Failed to send reset email:', emailErr.message);
    }

    await logAudit(user._id, 'password_reset', 'Password reset requested', req, { email });

    return sendSuccess(res, 200, 'If an account exists with that email, a reset link has been sent.');
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return sendError(res, 400, 'Token and password are required');
    }

    if (password.length < 8) {
      return sendError(res, 400, 'Password must be at least 8 characters');
    }

    // Hash the token from the request and find the user
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: resetTokenHash,
      resetTokenExpires: { $gt: new Date() },
    }).select('+resetToken +resetTokenExpires');

    if (!user) {
      return sendError(res, 400, 'Invalid or expired reset token');
    }

    // Set new password
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    user.refreshTokens = []; // Invalidate all sessions
    await user.save();

    await logAudit(user._id, 'password_reset', 'Password reset via token', req);

    return sendSuccess(res, 200, 'Password reset successfully. Please log in.');
  } catch (error) {
    return next(error);
  }
};
