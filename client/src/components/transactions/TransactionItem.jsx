import { TRANSACTION_CATEGORIES } from '../../utils/categories.js';

/**
 * TransactionItem – single row in a transaction list.
 * Props: { tx: Object, currentEmail: string }
 */
export default function TransactionItem({ tx, currentEmail }) {
  const isSender = tx.senderEmail === currentEmail;
  const category = TRANSACTION_CATEGORIES[tx.category] || TRANSACTION_CATEGORIES.other;

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(tx.amount);

  const date = new Date(tx.date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <li className="flex items-center gap-4 py-3">
      {/* Category icon */}
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl dark:bg-dark-border">
        {category.icon}
      </span>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {isSender ? `To: ${tx.receiverEmail}` : `From: ${tx.senderEmail}`}
        </p>
        <p className="text-xs text-gray-400">{category.label} · {date}</p>
      </div>

      {/* Amount */}
      <span className={`text-sm font-bold ${isSender ? 'text-red-500' : 'text-green-500'}`}>
        {isSender ? `-${formatted}` : `+${formatted}`}
      </span>
    </li>
  );
}
