import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RegisterPage = () => {
  const { register, isRegistering } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
  };

  const requirements = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'Contains uppercase', met: /[A-Z]/.test(form.password) },
    { label: 'Contains lowercase', met: /[a-z]/.test(form.password) },
    { label: 'Contains a number', met: /\d/.test(form.password) },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-ink-900 dark:text-ink-50 mb-2">
            Start writing
          </h1>
          <p className="text-ink-500 dark:text-ink-400 text-sm">
            Join a community of thoughtful writers
          </p>
        </div>

        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="your_username"
                required
                minLength={3}
                maxLength={30}
                className="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-800 dark:text-ink-200 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-crimson-400 transition-all text-sm"
              />
            </div>

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
                className="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-800 dark:text-ink-200 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-crimson-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-800 dark:text-ink-200 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-crimson-400 transition-all text-sm"
              />

              {form.password && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {requirements.map((req) => (
                    <p key={req.label} className={`text-xs flex items-center gap-1 ${req.met ? 'text-green-600 dark:text-green-400' : 'text-ink-400'}`}>
                      {req.met ? '✓' : '○'} {req.label}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3 bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 rounded-xl font-medium text-sm hover:bg-ink-800 dark:hover:bg-ink-200 disabled:opacity-60 transition-all"
            >
              {isRegistering ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-ink-500 dark:text-ink-400">
          Already have an account?{' '}
          <Link to="/login" className="text-crimson-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
