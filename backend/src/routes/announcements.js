import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requirePermission } from '../middleware/rbac.js';
import {
  getAll,
  getPublic,
  getById,
  create,
  update,
  remove,
  trackView,
  trackClick,
} from '../controllers/announcementController.js';

const router = Router();

// Public routes
router.get('/public', getPublic);
router.post('/:id/view', trackView);
router.post('/:id/click', trackClick);

// Admin routes
router.get('/', authenticate, requirePermission('announcements.write'), getAll);
router.get('/:id', authenticate, requirePermission('announcements.write'), getById);
router.post('/', authenticate, requirePermission('announcements.write'), create);
router.put('/:id', authenticate, requirePermission('announcements.write'), update);
router.delete('/:id', authenticate, requirePermission('announcements.write'), remove);

export default router;
