import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAll,
  getById,
  create,
  updateStatus,
} from '../controllers/appointmentController.js';

const router = Router();

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.post('/', create);
router.put('/:id/status', authenticate, updateStatus);

export default router;
