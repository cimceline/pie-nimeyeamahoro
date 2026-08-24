import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  subscribe,
  unsubscribe,
  verify,
  getAll,
  remove,
} from '../controllers/newsletterController.js';

const router = Router();

router.post('/subscribe', subscribe);
router.get('/unsubscribe/:token', unsubscribe);
router.get('/verify/:token', verify);
router.get('/', authenticate, getAll);
router.delete('/:id', authenticate, remove);

export default router;
