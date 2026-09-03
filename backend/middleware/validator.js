/**
 * Input validation middleware for RailMitra API routes.
 */

/**
 * Validates the agent chat request body.
 */
export function validateChatRequest(req, res, next) {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Message is required and must be a string.',
      },
    });
  }

  // Limit message length to prevent abuse
  if (message.length > 1000) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Message must be 1000 characters or fewer.',
      },
    });
  }

  // Trim whitespace
  req.body.message = message.trim();

  if (req.body.message.length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Message cannot be empty.',
      },
    });
  }

  // Session ID validation (optional, auto-generated if missing)
  if (sessionId && typeof sessionId !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Session ID must be a string.',
      },
    });
  }

  next();
}

/**
 * Validates station code format.
 * Indian railway station codes are 2-5 uppercase alphanumeric characters.
 */
export function isValidStationCode(code) {
  return typeof code === 'string' && /^[A-Z]{2,5}$/.test(code);
}

/**
 * Validates date format (YYYY-MM-DD).
 */
export function isValidDate(dateStr) {
  if (typeof dateStr !== 'string') return false;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Validates train number (4-5 digit string).
 */
export function isValidTrainNumber(num) {
  return typeof num === 'string' && /^\d{4,5}$/.test(num);
}

/**
 * Validates class type code.
 */
const VALID_CLASSES = ['1A', '2A', '3A', '3E', 'SL', 'CC', 'EC', '2S', 'FC'];
export function isValidClassType(cls) {
  return typeof cls === 'string' && VALID_CLASSES.includes(cls.toUpperCase());
}

/**
 * Validates quota code.
 */
const VALID_QUOTAS = ['GN', 'TQ', 'PT', 'LD', 'SS', 'DF', 'FT', 'YU', 'DP', 'HP', 'PH'];
export function isValidQuota(quota) {
  return typeof quota === 'string' && VALID_QUOTAS.includes(quota.toUpperCase());
}

/**
 * Middleware to validate train route params.
 */
export function validateTrainParams(req, res, next) {
  const { from, to } = req.params;

  if (from && !isValidStationCode(from.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_STATION',
        message: `Invalid station code: "${from}". Station codes should be 2-5 uppercase letters.`,
      },
    });
  }

  if (to && !isValidStationCode(to.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_STATION',
        message: `Invalid station code: "${to}". Station codes should be 2-5 uppercase letters.`,
      },
    });
  }

  // Normalize to uppercase
  if (from) req.params.from = from.toUpperCase();
  if (to) req.params.to = to.toUpperCase();

  next();
}

/**
 * Middleware to validate train number param.
 */
export function validateTrainNumber(req, res, next) {
  const { trainNumber } = req.params;

  if (!isValidTrainNumber(trainNumber)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TRAIN_NUMBER',
        message: `Invalid train number: "${trainNumber}". Expected a 4-5 digit number.`,
      },
    });
  }

  next();
}
