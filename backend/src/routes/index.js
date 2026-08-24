import { Router } from 'express';
import authRoutes from './auth.js';
import profileRoutes from './profile.js';
import educationRoutes from './education.js';
import skillsRoutes from './skills.js';
import experienceRoutes from './experience.js';
import publicationsRoutes from './publications.js';
import researchProjectsRoutes from './researchProjects.js';
import projectsRoutes from './projects.js';
import expertiseRoutes from './expertise.js';
import resourcesRoutes from './resources.js';
import servicesRoutes from './services.js';
import serviceRequestsRoutes from './serviceRequests.js';
import appointmentsRoutes from './appointments.js';
import articlesRoutes from './articles.js';
import commentsRoutes from './comments.js';
import newsletterRoutes from './newsletter.js';
import contactRoutes from './contact.js';
import analyticsRoutes from './analytics.js';
import mediaRoutes from './media.js';
import searchRoutes from './search.js';
import settingsRoutes from './settings.js';
import translationsRoutes from './translations.js';
import usersRoutes from './users.js';
import auditLogsRoutes from './auditLogs.js';
import faqsRoutes from './faqs.js';
import testimonialsRoutes from './testimonials.js';
import academicTitlesRoutes from './academicTitles.js';
import researchInterestsRoutes from './researchInterests.js';
import contentVersionRoutes from './contentVersions.js';
import announcementRoutes from './announcements.js';
import bookRoutes from './books.js';
import healthRoutes from './health.js';
import exportRoutes from './export.js';

import {
  readLimiter,
  writeLimiter,
  formLimiter,
  uploadLimiter,
  searchLimiter,
} from '../middleware/rateLimiter.js';

const router = Router();

// ---------------------------------------------------------------------------
// Auth — strict anti-brute-force (configured inside auth.js routes)
// ---------------------------------------------------------------------------
router.use('/auth', authRoutes);

// ---------------------------------------------------------------------------
// Public read-only content — generous read limiter (GET only)
// These are the main portfolio content endpoints. The readLimiter allows
// 500 req/min in production, which is more than enough for human traffic.
// ---------------------------------------------------------------------------
router.use('/profile', readLimiter, profileRoutes);
router.use('/education', readLimiter, educationRoutes);
router.use('/skills', readLimiter, skillsRoutes);
router.use('/experience', readLimiter, experienceRoutes);
router.use('/publications', readLimiter, publicationsRoutes);
router.use('/research-projects', readLimiter, researchProjectsRoutes);
router.use('/projects', readLimiter, projectsRoutes);
router.use('/expertise', readLimiter, expertiseRoutes);
router.use('/resources', readLimiter, resourcesRoutes);
router.use('/services', readLimiter, servicesRoutes);
router.use('/articles', readLimiter, articlesRoutes);
router.use('/faqs', readLimiter, faqsRoutes);
router.use('/testimonials', readLimiter, testimonialsRoutes);
router.use('/academic-titles', readLimiter, academicTitlesRoutes);
router.use('/research-interests', readLimiter, researchInterestsRoutes);
router.use('/settings', readLimiter, settingsRoutes);

// ---------------------------------------------------------------------------
// Search — moderate limiter
// ---------------------------------------------------------------------------
router.use('/search', searchLimiter, searchRoutes);

// ---------------------------------------------------------------------------
// Public form submissions — strict form limiter to prevent spam
// ---------------------------------------------------------------------------
router.use('/contact', formLimiter, contactRoutes);
router.use('/comments', formLimiter, commentsRoutes);
router.use('/newsletter', formLimiter, newsletterRoutes);
router.use('/service-requests', formLimiter, serviceRequestsRoutes);
router.use('/appointments', formLimiter, appointmentsRoutes);

// ---------------------------------------------------------------------------
// Authenticated admin operations — write limiter for mutations
// ---------------------------------------------------------------------------
router.use('/analytics', writeLimiter, analyticsRoutes);
router.use('/media', uploadLimiter, mediaRoutes);
router.use('/translations', writeLimiter, translationsRoutes);
router.use('/users', writeLimiter, usersRoutes);
router.use('/audit-logs', readLimiter, auditLogsRoutes);
router.use('/content-versions', writeLimiter, contentVersionRoutes);
router.use('/announcements', writeLimiter, announcementRoutes);
router.use('/books', readLimiter, bookRoutes);
router.use('/health', healthRoutes);
router.use('/export', writeLimiter, exportRoutes);

export default router;
