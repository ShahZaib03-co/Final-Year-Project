import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { blogAPI } from '../../api/services';
import BlogCard from '../../components/blog/BlogCard';

const CATEGORIES = ['All', 'Technology', 'Science', 'Design', 'Culture', 'Business', 'Health'];

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', { page, search, category }],
    queryFn: async () => {
      const { data } = await blogAPI.getAll({ page, limit: 9, search, category: category || undefined });
      return data;
    },
    keepPreviousData: true,
  });

  const blogs = data?.data?.blogs || [];
  const meta = data?.meta || {};

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="text-center py-16 mb-12">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-ink-900 dark:text-ink-50 leading-tight mb-4">
          Stories worth<br />
          <span className="text-crimson-500 italic">reading.</span>
        </h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 max-w-xl mx-auto mb-8">
          Explore ideas, insights, and perspectives from writers around the world.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-200 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-crimson-400 text-sm transition-all"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 rounded-xl text-sm font-medium hover:bg-ink-800 transition-colors"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
              className="px-3 py-3 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
            >
              ✕
            </button>
          )}
        </form>
      </section>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              (cat === 'All' && !category) || category === cat
                ? 'bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900'
                : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 hover:border-ink-400 dark:hover:border-ink-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 overflow-hidden animate-pulse">
              <div className="aspect-video bg-ink-200 dark:bg-ink-800" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-ink-200 dark:bg-ink-700 rounded w-1/4" />
                <div className="h-6 bg-ink-200 dark:bg-ink-700 rounded" />
                <div className="h-4 bg-ink-200 dark:bg-ink-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-ink-500 dark:text-ink-400">No articles found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-ink-200 dark:border-ink-700 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 disabled:opacity-40 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-sm text-ink-500 dark:text-ink-400">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="px-4 py-2 rounded-lg border border-ink-200 dark:border-ink-700 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 disabled:opacity-40 transition-colors"
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

export default HomePage;
