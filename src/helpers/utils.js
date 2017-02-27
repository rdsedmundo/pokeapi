/**
 * @param {String} value
 * @return {String}
 */
export function ucfirst(value) {
  return value.slice(0, 1).toUpperCase() + value.slice(1, value.length);
}

/**
 * @param {String} value
 * @return {String}
 */
export function ucwords(value) {
  return value.replace(
    /\b[a-z]/g,
    letter => letter.toUpperCase(),
  );
}

/**
 * @param {String} value
 * @return {String}
 */
export function stripTags(value) {
  return value.replace(/(<([^>]+)>)/gi, '');
}

/**
 * @param {String} value
 * @return {String}
 */
export function sanitizeName(name) {
  return ucwords(name.replace(/-/g, ' '));
}
