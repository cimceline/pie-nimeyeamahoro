import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  exportContacts,
  exportComments,
  exportServiceRequests,
  exportAuditLogs,
  exportAnalytics,
} from '../controllers/exportController.js';

const router = Router();

router.use(authenticate, requirePermission('export.data'));

router.get('/contacts', exportContacts);
router.get('/comments', exportComments);
router.get('/service-requests', exportServiceRequests);
router.get('/audit-logs', exportAuditLogs);
router.get('/analytics', exportAnalytics);

export default router;
