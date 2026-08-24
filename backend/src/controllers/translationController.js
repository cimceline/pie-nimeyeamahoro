import Translation from '../models/Translation.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError, sendCreated } from '../utils/apiResponse.js';

export const getByEntity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const translations = await Translation.find({ entityType, entityId }).lean();
    return sendSuccess(res, 200, 'Translations retrieved', translations);
  } catch (error) {
    return next(error);
  }
};

export const createOrUpdate = async (req, res, next) => {
  try {
    const { entityType, entityId, language, translatedTitle, translatedDescription, translatedContent } = req.body;
    if (!entityType || !entityId || !language) {
      return sendError(res, 400, 'Entity type, entity ID, and language are required');
    }

    const translation = await Translation.findOneAndUpdate(
      { entityType, entityId, language },
      {
        translatedTitle,
        translatedDescription,
        translatedContent,
        status: 'draft',
        translator: req.user._id.toString(),
      },
      { new: true, upsert: true, runValidators: true }
    );

    await AuditLog.create({
      actor: req.user._id,
      action: 'create',
      entityType: 'Translation',
      entityId: translation._id,
      description: `Translation ${translation.isNew ? 'created' : 'updated'}: ${language}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendCreated(res, translation, 'Translation saved');
  } catch (error) {
    return next(error);
  }
};

export const markOutdated = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const result = await Translation.updateMany(
      { entityType, entityId, status: 'published' },
      { $set: { status: 'outdated' } }
    );

    return sendSuccess(res, 200, `${result.modifiedCount} translations marked as outdated`);
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Translation.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Translation not found');

    await AuditLog.create({
      actor: req.user._id,
      action: 'delete',
      entityType: 'Translation',
      entityId: item._id,
      description: 'Translation deleted',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Translation deleted');
  } catch (error) {
    return next(error);
  }
};
