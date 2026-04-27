const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    // For nested comments — null means it's a top-level comment
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    // Direct replies to this comment
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    depth: {
      type: Number,
      default: 0, // 0 = top-level, 1 = reply, 2 = reply-to-reply (max)
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ blog: 1, parent: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

// When a reply is created, add it to parent's replies array
commentSchema.post('save', async function (doc) {
  if (doc.parent && doc.isNew) {
    await mongoose.model('Comment').findByIdAndUpdate(doc.parent, {
      $addToSet: { replies: doc._id },
    });
  }
});

// Soft-delete: replace content instead of removing
commentSchema.methods.softDelete = async function () {
  this.content = '[This comment has been deleted]';
  this.isDeleted = true;
  await this.save();
};

module.exports = mongoose.model('Comment', commentSchema);
