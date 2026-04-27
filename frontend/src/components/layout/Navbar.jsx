import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useThemeStore from '../../store/themeStore';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, canManageBlogs, logout } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-parchment/95 dark:bg-ink-950/95 backdrop-blur border-b border-ink-200 dark:border-ink-800">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
          The<span className="text-crimson-500">Ink</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive
                ? 'text-crimson-500'
                : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50'}`
            }
          >
            Home
          </NavLink>

          {canManageBlogs && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive
                  ? 'text-crimson-500'
                  : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50'}`
              }
            >
              Dashboard
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive
                  ? 'text-crimson-500'
                  : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50'}`
              }
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-ink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-ink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=d44040&color=fff&size=32`}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-crimson-400"
                />
                <span className="hidden md:block text-sm font-medium text-ink-800 dark:text-ink-200">
                  {user?.username}
                </span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-ink-900 rounded-xl shadow-xl border border-ink-100 dark:border-ink-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-3 border-b border-ink-100 dark:border-ink-800">
                  <p className="text-xs text-ink-500 dark:text-ink-400 capitalize">{user?.role}</p>
                </div>
                {canManageBlogs && (
                  <Link to="/dashboard/new" className="block px-4 py-2 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                    New Post
                  </Link>
                )}
                <Link to="/profile" className="block px-4 py-2 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-4 py-2 text-sm text-crimson-500 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors rounded-b-xl"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 bg-ink-900 dark:bg-ink-50 text-white dark:text-ink-950 rounded-lg hover:bg-ink-800 dark:hover:bg-ink-200 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
