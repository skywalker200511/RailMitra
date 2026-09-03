import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'api_requests.log');

/**
 * Log API requests to console and file.
 * @param {Object} params
 * @param {string} params.endpoint
 * @param {string} params.trainNumber
 * @param {string} params.from
 * @param {string} params.to
 * @param {string} params.date
 * @param {number} params.status
 * @param {number} params.responseTime
 * @param {boolean} params.success
 * @param {string} [params.error]
 */
export function logApiRequest({ endpoint, trainNumber, from, to, date, status, responseTime, success, error }) {
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} | ${endpoint} | ${trainNumber || '-'} | ${from || '-'} | ${to || '-'} | ${date || '-'} | ${status} | ${responseTime}ms | ${success ? 'SUCCESS' : 'FAILURE'}${error ? ` | ${error}` : ''}\n`;
  
  // Console logging
  if (success) {
    console.log(`[API SUCCESS] ${endpoint} (${responseTime}ms)`);
  } else {
    console.error(`[API FAILURE] ${endpoint} (${responseTime}ms) - ${error || 'Unknown error'}`);
  }
  
  // File logging disabled on Vercel (read-only filesystem)
}
