import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentAPI } from '../../api/services';
import useAuthStore from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CommentForm = ({ blogId, parentId = null, onSuccess, placeholder = 'Share your thoughts...' }) => {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => commentAPI.create(blogId, { content, parent: parentId }),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries(['comments', blogId]);
      toast.success('Comment posted');
      onSuccess?.();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to post comment'),
  });

  return (
    <div className="flex gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="flex-1 resize-none rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-4 py-3 text-sm text-ink-800 dark:text-ink-200 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-crimson-400 transition-all"
      />
      <button
        onClick={() => mutation.mutate()}
        disabled={!content.trim() || mutation.isPending}
        className="self-end px-4 py-2 bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 rounded-xl text-sm font-medium hover:bg-ink-800 dark:hover:bg-ink-200 disabled:opacity-50 transition-colors"
      >
        {mutation.isPending ? '...' : 'Post'}
      </button>
    </div>
  );
};

const CommentItem = ({ comment, blogId, depth = 0 }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [showReply, setShowReply] = useState(false);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => commentAPI.toggleLike(comment._id),
    onSuccess: () => queryClient.invalidateQueries(['comments', blogId]),
  });

  const deleteMutation = useMutation({
    mutationFn: () => commentAPI.delete(comment._id),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', blogId]);
      toast.success('Comment deleted');
    },
  });

  const canDelete = user?._id === comment.author?._id || user?.role === 'admin';
  const isLiked = comment.likes?.includes(user?._id);
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-ink-100 dark:border-ink-800' : ''}`}>
      <div className="flex gap-3 group">
        <img
          src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${comment.author?.username}&background=d44040&color=fff&size=32`}
          alt={comment.author?.username}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-ink-50 dark:bg-ink-800/60 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-ink-800 dark:text-ink-200">
                {comment.author?.username || 'Deleted User'}
              </span>
              {comment.author?.role === 'admin' && (
                <span className="text-xs px-1.5 py-0.5 bg-crimson-400/20 text-crimson-600 dark:text-crimson-400 rounded-full">Admin</span>
              )}
              <span className="text-xs text-ink-400">{timeAgo}</span>
            </div>
            <p className={`text-sm text-ink-700 dark:text-ink-300 leading-relaxed ${comment.isDeleted ? 'italic text-ink-400' : ''}`}>
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1 px-1">
            {isAuthenticated && (
              <button
                onClick={() => likeMutation.mutate()}
                className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-crimson-500' : 'text-ink-400 hover:text-crimson-500'}`}
              >
                <svg className="w-3.5 h-3.5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {comment.likes?.length || 0}
              </button>
            )}

            {isAuthenticated && depth < 2 && !comment.isDeleted && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-xs text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
              >
                Reply
              </button>
            )}

            {canDelete && !comment.isDeleted && (
              <button
                onClick={() => deleteMutation.mutate()}
                className="text-xs text-ink-400 hover:text-crimson-500 transition-colors ml-auto opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReply && (
            <div className="mt-3">
              <CommentForm
                blogId={blogId}
                parentId={comment._id}
                placeholder={`Reply to ${comment.author?.username}...`}
                onSuccess={() => setShowReply(false)}
              />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply._id} comment={reply} blogId={blogId} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ blogId }) => {
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['comments', blogId],
    queryFn: async () => {
      const { data } = await commentAPI.getByBlog(blogId);
      return data.data.comments;
    },
  });

  return (
    <section className="mt-12">
      <h3 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50 mb-6">
        Discussion {data?.length > 0 && <span className="text-ink-400 text-lg">({data.length})</span>}
      </h3>

      {isAuthenticated ? (
        <div className="mb-8">
          <CommentForm blogId={blogId} />
        </div>
      ) : (
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-8 p-4 bg-ink-50 dark:bg-ink-800 rounded-xl">
          <Link to="/login" className="text-crimson-500 font-medium hover:underline">Sign in</Link> to join the discussion.
        </p>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-ink-200 dark:bg-ink-700 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-ink-200 dark:bg-ink-700 rounded w-1/4" />
                <div className="h-16 bg-ink-200 dark:bg-ink-700 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.length === 0 ? (
        <p className="text-center text-ink-400 py-8">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-6">
          {data.map((comment) => (
            <CommentItem key={comment._id} comment={comment} blogId={blogId} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
