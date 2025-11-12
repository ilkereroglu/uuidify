/**
 * Validation Utilities
 */

const VALID_VERSIONS = ["v1", "v4", "v7", "ulid"];
const VALID_FORMATS = ["json", "text"];
const MAX_COUNT = 1000;
const DEFAULT_COUNT = 1;
const DEFAULT_VERSION = "v4";
const DEFAULT_FORMAT = "json";

/**
 * Validates and returns a valid UUID version
 * @param {string} version - Version to validate
 * @returns {string} Valid version or default
 */
export function validateVersion(version) {
  if (!version) {
    return DEFAULT_VERSION;
  }
  const lowerVersion = version.toLowerCase();
  return VALID_VERSIONS.includes(lowerVersion) ? lowerVersion : DEFAULT_VERSION;
}

/**
 * Validates and clamps the count parameter
 * @param {string|number} count - Count to validate
 * @param {number} maxCount - Maximum allowed count
 * @returns {number} Valid count
 */
export function validateCount(count, maxCount = MAX_COUNT) {
  if (count === undefined || count === null || count === "") {
    return DEFAULT_COUNT;
  }

  const num = Number(count);
  if (!Number.isFinite(num) || !Number.isInteger(num)) {
    throw new Error(`count must be an integer between 1 and ${maxCount}`);
  }

  if (num < 1 || num > maxCount) {
    throw new Error(`count must be between 1 and ${maxCount}`);
  }

  return num;
}

/**
 * Validates and returns a valid response format
 * @param {string} format - Format to validate
 * @returns {string} Valid format or default
 */
export function validateFormat(format) {
  if (!format) {
    return DEFAULT_FORMAT;
  }
  const lowerFormat = format.toLowerCase();
  return VALID_FORMATS.includes(lowerFormat) ? lowerFormat : DEFAULT_FORMAT;
}
