import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getAll,
  getByEntity,
  create,
  updateStatus,
  remove,
  report,
} from '../controllers/commentController.js';

const router = Router();

router.get('/entity/:entityType/:entityId', getByEntity);
router.get('/', authenticate, getAll);
router.post('/', create);
router.put('/:id/status', authenticate, requireRole('super_admin', 'moderator', 'editor'), updateStatus);
router.delete('/:id', authenticate, remove);
router.post('/:id/report', report);

export default router;
