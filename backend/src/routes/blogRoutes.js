const express = require('express');
const router = express.Router();
const {
  getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog, toggleLike,
} = require('../controllers/blogController');
const {
  getComments, createComment,
} = require('../controllers/commentController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  createBlogValidator, updateBlogValidator, createCommentValidator, paginationValidator,
} = require('../middleware/validators');

// Public routes
router.get('/', optionalAuth, paginationValidator, getAllBlogs);
router.get('/:slugOrId', optionalAuth, getBlog);

// Comments
router.get('/:blogId/comments', getComments);
router.post('/:blogId/comments', protect, createCommentValidator, createComment);

// Protected routes
router.post(
  '/',
  protect,
  authorize('admin', 'editor'),
  upload.single('coverImage'),
  createBlogValidator,
  createBlog
);

router.patch(
  '/:id',
  protect,
  authorize('admin', 'editor'),
  upload.single('coverImage'),
  updateBlogValidator,
  updateBlog
);

router.delete('/:id', protect, authorize('admin', 'editor'), deleteBlog);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
