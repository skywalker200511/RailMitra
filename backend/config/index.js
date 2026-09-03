import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: resolve(__dirname, '../../.env') });

/**
 * Centralized configuration — all env vars accessed through this module.
 * Never import process.env directly elsewhere.
 */
const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Railway Provider
  railwayProvider: process.env.RAILWAY_PROVIDER || 'mock',
  railradar: {
    apiKey: process.env.RAILRADAR_API_KEY || '',
    baseUrl: process.env.RAILRADAR_BASE_URL || 'https://api.railradar.in/v1',
  },

  // AI Provider (Google Gemini)
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.AI_MODEL || 'gemini-2.0-flash',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
};

/**
 * Auto-detect provider: if RAILWAY_PROVIDER is not explicitly set and
 * a valid RailRadar key is present, use railradar. Otherwise mock.
 */
if (!process.env.RAILWAY_PROVIDER && config.railradar.apiKey && config.railradar.apiKey !== 'rr_live_YOUR_KEY_HERE') {
  config.railwayProvider = 'railradar';
}

export default config;
