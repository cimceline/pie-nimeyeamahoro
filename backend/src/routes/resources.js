import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import {
  getAll,
  getById,
  getFeatured,
  create,
  update,
  remove,
  download,
} from '../controllers/resourceController.js';

const router = Router();

router.get('/featured', getFeatured);
router.get('/', getAll);
router.get('/:id/download', download);
router.get('/:id', getById);
router.post('/', authenticate, uploadSingle('file'), create);
router.put('/:id', authenticate, uploadSingle('file'), update);
router.delete('/:id', authenticate, remove);

export default router;
