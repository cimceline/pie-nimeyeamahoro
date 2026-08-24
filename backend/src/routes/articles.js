import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAll,
  getById,
  getFeatured,
  create,
  update,
  remove,
} from '../controllers/articleController.js';

const router = Router();

router.get('/featured', getFeatured);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);

export default router;
