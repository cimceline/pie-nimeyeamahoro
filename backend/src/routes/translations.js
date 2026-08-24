import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import Translation from '../models/Translation.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  getByEntity,
  createOrUpdate,
  markOutdated,
  remove,
} from '../controllers/translationController.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const translations = await Translation.find().sort({ createdAt: -1 }).lean();
    return sendSuccess(res, 200, 'Translations retrieved', translations);
  } catch (error) {
    return next(error);
  }
});

router.get('/:entityType/:entityId', getByEntity);
router.post('/', authenticate, createOrUpdate);
router.put('/:entityType/:entityId/outdated', authenticate, markOutdated);
router.delete('/:id', authenticate, remove);

export default router;
