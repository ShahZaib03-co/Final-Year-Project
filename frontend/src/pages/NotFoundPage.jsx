const NotFoundPage = () => (
  <div className="py-16 text-center">
    <h1 className="text-5xl font-bold text-ink-900 dark:text-ink-100 mb-4">404</h1>
    <p className="text-ink-600 dark:text-ink-300 mb-6">The page you are looking for could not be found.</p>
    <a href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-crimson-500 text-white hover:bg-crimson-600 transition-colors">
      Go back home
    </a>
  </div>
);

export default NotFoundPage;
