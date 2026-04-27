const User = require('../models/User');
const { verifyAccessToken } = require('../utils/tokenUtils');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Protect routes — verify JWT access token from cookie or Authorization header
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Try cookie first (preferred for security)
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    // 2. Fallback to Authorization header (for API clients)
    else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Contact support.', 403));
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('Password was recently changed. Please log in again.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth — attach user if token exists but don't block
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (_) {
    // Silently fail — optional auth
  }
  next();
};

/**
 * Role-Based Access Control (RBAC)
 * Usage: authorize('admin', 'editor')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Role '${req.user.role}' is not authorized to perform this action.`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Check if user is the owner of a resource or is admin/editor
 */
const isOwnerOrAdmin = (resourceAuthorId, userRole, userId) => {
  return (
    userRole === 'admin' ||
    (userRole === 'editor' && resourceAuthorId.toString() === userId.toString()) ||
    resourceAuthorId.toString() === userId.toString()
  );
};

module.exports = { protect, optionalAuth, authorize, isOwnerOrAdmin };
