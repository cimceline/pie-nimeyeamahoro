import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../controllers/academicTitleController.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);

export default router;
