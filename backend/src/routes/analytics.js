import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getStats,
  getPopularContent,
  getEventTypes,
  getTimeline,
  trackEvent,
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/stats', authenticate, getStats);
router.get('/popular', authenticate, getPopularContent);
router.get('/types', authenticate, getEventTypes);
router.get('/timeline', authenticate, getTimeline);
router.post('/track', trackEvent);

export default router;
