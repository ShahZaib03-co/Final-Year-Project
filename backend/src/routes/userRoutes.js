const express = require('express');
const userRouter = express.Router();
const commentRouter = express.Router();

const {
  getAllUsers, getUser, updateUserRole, toggleUserStatus, deleteUser, updateProfile, getAdminStats,
} = require('../controllers/userController');
const {
  updateComment, deleteComment, toggleCommentLike,
} = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// User routes
userRouter.use(protect);

userRouter.get('/admin/stats', authorize('admin'), getAdminStats);
userRouter.get('/', authorize('admin'), getAllUsers);
userRouter.patch('/me', upload.single('avatar'), updateProfile);
userRouter.get('/:id', getUser);
userRouter.patch('/:id/role', authorize('admin'), updateUserRole);
userRouter.patch('/:id/status', authorize('admin'), toggleUserStatus);
userRouter.delete('/:id', authorize('admin'), deleteUser);

// Comment routes
commentRouter.use(protect);
commentRouter.patch('/:id', updateComment);
commentRouter.delete('/:id', deleteComment);
commentRouter.post('/:id/like', toggleCommentLike);

module.exports = { userRouter, commentRouter };
