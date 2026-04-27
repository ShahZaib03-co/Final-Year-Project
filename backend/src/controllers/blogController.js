const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const AppError = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');
const { isOwnerOrAdmin } = require('../middleware/auth');
const { cloudinary } = require('../config/cloudinary');

/**
 * GET /api/blogs
 * Public — paginated, filtered, searchable
 */
const getAllBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      tag,
      author,
      status = 'published',
      sort = '-createdAt',
      featured,
    } = req.query;

    const query = {};

    // Non-admins can only see published blogs
    if (!req.user || req.user.role === 'user') {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = new RegExp(category, 'i');
    if (tag) query.tags = { $in: [tag.toLowerCase()] };
    if (author) query.author = author;
    if (featured) query.featured = featured === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar role')
      .populate('commentCount')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean({ virtuals: true });

    return successResponse(res, 200, 'Blogs retrieved', { blogs }, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/:slugOrId
 * Public — track unique views
 */
const getBlog = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    const query = slugOrId.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: slugOrId }
      : { slug: slugOrId };

    const blog = await Blog.findOne(query)
      .populate('author', 'username avatar bio role')
      .populate('commentCount');

    if (!blog) return next(new AppError('Blog not found', 404));

    // Restrict draft/archived to owners and admins
    if (blog.status !== 'published') {
      if (!req.user || !isOwnerOrAdmin(blog.author._id, req.user.role, req.user._id)) {
        return next(new AppError('Blog not found', 404));
      }
    }

    // Track unique views by IP
    const viewerKey = req.user ? req.user._id.toString() : req.ip;
    if (!blog.uniqueViewers.includes(viewerKey)) {
      blog.uniqueViewers.push(viewerKey);
      blog.views += 1;
      await blog.save({ validateBeforeSave: false });
    }

    return successResponse(res, 200, 'Blog retrieved', { blog });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/blogs
 * Admin, Editor
 */
const createBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, tags, status, seo } = req.body;

    const blogData = {
      title, content, excerpt, category,
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      status: status || 'draft',
      author: req.user._id,
      seo,
    };

    if (req.file) {
      blogData.coverImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const blog = await Blog.create(blogData);
    await blog.populate('author', 'username avatar');

    return successResponse(res, 201, 'Blog created successfully', { blog });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/blogs/:id
 * Admin or owner Editor
 */
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new AppError('Blog not found', 404));

    if (!isOwnerOrAdmin(blog.author, req.user.role, req.user._id)) {
      return next(new AppError('You do not have permission to update this blog', 403));
    }

    const allowedFields = ['title', 'content', 'excerpt', 'category', 'tags', 'status', 'featured', 'seo'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) blog[field] = req.body[field];
    });

    if (req.file) {
      // Remove old image from Cloudinary
      if (blog.coverImage?.publicId) {
        await cloudinary.uploader.destroy(blog.coverImage.publicId).catch(() => {});
      }
      blog.coverImage = { url: req.file.path, publicId: req.file.filename };
    }

    await blog.save();
    await blog.populate('author', 'username avatar');

    return successResponse(res, 200, 'Blog updated successfully', { blog });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/blogs/:id
 * Admin or owner
 */
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new AppError('Blog not found', 404));

    if (!isOwnerOrAdmin(blog.author, req.user.role, req.user._id)) {
      return next(new AppError('You do not have permission to delete this blog', 403));
    }

    // Remove cover image from Cloudinary
    if (blog.coverImage?.publicId) {
      await cloudinary.uploader.destroy(blog.coverImage.publicId).catch(() => {});
    }

    // Delete all associated comments
    await Comment.deleteMany({ blog: blog._id });
    await Blog.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'Blog deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/blogs/:id/like
 */
const toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new AppError('Blog not found', 404));

    const userId = req.user._id;
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save({ validateBeforeSave: false });

    return successResponse(res, 200, isLiked ? 'Like removed' : 'Blog liked', {
      liked: !isLiked,
      likeCount: blog.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog, toggleLike };
