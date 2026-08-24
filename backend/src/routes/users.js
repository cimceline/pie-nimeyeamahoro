import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requirePermission } from '../middleware/rbac.js';
import {
  getAll,
  getById,
  create,
  updateRole,
  updatePermissions,
  resetPassword,
  getSessions,
  revokeSession,
  revokeAllSessions,
  activate,
  deactivate,
  getPermissionsList,
} from '../controllers/userController.js';

const router = Router();

router.use(authenticate, requireRole('super_admin'));

router.get('/permissions', getPermissionsList);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id/role', updateRole);
router.put('/:id/permissions', updatePermissions);
router.put('/:id/reset-password', resetPassword);
router.put('/:id/activate', activate);
router.put('/:id/deactivate', deactivate);
router.get('/:id/sessions', getSessions);
router.delete('/:id/sessions/:sessionId', revokeSession);
router.delete('/:id/sessions', revokeAllSessions);

export default router;
