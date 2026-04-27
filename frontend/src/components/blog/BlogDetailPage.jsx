import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blogAPI } from '../../api/services';
import CommentSection from '../../components/comment/CommentSection';
import useAuthStore from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { HelmetProvider, Helmet } from 'react-helmet-async';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, canManageBlogs } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await blogAPI.getOne(slug);
      return data.data.blog;
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => blogAPI.toggleLike(data._id),
    onSuccess: ({ data: res }) => {
      queryClient.invalidateQueries(['blog', slug]);
      toast.success(res.data.liked ? 'Liked!' : 'Like removed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => blogAPI.delete(data._id),
    onSuccess: () => {
      toast.success('Blog deleted');
      navigate('/');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="h-10 bg-ink-200 dark:bg-ink-800 rounded w-3/4" />
        <div className="aspect-video bg-ink-200 dark:bg-ink-800 rounded-2xl" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-ink-200 dark:bg-ink-700 rounded" style={{ width: `${Math.random() * 40 + 60}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <h2 className="font-display text-3xl font-bold text-ink-800 dark:text-ink-200 mb-2">Article not found</h2>
        <p className="text-ink-500 mb-6">This article may have been removed or doesn't exist.</p>
        <button onClick={() => navigate('/')} className="px-5 py-2 bg-ink-900 text-white rounded-xl text-sm">
          Go Home
        </button>
      </div>
    );
  }

  const blog = data;
  const isLiked = blog.likes?.includes(user?._id);
  const canEdit =
    user?.role === 'admin' || (canManageBlogs && blog.author?._id === user?._id);

  return (
    <>
      <Helmet>
        <title>{blog.seo?.metaTitle || blog.title} | TheInk</title>
        <meta name="description" content={blog.seo?.metaDescription || blog.excerpt} />
      </Helmet>

      <article className="max-w-3xl mx-auto animate-slide-up">
        {/* Status badge for editors */}
        {blog.status !== 'published' && canEdit && (
          <div className="mb-4 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
            ⚠️ This post is a <strong>{blog.status}</strong> — only visible to editors and admins
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <div className="flex gap-2 flex-wrap mb-4">
            <span className="text-xs font-medium px-2.5 py-1 bg-crimson-400/10 text-crimson-600 dark:text-crimson-400 rounded-full">
              {blog.category}
            </span>
            {blog.tags?.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-900 dark:text-ink-50 leading-tight mb-6">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.username}&background=d44040&color=fff&size=40`}
                alt={blog.author?.username}
                className="w-10 h-10 rounded-full ring-2 ring-crimson-400/30"
              />
              <div>
                <p className="text-sm font-medium text-ink-800 dark:text-ink-200">{blog.author?.username}</p>
                <p className="text-xs text-ink-400">
                  {blog.publishedAt
                    ? formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true })
                    : formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })
                  } · {blog.readTime} min read
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-ink-400 dark:text-ink-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {blog.views}
              </span>

              {/* Edit/Delete for owners */}
              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit/${blog._id}`)}
                    className="px-3 py-1 rounded-lg border border-ink-200 dark:border-ink-700 text-xs text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this article? This cannot be undone.')) deleteMutation.mutate();
                    }}
                    className="px-3 py-1 rounded-lg border border-crimson-200 text-xs text-crimson-500 hover:bg-crimson-50 dark:hover:bg-crimson-900/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {blog.coverImage?.url && (
          <div className="mb-8 rounded-2xl overflow-hidden aspect-video">
            <img src={blog.coverImage.url} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-ink-900 dark:prose-headings:text-ink-50 prose-p:text-ink-700 dark:prose-p:text-ink-300 prose-a:text-crimson-500 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Like Button */}
        <div className="flex items-center justify-center mt-12 pt-8 border-t border-ink-100 dark:border-ink-800">
          {isAuthenticated ? (
            <button
              onClick={() => likeMutation.mutate()}
              className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all ${
                isLiked
                  ? 'border-crimson-400 bg-crimson-50 dark:bg-crimson-900/20 text-crimson-500'
                  : 'border-ink-200 dark:border-ink-700 text-ink-500 hover:border-crimson-300 hover:text-crimson-500'
              }`}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">{blog.likes?.length || 0} {isLiked ? 'Liked' : 'Like'}</span>
            </button>
          ) : (
            <p className="text-sm text-ink-400 dark:text-ink-500">
              <span className="font-medium">{blog.likes?.length || 0}</span> people liked this article
            </p>
          )}
        </div>

        {/* Comments */}
        <CommentSection blogId={blog._id} />
      </article>
    </>
  );
};

export default BlogDetailPage;
