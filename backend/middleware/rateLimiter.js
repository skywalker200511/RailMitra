import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

/**
 * General API rate limiter — applies to all routes.
 * Default: 100 requests per 15-minute window per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  },
});

/**
 * Stricter rate limiter for the AI agent chat endpoint.
 * 20 requests per minute per IP to prevent abuse.
 */
export const agentChatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many chat requests. Please wait a moment before trying again.',
    },
  },
});
