import { DateTime } from 'luxon';

/**
 * Get the start of the day (00:00) in milliseconds for the given timezone
 * @param {string} tz - IANA timezone (e.g., 'Asia/Shanghai')
 * @returns {number} Timestamp in milliseconds
 */
export function getLocalStartOfDayMs(tz = 'Asia/Shanghai') {
  return DateTime.now().setZone(tz).startOf('day').toMillis();
}

/**
 * Get the current date string in the given timezone
 * @param {string} tz - IANA timezone (e.g., 'Asia/Shanghai')
 * @returns {string} Date string in format 'YYYY-MM-DD'
 */
export function getLocalDateStr(tz = 'Asia/Shanghai') {
  return DateTime.now().setZone(tz).toFormat('yyyy-MM-dd');
}

/**
 * Get the current date and time string in the given timezone
 * @param {string} tz - IANA timezone (e.g., 'Asia/Shanghai')
 * @returns {string} DateTime string in format 'YYYY-MM-DD HH:mm:ss'
 */
export function getLocalDateTimeStr(tz = 'Asia/Shanghai') {
  return DateTime.now().setZone(tz).toFormat('yyyy-MM-dd HH:mm:ss');
}

