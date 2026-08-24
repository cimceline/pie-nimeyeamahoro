import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAll,
  getById,
  create,
  updateStatus,
  addInternalNote,
} from '../controllers/contactController.js';

const router = Router();

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.post('/', create);
router.put('/:id/status', authenticate, updateStatus);
router.post('/:id/notes', authenticate, addInternalNote);

export default router;
