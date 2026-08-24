import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getProfile,
  updateProfile,
  getPublicProfile,
} from '../controllers/profileController.js';

const router = Router();

router.get('/public', getPublicProfile);
router.get('/', authenticate, getProfile);
router.put('/', authenticate, requireRole('super_admin', 'content_manager'), updateProfile);

export default router;
