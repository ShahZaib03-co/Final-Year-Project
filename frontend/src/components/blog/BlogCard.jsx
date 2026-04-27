import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const BlogCard = ({ blog, compact = false }) => {
  const timeAgo = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });

  return (
    <article className={`group bg-white dark:bg-ink-900 rounded-2xl overflow-hidden border border-ink-100 dark:border-ink-800 hover:border-ink-300 dark:hover:border-ink-600 transition-all duration-300 hover:shadow-lg ${compact ? '' : 'flex flex-col'}`}>
      {/* Cover Image */}
      {blog.coverImage?.url && (
        <Link to={`/blog/${blog.slug}`}>
          <div className="overflow-hidden aspect-video">
            <img
              src={blog.coverImage.url}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Category + Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs font-medium px-2 py-0.5 bg-crimson-400/10 text-crimson-600 dark:text-crimson-400 rounded-full">
            {blog.category}
          </span>
          {blog.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.slug}`} className="flex-1">
          <h2 className={`font-display font-bold text-ink-900 dark:text-ink-50 group-hover:text-crimson-500 transition-colors leading-tight mb-2 ${compact ? 'text-lg' : 'text-xl'}`}>
            {blog.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {!compact && (
          <p className="text-sm text-ink-600 dark:text-ink-400 line-clamp-2 mb-4 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink-100 dark:border-ink-800">
          <div className="flex items-center gap-2">
            <img
              src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.username}&background=d44040&color=fff&size=24`}
              alt={blog.author?.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-ink-600 dark:text-ink-400 font-medium">
              {blog.author?.username}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-400 dark:text-ink-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {blog.views}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {blog.likes?.length || 0}
            </span>
            <span>{blog.readTime}m read</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
