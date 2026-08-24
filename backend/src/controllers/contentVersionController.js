import ContentVersion from '../models/ContentVersion.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { getPaginationOptions, buildPaginationMeta } from '../utils/pagination.js';

const VERSIONABLE_TYPES = ['profile', 'education', 'experience', 'expertise', 'skill', 'project', 'publication', 'service', 'resource', 'article', 'academic_title', 'faq', 'setting'];

/**
 * Create a new version when content is edited.
 */
export const createVersion = async (req, res, next) => {
  try {
    const { resourceType, resourceId, changeSummary, newData, status, publishAt, unpublishAt } = req.body;

    if (!resourceType || !resourceId || !newData) {
      return sendError(res, 400, 'resourceType, resourceId, and newData are required');
    }
    if (!VERSIONABLE_TYPES.includes(resourceType)) {
      return sendError(res, 400, `Invalid resourceType. Must be one of: ${VERSIONABLE_TYPES.join(', ')}`);
    }

    // Get latest version number
    const latest = await ContentVersion.findOne({ resourceType, resourceId }).sort({ versionNumber: -1 }).lean();
    const versionNumber = latest ? latest.versionNumber + 1 : 1;

    // Mark previous versions as not latest
    await ContentVersion.updateMany(
      { resourceType, resourceId, isLatest: true },
      { isLatest: false }
    );

    const version = await ContentVersion.create({
      resourceType,
      resourceId,
      versionNumber,
      changedBy: req.user._id,
      changeSummary,
      previousData: latest?.newData || null,
      newData,
      status: status || 'draft',
      publishAt: publishAt || null,
      unpublishAt: unpublishAt || null,
      isLatest: true,
    });

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'ContentVersion',
      entityId: version._id,
      description: `Created version ${versionNumber} of ${resourceType}:${resourceId}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, version, 'Version created');
  } catch (error) {
    return next(error);
  }
};

/**
 * Get version history for a resource.
 */
export const getVersionHistory = async (req, res, next) => {
  try {
    const { resourceType, resourceId } = req.params;
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-versionNumber' });

    const filter = { resourceType, resourceId };
    const [items, total] = await Promise.all([
      ContentVersion.find(filter).sort(sort).skip(skip).limit(limit)
        .populate('changedBy', 'name email')
        .populate('reviewedBy', 'name email')
        .lean(),
      ContentVersion.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get a specific version.
 */
export const getVersion = async (req, res, next) => {
  try {
    const version = await ContentVersion.findById(req.params.id)
      .populate('changedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .lean();
    if (!version) return sendError(res, 404, 'Version not found');
    return sendSuccess(res, 200, 'Version retrieved', version);
  } catch (error) {
    return next(error);
  }
};

/**
 * Compare two versions.
 */
export const compareVersions = async (req, res, next) => {
  try {
    const { versionA, versionB } = req.params;
    const [a, b] = await Promise.all([
      ContentVersion.findById(versionA).lean(),
      ContentVersion.findById(versionB).lean(),
    ]);
    if (!a || !b) return sendError(res, 404, 'One or both versions not found');
    return sendSuccess(res, 200, 'Versions compared', { versionA: a, versionB: b });
  } catch (error) {
    return next(error);
  }
};

/**
 * Restore a previous version.
 */
export const restoreVersion = async (req, res, next) => {
  try {
    const version = await ContentVersion.findById(req.params.id);
    if (!version) return sendError(res, 404, 'Version not found');

    // Mark current as not latest
    await ContentVersion.updateMany(
      { resourceType: version.resourceType, resourceId: version.resourceId, isLatest: true },
      { isLatest: false }
    );

    // Create new version from the restored data
    const latest = await ContentVersion.findOne({ resourceType: version.resourceType, resourceId: version.resourceId }).sort({ versionNumber: -1 }).lean();
    const versionNumber = latest ? latest.versionNumber + 1 : 1;

    const restored = await ContentVersion.create({
      resourceType: version.resourceType,
      resourceId: version.resourceId,
      versionNumber,
      changedBy: req.user._id,
      changeSummary: `Restored from version ${version.versionNumber}`,
      previousData: latest?.newData || null,
      newData: version.newData,
      status: 'draft',
      isLatest: true,
    });

    await AuditLog.create({
      actor: req.user._id,
      action: 'restore',
      entityType: 'ContentVersion',
      entityId: restored._id,
      description: `Restored version ${version.versionNumber} as version ${versionNumber}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Version restored', restored);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update version status (draft → pending_review → approved → published → archived).
 */
export const updateVersionStatus = async (req, res, next) => {
  try {
    const { status, reviewComment } = req.body;
    const validTransitions = {
      draft: ['pending_review', 'archived'],
      pending_review: ['approved', 'draft'],
      approved: ['published', 'draft'],
      published: ['archived', 'draft'],
      archived: ['draft'],
    };

    const version = await ContentVersion.findById(req.params.id);
    if (!version) return sendError(res, 404, 'Version not found');

    if (!validTransitions[version.status]?.includes(status)) {
      return sendError(res, 400, `Cannot transition from ${version.status} to ${status}`);
    }

    version.status = status;
    if (reviewComment) version.reviewComment = reviewComment;
    if (['approved', 'published'].includes(status)) {
      version.reviewedBy = req.user._id;
      version.reviewedAt = new Date();
    }
    if (status === 'published') version.publishedAt = new Date();
    if (status === 'archived') version.archivedAt = new Date();

    await version.save();

    await AuditLog.create({
      actor: req.user._id,
      action: 'status_change',
      entityType: 'ContentVersion',
      entityId: version._id,
      description: `Changed status of version ${version.versionNumber} to ${status}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Status updated', version);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get all pending review versions.
 */
export const getPendingReview = async (req, res, next) => {
  try {
    const { page, limit, skip, sort } = getPaginationOptions(req.query, { sort: '-createdAt' });
    const filter = { status: 'pending_review' };
    if (req.query.resourceType) filter.resourceType = req.query.resourceType;

    const [items, total] = await Promise.all([
      ContentVersion.find(filter).sort(sort).skip(skip).limit(limit)
        .populate('changedBy', 'name email')
        .lean(),
      ContentVersion.countDocuments(filter),
    ]);

    return sendPaginated(res, items, buildPaginationMeta(total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Scheduled publication job — call this periodically (e.g., every minute via cron).
 * Publishes versions whose publishAt has passed and unpublishes versions whose unpublishAt has passed.
 */
export const processScheduledPublications = async () => {
  const now = new Date();

  // Publish scheduled content
  const toPublish = await ContentVersion.find({
    status: 'approved',
    publishAt: { $lte: now },
    $or: [{ publishAt: { $ne: null } }],
  });

  for (const version of toPublish) {
    version.status = 'published';
    version.publishedAt = now;
    version.publishAt = null;
    await version.save();
  }

  // Unpublish expired content
  const toUnpublish = await ContentVersion.find({
    status: 'published',
    unpublishAt: { $lte: now, $ne: null },
  });

  for (const version of toUnpublish) {
    version.status = 'archived';
    version.archivedAt = now;
    version.unpublishAt = null;
    await version.save();
  }

  return { published: toPublish.length, unpublished: toUnpublish.length };
};
