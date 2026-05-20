import TransactionItem from '../transactions/TransactionItem.jsx';

/**
 * RecentTransactions – shows the 5 most recent transactions.
 * Props: { transactions: Array, currentEmail: string }
 */
export default function RecentTransactions({ transactions = [], currentEmail }) {
  const recent = transactions.slice(0, 5);

  return (
    <div className="card p-5">
      <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
        Recent Transactions
      </h2>

      {recent.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">No transactions yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-dark-border">
          {recent.map((tx) => (
            <TransactionItem key={tx._id} tx={tx} currentEmail={currentEmail} />
          ))}
        </ul>
      )}
    </div>
  );
}
