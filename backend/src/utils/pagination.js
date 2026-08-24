/**
 * Extract and normalize pagination parameters from a request query object.
 * @param {object} query - Express req.query
 * @param {object} defaults
 * @returns {object} Normalized pagination options
 */
export function getPaginationOptions(query = {}, defaults = {}) {
  const defaultPage = defaults.page || 1;
  const defaultLimit = defaults.limit || 20;
  const maxLimit = defaults.maxLimit || 100;

  let page = Math.max(1, parseInt(query.page, 10) || defaultPage);
  let limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit, 10) || defaultLimit),
  );
  const skip = (page - 1) * limit;

  // Sorting
  let sort = {};
  if (query.sort) {
    const sortField = query.sort.replace(/^-/, '');
    const sortOrder = query.sort.startsWith('-') ? -1 : 1;
    sort[sortField] = sortOrder;
  } else if (defaults.sort) {
    sort = typeof defaults.sort === 'string'
      ? { [defaults.sort]: -1 }
      : defaults.sort;
  } else {
    sort = { createdAt: -1 };
  }

  return {
    page,
    limit,
    skip,
    sort,
  };
}

/**
 * Build a pagination meta object for responses.
 * @param {number} total - Total number of documents
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
export function buildPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
