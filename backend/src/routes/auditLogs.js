import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getAll,
  getByEntity,
} from '../controllers/auditLogController.js';

const router = Router();

router.use(authenticate, requireRole('super_admin'));

router.get('/', getAll);
router.get('/entity/:type/:id', getByEntity);

export default router;
