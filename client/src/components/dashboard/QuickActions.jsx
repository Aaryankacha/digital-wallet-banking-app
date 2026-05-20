import { Link } from 'react-router-dom';

const actions = [
  { label: 'Send Money',     icon: '💸', path: '/send',         id: 'quick-send-btn' },
  { label: 'Request Money',  icon: '📥', path: '/request',      id: 'quick-request-btn' },
  { label: 'Transactions',   icon: '📋', path: '/transactions', id: 'quick-txn-btn' },
  { label: 'My QR Code',     icon: '📱', path: '/qr',           id: 'quick-qr-btn' },
];

/**
 * QuickActions – horizontal row of shortcut buttons on the dashboard.
 */
export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {actions.map(({ label, icon, path, id }) => (
        <Link
          key={id}
          id={id}
          to={path}
          className="card flex flex-col items-center gap-2 p-4 text-center
                     hover:border-brand-500 hover:shadow-md transition-all duration-200 group"
        >
          <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</span>
        </Link>
      ))}
    </div>
  );
}
