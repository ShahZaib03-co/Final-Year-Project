import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const { login, isLoggingIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-ink-900 dark:text-ink-50 mb-2">
            Welcome back
          </h1>
          <p className="text-ink-500 dark:text-ink-400 text-sm">
            Sign in to continue your story
          </p>
        </div>

        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-800 dark:text-ink-200 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-crimson-400 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-800 dark:text-ink-200 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-crimson-400 focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 rounded-xl font-medium text-sm hover:bg-ink-800 dark:hover:bg-ink-200 disabled:opacity-60 transition-all"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-ink-50 dark:bg-ink-800 rounded-xl">
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400 mb-2">Demo accounts:</p>
            <div className="space-y-1">
              {[
                { role: 'Admin', email: 'admin@theink.com', pass: 'Admin@1234' },
                { role: 'Editor', email: 'editor@theink.com', pass: 'Editor@1234' },
                { role: 'User', email: 'user@theink.com', pass: 'User@1234' },
              ].map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => { setForm({ email: acc.email, password: acc.pass }); }}
                  className="block w-full text-left text-xs text-ink-500 dark:text-ink-400 hover:text-crimson-500 transition-colors"
                >
                  <span className="font-medium text-crimson-500">{acc.role}:</span> {acc.email}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-ink-500 dark:text-ink-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-crimson-500 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
