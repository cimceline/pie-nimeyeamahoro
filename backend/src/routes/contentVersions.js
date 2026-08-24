import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requirePermission } from '../middleware/rbac.js';
import {
  createVersion,
  getVersionHistory,
  getVersion,
  compareVersions,
  restoreVersion,
  updateVersionStatus,
  getPendingReview,
} from '../controllers/contentVersionController.js';

const router = Router();

router.use(authenticate);

// Version history
router.get('/resource/:resourceType/:resourceId', getVersionHistory);

// Pending review (requires review permission)
router.get('/pending-review', requirePermission('content.review'), getPendingReview);

// Compare two versions
router.get('/compare/:versionA/:versionB', compareVersions);

// Get single version
router.get('/:id', getVersion);

// Create version (anyone with content.write)
router.post('/', requirePermission('content.write'), createVersion);

// Update status (review workflow)
router.put('/:id/status', requirePermission('content.review', 'content.publish'), updateVersionStatus);

// Restore a version
router.post('/:id/restore', requirePermission('content.write'), restoreVersion);

export default router;
