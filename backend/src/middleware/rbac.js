import { sendError } from '../utils/apiResponse.js';

/**
 * Granular permission definitions organized by module.
 */
export const PERMISSIONS = {
  // Profile
  PROFILE_READ: 'profile.read',
  PROFILE_WRITE: 'profile.write',
  // Documents / Resources
  DOCUMENTS_READ: 'documents.read',
  DOCUMENTS_WRITE: 'documents.write',
  // Translations
  TRANSLATIONS_READ: 'translations.read',
  TRANSLATIONS_WRITE: 'translations.write',
  // Comments
  COMMENTS_MODERATE: 'comments.moderate',
  // Messages
  MESSAGES_READ: 'messages.read',
  MESSAGES_REPLY: 'messages.reply',
  // Services
  SERVICES_WRITE: 'services.write',
  // Analytics
  ANALYTICS_READ: 'analytics.read',
  // Settings
  SETTINGS_WRITE: 'settings.write',
  // Users
  USERS_MANAGE: 'users.manage',
  // Audit
  AUDIT_READ: 'audit.read',
  // Content
  CONTENT_WRITE: 'content.write',
  CONTENT_PUBLISH: 'content.publish',
  CONTENT_REVIEW: 'content.review',
  // Announcements
  ANNOUNCEMENTS_WRITE: 'announcements.write',
  // Media
  MEDIA_WRITE: 'media.write',
  // Export
  EXPORT_DATA: 'export.data',
  // System
  SYSTEM_HEALTH: 'system.health',
  SYSTEM_MAINTENANCE: 'system.maintenance',
};

/**
 * Role-to-permission mapping.
 */
const ROLE_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS),
  content_manager: [
    PERMISSIONS.PROFILE_READ, PERMISSIONS.PROFILE_WRITE,
    PERMISSIONS.DOCUMENTS_READ, PERMISSIONS.DOCUMENTS_WRITE,
    PERMISSIONS.CONTENT_WRITE, PERMISSIONS.CONTENT_PUBLISH, PERMISSIONS.CONTENT_REVIEW,
    PERMISSIONS.COMMENTS_MODERATE,
    PERMISSIONS.TRANSLATIONS_READ, PERMISSIONS.TRANSLATIONS_WRITE,
    PERMISSIONS.MEDIA_WRITE,
    PERMISSIONS.ANNOUNCEMENTS_WRITE,
    PERMISSIONS.ANALYTICS_READ,
  ],
  communication_manager: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.MESSAGES_READ, PERMISSIONS.MESSAGES_REPLY,
    PERMISSIONS.COMMENTS_MODERATE,
    PERMISSIONS.ANNOUNCEMENTS_WRITE,
    PERMISSIONS.SERVICES_WRITE,
  ],
  translator: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.TRANSLATIONS_READ, PERMISSIONS.TRANSLATIONS_WRITE,
  ],
  analyst: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.ANALYTICS_READ, PERMISSIONS.AUDIT_READ,
    PERMISSIONS.EXPORT_DATA,
  ],
  editor: [
    PERMISSIONS.PROFILE_READ, PERMISSIONS.PROFILE_WRITE,
    PERMISSIONS.DOCUMENTS_READ, PERMISSIONS.DOCUMENTS_WRITE,
    PERMISSIONS.CONTENT_WRITE,
  ],
  moderator: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.COMMENTS_MODERATE,
    PERMISSIONS.MESSAGES_READ,
  ],
  research_manager: [
    PERMISSIONS.PROFILE_READ, PERMISSIONS.PROFILE_WRITE,
    PERMISSIONS.DOCUMENTS_READ, PERMISSIONS.DOCUMENTS_WRITE,
    PERMISSIONS.CONTENT_WRITE,
  ],
  service_manager: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.SERVICES_WRITE,
    PERMISSIONS.MESSAGES_READ, PERMISSIONS.MESSAGES_REPLY,
  ],
};

/**
 * Get effective permissions for a role + custom permissions combo.
 */
export function getEffectivePermissions(role, customPermissions = []) {
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  return [...new Set([...rolePerms, ...customPermissions])];
}

/**
 * Check if a user has a specific permission.
 */
export function userHasPermission(user, permission) {
  if (user.role === 'super_admin') return true;
  const effective = getEffectivePermissions(user.role, user.permissions || []);
  return effective.includes(permission);
}

/**
 * Middleware: require specific permission(s).
 * @param  {...string} requiredPermissions
 */
export function requirePermission(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }
    if (req.user.role === 'super_admin') return next();

    const effective = getEffectivePermissions(req.user.role, req.user.permissions || []);
    const hasAccess = requiredPermissions.some(p => effective.includes(p));

    if (!hasAccess) {
      return sendError(res, 403, 'Insufficient permissions');
    }
    next();
  };
}

/**
 * Role-based access control middleware factory.
 * @param  {...string} allowedRoles - Roles permitted to access the route
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }
    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, 'You do not have permission to access this resource');
    }
    next();
  };
}

/**
 * Middleware that checks if the user has at least one of the specified roles
 * based on the role hierarchy.
 */
export function requireMinimumRole(...minimumRoles) {
  const ROLE_HIERARCHY = {
    super_admin: ['super_admin', 'content_manager', 'editor', 'moderator', 'research_manager', 'service_manager', 'communication_manager', 'translator', 'analyst'],
    content_manager: ['content_manager', 'editor', 'moderator'],
    editor: ['editor', 'moderator'],
    moderator: ['moderator'],
    research_manager: ['research_manager'],
    service_manager: ['service_manager'],
    communication_manager: ['communication_manager'],
    translator: ['translator'],
    analyst: ['analyst'],
  };

  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }
    const userHierarchy = ROLE_HIERARCHY[req.user.role] || [];
    const hasAccess = minimumRoles.some((role) => userHierarchy.includes(role));
    if (!hasAccess) {
      return sendError(res, 403, 'Insufficient permissions');
    }
    next();
  };
}

/**
 * Middleware that checks if the user owns the resource or is an admin/editor.
 */
export function requireOwnershipOrRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }
    if (allowedRoles.includes(req.user.role)) return next();
    if (req.resource && req.resource.user && req.resource.user.toString() === req.user._id.toString()) {
      return next();
    }
    return sendError(res, 403, 'You can only modify your own resources');
  };
}

export default { PERMISSIONS, ROLE_PERMISSIONS, getEffectivePermissions, userHasPermission, requirePermission, requireRole, requireMinimumRole, requireOwnershipOrRole };
