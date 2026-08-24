import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import {
  getAll,
  upload,
  remove,
} from '../controllers/mediaController.js';

const router = Router();

router.get('/', authenticate, getAll);
router.post('/upload', authenticate, uploadSingle('file'), upload);
router.delete('/:id', authenticate, remove);

export default router;
