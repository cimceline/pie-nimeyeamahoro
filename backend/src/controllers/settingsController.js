import Setting from '../models/Setting.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getAll = async (req, res, next) => {
  try {
    const settings = await Setting.find().sort({ category: 1, key: 1 }).lean();
    const result = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return sendSuccess(res, 200, 'Settings retrieved', result);
  } catch (error) {
    return next(error);
  }
};

export const getByKey = async (req, res, next) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key }).lean();
    if (!setting) return sendError(res, 404, 'Setting not found');
    return sendSuccess(res, 200, 'Setting retrieved', setting);
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) return sendError(res, 400, 'Value is required');

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true, runValidators: true }
    );

    await AuditLog.create({
      actor: req.user._id,
      action: 'settings_change',
      entityType: 'Setting',
      entityId: setting._id,
      description: `Updated setting: ${key}`,
      metadata: { key, value },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Setting updated', setting);
  } catch (error) {
    return next(error);
  }
};

export const getPublicSettings = async (req, res, next) => {
  try {
    const publicKeys = [
      'site_name', 'site_description', 'site_logo', 'site_favicon',
      'social_links', 'contact_email', 'contact_phone', 'contact_address',
      'google_analytics_id', 'meta_title', 'meta_description',
      'general.siteName', 'general.contactEmail',
      'seo.defaultTitle', 'seo.defaultDescription',
      'appearance.primaryColor',
      'comments.enabled', 'newsletter.enabled',
    ];
    const settings = await Setting.find({ key: { $in: publicKeys } }).lean();
    const result = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return sendSuccess(res, 200, 'Public settings', result);
  } catch (error) {
    return next(error);
  }
};
