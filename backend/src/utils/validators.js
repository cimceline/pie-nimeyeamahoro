import { body, param, query } from 'express-validator';

// --- Auth validators ---
export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// --- Profile validators ---
export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Bio must be at most 2000 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),
  body('affiliation')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Affiliation must be at most 200 characters'),
];

// --- Publication validators ---
export const publicationValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 500 }).withMessage('Title must be at most 500 characters'),
  body('authors')
    .isArray({ min: 1 }).withMessage('At least one author is required'),
  body('authors.*')
    .trim()
    .notEmpty().withMessage('Author name cannot be empty'),
  body('abstract')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Abstract must be at most 5000 characters'),
  body('journal')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Journal must be at most 300 characters'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: 2100 }).withMessage('Year must be a valid year'),
  body('doi')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('DOI must be at most 200 characters'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .trim()
    .isLength({ max: 50 }).withMessage('Each tag must be at most 50 characters'),
];

// --- Project validators ---
export const projectValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ max: 200 }).withMessage('Name must be at most 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be at most 5000 characters'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'archived', 'planned']).withMessage('Invalid status'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid date'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
];

// --- Common param validators ---
export const mongoIdParamValidator = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
];

export const slugParamValidator = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Invalid slug format'),
];

// --- Pagination query validators ---
export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isString().withMessage('Sort must be a string'),
];
