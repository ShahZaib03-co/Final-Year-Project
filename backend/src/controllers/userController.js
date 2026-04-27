const User = require('../models/User');
const Blog = require('../models/Blog');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');

/**
 * GET /api/users  — Admin only
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).skip(skip).limit(parseInt(limit)).sort('-createdAt');

    return successResponse(res, 200, 'Users retrieved', { users }, {
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 */
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('blogs');
    if (!user) return next(new AppError('User not found', 404));
    return successResponse(res, 200, 'User retrieved', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/role  — Admin only
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'editor', 'user'].includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    // Prevent self-demotion
    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return next(new AppError('Admins cannot demote themselves', 400));
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });
    if (!user) return next(new AppError('User not found', 404));

    return successResponse(res, 200, `User role updated to '${role}'`, { user });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/status  — Admin only
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return next(new AppError('You cannot deactivate your own account', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}`, { user });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id  — Admin only
 */
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return next(new AppError('You cannot delete your own account', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));

    // Anonymize their blogs instead of deleting
    await Blog.updateMany({ author: user._id }, { $set: { author: null } });
    await User.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'User deleted');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/me  — Update own profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { username, bio } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (bio !== undefined) updates.bio = bio;

    if (req.file) {
      updates.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return successResponse(res, 200, 'Profile updated', { user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/stats  — Admin only
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalBlogs, publishedBlogs, draftBlogs] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' }),
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const recentUsers = await User.find().sort('-createdAt').limit(5).select('username email role createdAt');
    const recentBlogs = await Blog.find().sort('-createdAt').limit(5)
      .populate('author', 'username').select('title status createdAt views');

    return successResponse(res, 200, 'Admin stats', {
      stats: { totalUsers, totalBlogs, publishedBlogs, draftBlogs, usersByRole },
      recentUsers,
      recentBlogs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers, getUser, updateUserRole, toggleUserStatus, deleteUser, updateProfile, getAdminStats,
};
