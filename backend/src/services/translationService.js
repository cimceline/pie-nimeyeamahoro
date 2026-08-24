import { Translation } from '../models/Translation.js';
import { logger } from '../utils/logger.js';

class TranslationService {
  /**
   * Store or update a translation.
   * @param {object} data - { contentId, contentType, sourceLanguage, targetLanguage, sourceText, translatedText, field, translatedBy, translatedById }
   * @returns {Promise<object>} Saved translation
   */
  async translateContent(data) {
    const filter = {
      contentId: data.contentId,
      contentType: data.contentType,
      targetLanguage: data.targetLanguage,
      field: data.field || 'content',
    };

    const update = {
      sourceLanguage: data.sourceLanguage || 'en',
      sourceText: data.sourceText,
      translatedText: data.translatedText,
      translatedBy: data.translatedBy || 'manual',
      translatedById: data.translatedById || null,
      isOutdated: false,
      lastSourceUpdate: new Date(),
    };

    return Translation.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
      runValidators: true,
    });
  }

  /**
   * Get a specific translation.
   * @param {object} query - { contentId, contentType, targetLanguage, field }
   * @returns {Promise<object|null>} Translation or null
   */
  async getTranslation(query) {
    return Translation.findOne({
      contentId: query.contentId,
      contentType: query.contentType,
      targetLanguage: query.targetLanguage,
      field: query.field || 'content',
    });
  }

  /**
   * Get all translations for a piece of content.
   * @param {object} query - { contentId, contentType }
   * @returns {Promise<Array>} Translations
   */
  async getAllTranslations(query) {
    return Translation.find({
      contentId: query.contentId,
      contentType: query.contentType,
    }).sort({ targetLanguage: 1, field: 1 });
  }

  /**
   * Mark translations as outdated when source content changes.
   * @param {object} query - { contentId, contentType }
   * @returns {Promise<object>} Update result
   */
  async markOutdated(query) {
    return Translation.updateMany(
      {
        contentId: query.contentId,
        contentType: query.contentType,
      },
      { isOutdated: true },
    );
  }

  /**
   * Delete all translations for a piece of content.
   * @param {object} query - { contentId, contentType }
   * @returns {Promise<object>} Delete result
   */
  async deleteTranslations(query) {
    return Translation.deleteMany({
      contentId: query.contentId,
      contentType: query.contentType,
    });
  }

  /**
   * Get translation statistics.
   * @param {string} contentType
   * @returns {Promise<Array>} Stats by language
   */
  async getTranslationStats(contentType) {
    return Translation.aggregate([
      { $match: { contentType } },
      {
        $group: {
          _id: '$targetLanguage',
          total: { $sum: 1 },
          outdated: { $sum: { $cond: ['$isOutdated', 1, 0] } },
          upToDate: { $sum: { $cond: ['$isOutdated', 0, 1] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}

const translationService = new TranslationService();
export default translationService;
export { Translation, TranslationService };
