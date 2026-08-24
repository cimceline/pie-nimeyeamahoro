import { Router } from 'express';
import { search, autocomplete } from '../controllers/searchController.js';

const router = Router();

router.get('/', search);
router.get('/autocomplete', autocomplete);

export default router;
