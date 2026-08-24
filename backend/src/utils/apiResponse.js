/**
 * Standardized API response helpers.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 * @param {*} meta - Additional metadata (e.g. pagination info)
 */
export function sendSuccess(res, statusCode = 200, message = 'Success', data = null, meta = null) {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
  };
  return res.status(statusCode).json(response);
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {Array|string} errors
 */
export function sendError(res, statusCode = 500, message = 'Internal Server Error', errors = null) {
  const response = {
    success: false,
    message,
    ...(errors !== null && { errors }),
  };
  return res.status(statusCode).json(response);
}

/**
 * Send a paginated response.
 * @param {import('express').Response} res
 * @param {Array} data
 * @param {object} pagination - { total, page, limit, totalPages }
 * @param {string} message
 */
export function sendPaginated(res, data, pagination, message = 'Success') {
  return sendSuccess(res, 200, message, data, {
    pagination: {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1,
    },
  });
}

/**
 * Send a created response.
 */
export function sendCreated(res, data, message = 'Created successfully') {
  return sendSuccess(res, 201, message, data);
}

/**
 * Send a no-content response.
 */
export function sendNoContent(res) {
  return res.status(204).send();
}
