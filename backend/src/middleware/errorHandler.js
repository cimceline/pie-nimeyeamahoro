import { sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Custom application error class.
 */
export class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Mongoose validation errors.
 */
function handleValidationError(err) {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError('Validation Error', 400, messages);
}

/**
 * Handle Mongoose duplicate key errors.
 */
function handleDuplicateKeyError(err) {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue?.[field];
  const message = `Duplicate value '${value}' for field '${field}'. Please use another value.`;
  return new AppError(message, 409);
}

/**
 * Handle Mongoose cast errors (invalid ObjectId).
 */
function handleCastError(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

/**
 * Handle JWT errors.
 */
function handleJWTError() {
  return new AppError('Invalid token. Please log in again.', 401);
}

function handleTokenExpiredError() {
  return new AppError('Token expired. Please log in again.', 401);
}

/**
 * Centralized error handling middleware.
 */
export function errorHandler(err, req, res, _next) {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log non-operational errors
  if (!err.isOperational) {
    logger.error('Unexpected Error:', err);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  if (err.name === 'TokenExpiredError') {
    error = handleTokenExpiredError();
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File too large', 413);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new AppError('Too many files', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new AppError('Unexpected file field', 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  const response = {
    success: false,
    message,
    ...(error.errors && { errors: error.errors }),
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * 404 handler middleware for undefined routes.
 */
export function notFoundHandler(req, res, _next) {
  return sendError(res, 404, `Route ${req.originalUrl} not found`);
}
