import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => (
  <div className="min-h-screen bg-parchment dark:bg-ink-950 font-body transition-colors duration-300">
    <Navbar />
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Outlet />
    </main>
    <footer className="mt-20 border-t border-ink-200 dark:border-ink-800 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="font-display text-xl font-bold text-ink-800 dark:text-ink-200 mb-1">
          The<span className="text-crimson-500">Ink</span>
        </p>
        <p className="text-sm text-ink-500 dark:text-ink-500">
          A secure publishing platform © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  </div>
);

export default Layout;
