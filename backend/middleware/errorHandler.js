/**
 * Global error handling middleware for RailMitra.
 * Catches unhandled errors and returns consistent JSON responses.
 */

/**
 * Maps known error types to user-friendly messages.
 */
const ERROR_MAP = {
  ECONNREFUSED: {
    status: 503,
    code: 'PROVIDER_UNAVAILABLE',
    message: 'The railway data provider is currently unavailable. Please try again later.',
  },
  ETIMEDOUT: {
    status: 504,
    code: 'PROVIDER_TIMEOUT',
    message: 'The railway data provider did not respond in time. Please try again.',
  },
  ECONNABORTED: {
    status: 504,
    code: 'PROVIDER_TIMEOUT',
    message: 'The request to the railway data provider timed out.',
  },
  ENOTFOUND: {
    status: 503,
    code: 'PROVIDER_UNAVAILABLE',
    message: 'Could not reach the railway data provider. Please check your internet connection.',
  },
};

/**
 * Express error handling middleware.
 * Must have 4 parameters for Express to recognize it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  // Log the error (without sensitive details)
  console.error(`[ERROR] ${req.method} ${req.path}:`, {
    message: err.message,
    code: err.code,
    status: err.status || err.statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Check for known network error codes
  const knownError = ERROR_MAP[err.code];
  if (knownError) {
    return res.status(knownError.status).json({
      success: false,
      error: {
        code: knownError.code,
        message: knownError.message,
      },
    });
  }

  // API key errors
  if (err.status === 401 || err.message?.includes('API key') || err.message?.includes('Unauthorized')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid or missing API key. Please check your configuration.',
      },
    });
  }

  // Rate limit errors from upstream
  if (err.status === 429 || err.message?.includes('rate limit')) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'API rate limit exceeded. Please wait before making more requests.',
      },
    });
  }

  // Validation errors
  if (err.status === 400 || err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message || 'Invalid request parameters.',
      },
    });
  }

  // Default: Internal server error
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'An unexpected error occurred. Please try again later.',
    },
  });
}

/**
 * 404 handler for unknown routes.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found.`,
    },
  });
}
