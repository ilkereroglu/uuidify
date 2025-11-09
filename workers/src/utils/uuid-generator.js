/**
 * UUID Generator Utilities
 * Supports UUID v1, v4, and v7 generation
 */

/**
 * Generates a UUID v4 (random)
 * @returns {string} UUID v4 string
 */
export function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a UUID v1 (time-based)
 * @returns {string} UUID v1 string
 */
export function generateUUIDv1() {
  const now = Date.now();
  const timeLow = ((now & 0xffffffff) >>> 0).toString(16).padStart(8, '0');
  const timeMid = (((now / 0x100000000) & 0xffff) >>> 0).toString(16).padStart(4, '0');
  const timeHiAndVersion = ((((now / 0x1000000000000) & 0x0fff) | 0x1000) >>> 0)
    .toString(16)
    .padStart(4, '0');
  const clockSeq = (crypto.getRandomValues(new Uint8Array(2))[0] & 0x3f | 0x80)
    .toString(16)
    .padStart(2, '0');
  const node = Array.from(crypto.getRandomValues(new Uint8Array(6)), b => b.toString(16).padStart(2, '0')).join('');
  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeq}${node.slice(0, 2)}-${node.slice(2)}`;
}

/**
 * Generates a UUID v7 (time-ordered)
 * @returns {string} UUID v7 string
 */
export function generateUUIDv7() {
  const timestamp = BigInt(Date.now());
  const unixTime = timestamp * 10000n + 0x01B21DD213814000n;
  const timeHex = unixTime.toString(16).padStart(16, '0');
  const rand = crypto.getRandomValues(new Uint8Array(10));
  const randHex = Array.from(rand, b => b.toString(16).padStart(2, '0')).join('');
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-7${timeHex.slice(13, 16)}-${randHex.slice(0, 4)}-${randHex.slice(4, 16)}`;
}

/**
 * Generates a UUID based on version
 * @param {string} version - UUID version (v1, v4, v7)
 * @returns {string} UUID string
 */
export function generateUUID(version = "v4") {
  switch (version.toLowerCase()) {
    case "v1":
      return generateUUIDv1();
    case "v7":
      return generateUUIDv7();
    default:
      return generateUUIDv4();
  }
}

