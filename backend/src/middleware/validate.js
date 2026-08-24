import { validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse.js';

/**
 * Middleware wrapper that runs express-validator validation chains
 * and returns errors if any exist.
 * @param {Array} validations - Array of express-validator validation chains
 * @returns {Function} Express middleware
 */
export function validate(validations) {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return sendError(res, 422, 'Validation failed', extractedErrors);
  };
}

export default validate;
