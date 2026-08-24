import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getAll,
  getPublished,
  getBySlug,
  getById,
  create,
  update,
  remove,
  incrementDownload,
} from '../controllers/bookController.js';

const router = Router();

// Public routes
router.get('/published', getPublished);
router.get('/:slug', getBySlug);

// Admin routes
router.get('/', authenticate, getAll);
router.get('/admin/:id', authenticate, getById);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.post('/:id/download', incrementDownload);

export default router;
