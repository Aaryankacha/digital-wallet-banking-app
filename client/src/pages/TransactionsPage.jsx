import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getTransactions } from '../services/walletService.js';
import { CATEGORY_LIST } from '../utils/categories.js';
import Navbar from '../components/common/Navbar.jsx';
import TransactionItem from '../components/transactions/TransactionItem.jsx';

const TYPE_OPTIONS = [
  { value: '',        label: 'All Types' },
  { value: 'send',    label: '💸 Sent' },
  { value: 'request', label: '📥 Requests' },
];

function TxSkeleton() {
  return (
    <div className="card divide-y divide-gray-100 dark:divide-dark-border animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-dark-border shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-40 rounded bg-gray-200 dark:bg-dark-border" />
            <div className="h-2.5 w-28 rounded bg-gray-100 dark:bg-dark-border" />
          </div>
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-dark-border" />
        </div>
      ))}
    </div>
  );
}

export default function TransactionsPage() {
  const { user } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter,     setTypeFilter]     = useState('');

  const { data, loading, execute: fetchTx } = useAsync(getTransactions);

  const applyFilters = useCallback(() => {
    const params = {};
    if (categoryFilter) params.category = categoryFilter;
    if (typeFilter)     params.type     = typeFilter;
    fetchTx(params);
  }, [fetchTx, categoryFilter, typeFilter]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const transactions = Array.isArray(data) ? data : [];

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 2,
  });

  const totalSent = transactions
    .filter((tx) => tx.senderEmail === user?.email && tx.type === 'send')
    .reduce((s, tx) => s + tx.amount, 0);
  const totalReceived = transactions
    .filter((tx) => tx.receiverEmail === user?.email && tx.type === 'send')
    .reduce((s, tx) => s + tx.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Transaction History 📋</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">All your PayWave activity in one place.</p>
        </div>

        {/* Summary pills */}
        {!loading && transactions.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{transactions.length}</p>
              <p className="text-xs text-gray-400">transactions</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sent</p>
              <p className="text-base font-bold text-red-500">{formatted.format(totalSent)}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Received</p>
              <p className="text-base font-bold text-green-500">{formatted.format(totalReceived)}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Category filter */}
          <select
            id="filter-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field max-w-[180px] cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORY_LIST.map(({ value, label, icon }) => (
              <option key={value} value={value}>{icon} {label}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            id="filter-type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field max-w-[160px] cursor-pointer"
          >
            {TYPE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Clear button */}
          {(categoryFilter || typeFilter) && (
            <button
              id="clear-filters-btn"
              onClick={() => { setCategoryFilter(''); setTypeFilter(''); }}
              className="btn-ghost text-sm px-4 py-2"
            >
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* Transaction list */}
        {loading ? (
          <TxSkeleton />
        ) : transactions.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">No transactions found</p>
            <p className="text-sm text-gray-400 mt-1">
              {categoryFilter || typeFilter
                ? 'Try clearing your filters.'
                : 'Send or request money to get started.'}
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <ul className="divide-y divide-gray-100 dark:divide-dark-border px-5">
              {transactions.map((tx) => (
                <TransactionItem key={tx._id} tx={tx} currentEmail={user?.email ?? ''} />
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
