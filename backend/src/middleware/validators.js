const { body, param, query, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Extract and throw validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => `${e.path}: ${e.msg}`).join('; ');
    return next(new AppError(`Validation failed — ${messages}`, 400));
  }
  next();
};

// Auth validators
const registerValidator = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, underscores'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and number'),
  validate,
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Blog validators
const createBlogValidator = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5–200 characters'),
  body('content').isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  validate,
];

const updateBlogValidator = [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('content').optional().isLength({ min: 100 }),
  body('category').optional().trim().notEmpty(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  validate,
];

// Comment validators
const createCommentValidator = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 }).withMessage('Comment must be 1–2000 characters'),
  body('parent').optional().isMongoId().withMessage('Invalid parent comment ID'),
  validate,
];

// Query validators
const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1–50'),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  createBlogValidator,
  updateBlogValidator,
  createCommentValidator,
  paginationValidator,
};
