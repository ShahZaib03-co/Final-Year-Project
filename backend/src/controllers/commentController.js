const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');

const MAX_DEPTH = 2;

/**
 * GET /api/blogs/:blogId/comments
 */
const getComments = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    // Fetch top-level comments with nested replies populated (2 levels)
    const comments = await Comment.find({ blog: blogId, parent: null })
      .populate('author', 'username avatar role')
      .populate({
        path: 'replies',
        populate: [
          { path: 'author', select: 'username avatar role' },
          {
            path: 'replies',
            populate: { path: 'author', select: 'username avatar role' },
          },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(res, 200, 'Comments retrieved', { comments });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/blogs/:blogId/comments
 */
const createComment = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { content, parent } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog || blog.status !== 'published') {
      return next(new AppError('Blog not found', 404));
    }

    let depth = 0;
    if (parent) {
      const parentComment = await Comment.findById(parent);
      if (!parentComment || parentComment.blog.toString() !== blogId) {
        return next(new AppError('Parent comment not found', 404));
      }
      depth = parentComment.depth + 1;
      if (depth > MAX_DEPTH) {
        return next(new AppError(`Replies are limited to ${MAX_DEPTH} levels deep`, 400));
      }
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      blog: blogId,
      parent: parent || null,
      depth,
    });

    await comment.populate('author', 'username avatar role');

    return successResponse(res, 201, 'Comment added', { comment });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/comments/:id
 */
const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(new AppError('Comment not found', 404));

    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('You can only edit your own comments', 403));
    }

    comment.content = req.body.content;
    await comment.save();
    await comment.populate('author', 'username avatar');

    return successResponse(res, 200, 'Comment updated', { comment });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/comments/:id
 */
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(new AppError('Comment not found', 404));

    const canDelete =
      comment.author.toString() === req.user._id.toString() ||
      req.user.role === 'admin' ||
      req.user.role === 'editor';

    if (!canDelete) {
      return next(new AppError('You do not have permission to delete this comment', 403));
    }

    // Soft delete to preserve thread structure
    await comment.softDelete();

    return successResponse(res, 200, 'Comment deleted');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/comments/:id/like
 */
const toggleCommentLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(new AppError('Comment not found', 404));

    const userId = req.user._id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save({ validateBeforeSave: false });

    return successResponse(res, 200, isLiked ? 'Like removed' : 'Comment liked', {
      liked: !isLiked,
      likeCount: comment.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, createComment, updateComment, deleteComment, toggleCommentLike };
