import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <div className="py-20 text-center">
    <h1 className="text-5xl font-bold text-ink-900 dark:text-ink-100 mb-4">Access denied</h1>
    <p className="text-ink-600 dark:text-ink-400 mb-6">
      You do not have permission to view this page. Please sign in with an admin account.
    </p>
    <Link
      to="/login"
      className="inline-flex items-center justify-center rounded-full bg-crimson-500 px-6 py-3 text-sm font-semibold text-white hover:bg-crimson-600 transition-colors"
    >
      Go to login
    </Link>
  </div>
);

export default UnauthorizedPage;
