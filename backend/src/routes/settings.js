import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getAll,
  getPublicSettings,
  getByKey,
  update,
} from '../controllers/settingsController.js';

const router = Router();

router.get('/public', getPublicSettings);
router.get('/', authenticate, getAll);
router.get('/:key', authenticate, getByKey);
router.put('/:key', authenticate, requireRole('super_admin'), update);

export default router;
