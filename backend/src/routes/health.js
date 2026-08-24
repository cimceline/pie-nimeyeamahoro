import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requirePermission } from '../middleware/rbac.js';
import { healthCheck, databaseHealth, systemHealth, storageHealth } from '../controllers/healthController.js';

const router = Router();

router.get('/', healthCheck);
router.get('/database', authenticate, requirePermission('system.health'), databaseHealth);
router.get('/system', authenticate, requirePermission('system.health'), systemHealth);
router.get('/storage', authenticate, requirePermission('system.health'), storageHealth);

export default router;
