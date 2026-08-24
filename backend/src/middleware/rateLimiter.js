import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

const isDev = config.isDevelopment;

/**
 * Rate Limiter Strategy
 *
 * Tiered rate limiting applied per-route-group in routes/index.js:
 *
 * 1. readLimiter   — generous, for public GET/read endpoints
 * 2. writeLimiter  — moderate, for authenticated POST/PUT/DELETE mutations
 * 3. authLimiter   — strict, for login/register/password-reset (anti-brute-force)
 * 4. formLimiter   — strict, for public form submissions (contact, comments, etc.)
 * 5. uploadLimiter — moderate, for file uploads
 * 6. searchLimiter — moderate, for search endpoints
 *
 * Development limits are very high to avoid interference with testing.
 * Production limits allow normal usage while blocking abuse.
 */

// ---------------------------------------------------------------------------
// 1. PUBLIC READ — generous for GET requests to public content
// ---------------------------------------------------------------------------
// 500 requests per minute in production. A single page load fires ~6 requests,
// so this allows ~80 full page loads per minute — more than enough for human
// traffic while still blocking automated scraping floods.
export const readLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 10000 : 500,
  message: {
    success: false,
    message: 'Too many read requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Only count GET requests toward the read limiter
  skip: (req) => req.method !== 'GET',
});

// ---------------------------------------------------------------------------
// 2. WRITE — moderate for authenticated mutations (POST/PUT/PATCH/DELETE)
// ---------------------------------------------------------------------------
// 60 requests per minute in production. Enough for normal admin workflow
// (CRUD operations, form submissions) while blocking automated abuse.
export const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 10000 : 60,
  message: {
    success: false,
    message: 'Too many write requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Only count non-GET requests toward the write limiter
  skip: (req) => req.method === 'GET',
});

// ---------------------------------------------------------------------------
// 3. AUTH — strict anti-brute-force for login / register / password-reset
// ---------------------------------------------------------------------------
// 10 login attempts per 15 minutes in production. Prevents credential stuffing
// while allowing legitimate users who mistype once or twice.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 10,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------------------------------------------------------------------
// 4. FORM — moderate for public form submissions (contact, comments, etc.)
// ---------------------------------------------------------------------------
// 10 submissions per 15 minutes in production. Prevents spam while allowing
// genuine users to submit forms.
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 10,
  message: {
    success: false,
    message: 'Too many submissions. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------------------------------------------------------------------
// 5. UPLOAD — moderate for file uploads
// ---------------------------------------------------------------------------
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 30,
  message: {
    success: false,
    message: 'Too many upload requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------------------------------------------------------------------
// 6. SEARCH — moderate for search endpoints
// ---------------------------------------------------------------------------
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 10000 : 60,
  message: {
    success: false,
    message: 'Too many search requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Keep legacy export name for backward compatibility with existing imports
export const generalLimiter = readLimiter;

export default {
  readLimiter,
  writeLimiter,
  authLimiter,
  formLimiter,
  uploadLimiter,
  searchLimiter,
  generalLimiter,
};
