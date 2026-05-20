import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

// Icons (inline SVG – replace with lucide-react when installing)
const navItems = [
  { label: 'Dashboard',    path: '/dashboard',    icon: '🏠' },
  { label: 'Send',         path: '/send',         icon: '💸' },
  { label: 'Request',      path: '/request',      icon: '📥' },
  { label: 'Transactions', path: '/transactions', icon: '📋' },
  { label: 'Contacts',     path: '/contacts',     icon: '👥' },
  { label: 'Analytics',    path: '/analytics',    icon: '📊' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur dark:border-dark-border dark:bg-dark-card/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-extrabold tracking-tight text-brand-500">
          Pay<span className="text-gray-900 dark:text-white">Wave</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden gap-1 md:flex">
          {navItems.map(({ label, path, icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${pathname === path
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border'}`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border transition-colors"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* User + logout */}
          {user && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:block">
                {user.name}
              </span>
              <button
                id="logout-btn"
                onClick={logout}
                className="btn-ghost text-xs px-3 py-1.5"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
