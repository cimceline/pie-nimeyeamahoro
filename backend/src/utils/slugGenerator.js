import slugify from 'slugify';

/**
 * Generate a URL-friendly slug from a string.
 * @param {string} text - The text to slugify
 * @param {object} options - Additional slugify options
 * @returns {string} The generated slug
 */
export function generateSlug(text, options = {}) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
    ...options,
  });
}

/**
 * Generate a unique slug by appending a short random suffix if needed.
 * @param {string} text - The text to slugify
 * @param {function} checkExists - Async function that returns true if slug already exists
 * @returns {Promise<string>} A unique slug
 */
export async function generateUniqueSlug(text, checkExists) {
  let slug = generateSlug(text);
  let counter = 0;

  while (await checkExists(slug)) {
    counter += 1;
    slug = `${generateSlug(text)}-${counter}`;
  }

  return slug;
}
