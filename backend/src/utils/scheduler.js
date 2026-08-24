import { processScheduledPublications } from '../controllers/contentVersionController.js';
import { logger } from '../utils/logger.js';

let schedulerInterval = null;

/**
 * Start the scheduled publication processor.
 * Runs every 60 seconds to check for content that should be published/unpublished.
 */
export function startScheduler() {
  if (schedulerInterval) return;

  schedulerInterval = setInterval(async () => {
    try {
      const result = await processScheduledPublications();
      if (result.published > 0 || result.unpublished > 0) {
        logger.info(`Scheduler: Published ${result.published}, Unpublished ${result.unpublished}`);
      }
    } catch (error) {
      logger.error('Scheduler error:', error.message);
    }
  }, 60 * 1000);

  logger.info('Scheduled publication processor started');
}

/**
 * Stop the scheduler.
 */
export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    logger.info('Scheduled publication processor stopped');
  }
}

export default { startScheduler, stopScheduler };
