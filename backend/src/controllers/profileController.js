import Profile from '../models/Profile.js';
import { sendSuccess, sendError, sendCreated } from '../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne().lean();
    if (!profile) {
      return sendError(res, 404, 'Profile not found');
    }
    return sendSuccess(res, 200, 'Profile retrieved', profile);
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'professionalName', 'headline', 'profileImage', 'coverImage',
      'shortBio', 'fullBio', 'professionalSummary', 'academicSummary',
      'researchInterests', 'professionalMission', 'professionalVision',
      'areasOfSpecialization', 'currentPosition', 'location', 'contactInfo',
      'socialLinks', 'identifiers', 'languages', 'seoTitle', 'seoDescription', 'canonicalUrl',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return sendSuccess(res, 200, 'Profile updated', profile);
  } catch (error) {
    return next(error);
  }
};

export const getPublicProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne()
      .select('professionalName headline profileImage shortBio currentPosition location socialLinks areasOfSpecialization researchInterests languages')
      .lean();

    if (!profile) {
      return sendError(res, 404, 'Profile not found');
    }

    return sendSuccess(res, 200, 'Public profile', profile);
  } catch (error) {
    return next(error);
  }
};
