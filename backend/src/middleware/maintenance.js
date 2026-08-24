import Setting from '../models/Setting.js';
import { sendError } from '../utils/apiResponse.js';

let maintenanceMode = false;
let maintenanceMessage = 'System is under maintenance. Please try again later.';

/**
 * Load maintenance mode from database on startup.
 */
export async function loadMaintenanceMode() {
  try {
    const setting = await Setting.findOne({ key: 'maintenance_mode' }).lean();
    maintenanceMode = setting?.value === true || setting?.value === 'true';
    const msgSetting = await Setting.findOne({ key: 'maintenance_message' }).lean();
    if (msgSetting?.value) maintenanceMessage = msgSetting.value;
  } catch {
    // Settings not yet available
  }
}

/**
 * Toggle maintenance mode.
 */
export function setMaintenanceMode(enabled, message) {
  maintenanceMode = enabled;
  if (message) maintenanceMessage = message;
}

export function getMaintenanceMode() {
  return { enabled: maintenanceMode, message: maintenanceMessage };
}

/**
 * Middleware: block non-admin users when maintenance mode is active.
 */
export function maintenanceMiddleware(req, res, next) {
  if (!maintenanceMode) return next();

  // Allow admin routes and health checks
  if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/health') || req.path.startsWith('/api/settings')) {
    return next();
  }

  // Allow authenticated admins
  if (req.user && ['super_admin', 'content_manager', 'editor'].includes(req.user.role)) {
    return next();
  }

  return sendError(res, 503, maintenanceMessage);
}
