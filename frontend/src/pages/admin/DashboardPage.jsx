import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blogAPI } from '../../api/services';
import useAuthStore from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  published: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  draft: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  archived: 'bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400',
};

const DashboardPage = () => {
  const { user, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-blogs', { page, statusFilter, author: isAdmin ? undefined : user?._id }],
    queryFn: async () => {
      const { data } = await blogAPI.getAll({
        page,
        limit: 10,
        status: statusFilter || undefined,
        author: isAdmin ? undefined : user?._id,
      });
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard-blogs']);
      toast.success('Blog deleted');
    },
    onError: () => toast.error('Failed to delete blog'),
  });

  const blogs = data?.data?.blogs || [];
  const meta = data?.meta || {};

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-ink-50">
            {isAdmin ? 'All Articles' : 'My Articles'}
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            {meta.total || 0} total articles
          </p>
        </div>
        <Link
          to="/dashboard/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 rounded-xl text-sm font-medium hover:bg-ink-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {['', 'published', 'draft', 'archived'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              statusFilter === s
                ? 'bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900'
                : 'text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 hover:border-ink-400'
            }`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white dark:bg-ink-900 rounded-xl border border-ink-100 dark:border-ink-800 animate-pulse" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800">
          <p className="text-4xl mb-3">✍️</p>
          <p className="text-ink-500 dark:text-ink-400 mb-4">No articles yet</p>
          <Link to="/dashboard/new" className="text-crimson-500 text-sm font-medium hover:underline">
            Write your first article →
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-ink-50 dark:bg-ink-800 border-b border-ink-100 dark:border-ink-700">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider hidden lg:table-cell">Views</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-ink-800 dark:text-ink-200 line-clamp-1">{blog.title}</p>
                        <p className="text-xs text-ink-400 mt-0.5">{blog.category}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[blog.status]}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink-500 dark:text-ink-400 hidden lg:table-cell">
                      {blog.views}
                    </td>
                    <td className="px-5 py-4 text-sm text-ink-500 dark:text-ink-400 hidden lg:table-cell">
                      {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="p-1.5 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => navigate(`/dashboard/edit/${blog._id}`)}
                          className="p-1.5 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this article?')) deleteMutation.mutate(blog._id);
                          }}
                          className="p-1.5 text-ink-400 hover:text-crimson-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-ink-200 dark:border-ink-700 text-sm disabled:opacity-40 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors"
              >
                ← Prev
              </button>
              <span className="self-center text-sm text-ink-500">{page} / {meta.totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="px-4 py-2 rounded-lg border border-ink-200 dark:border-ink-700 text-sm disabled:opacity-40 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
