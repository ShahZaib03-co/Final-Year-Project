const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      next(new AppError(options.message.message, 429));
    },
  });

// General API limiter
const apiLimiter = createLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  parseInt(process.env.RATE_LIMIT_MAX) || 100,
  'Too many requests from this IP, please try again later.'
);

// Strict limiter for auth routes
const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  'Too many authentication attempts. Please wait 15 minutes before trying again.'
);

// Upload limiter
const uploadLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  20,
  'Too many upload requests. Please wait before uploading again.'
);

module.exports = { apiLimiter, authLimiter, uploadLimiter };
