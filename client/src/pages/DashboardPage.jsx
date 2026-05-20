import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getBalance, getTransactions } from '../services/walletService.js';
import Navbar from '../components/common/Navbar.jsx';
import BalanceCard from '../components/dashboard/BalanceCard.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';

/* Loading skeleton for the balance card */
function BalanceSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-card dark:to-dark-border p-6 shadow-xl animate-pulse">
      <div className="h-4 w-28 rounded bg-white/40 mb-3" />
      <div className="h-10 w-48 rounded bg-white/40 mb-5" />
      <div className="h-3 w-36 rounded bg-white/30" />
    </div>
  );
}

function TxSkeleton() {
  return (
    <div className="card p-5">
      <div className="h-5 w-40 rounded bg-gray-200 dark:bg-dark-border mb-4 animate-pulse" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-t border-gray-100 dark:border-dark-border animate-pulse">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-dark-border shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 rounded bg-gray-200 dark:bg-dark-border" />
            <div className="h-2.5 w-24 rounded bg-gray-100 dark:bg-dark-border" />
          </div>
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-dark-border" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: balanceData, loading: balLoading, execute: fetchBalance } = useAsync(getBalance);
  const { data: txData,      loading: txLoading,  execute: fetchTx }      = useAsync(getTransactions);

  const refresh = useCallback(() => {
    fetchBalance();
    fetchTx();
  }, [fetchBalance, fetchTx]);

  useEffect(() => { refresh(); }, [refresh]);

  const balance      = balanceData?.balance ?? 0;
  const transactions = Array.isArray(txData) ? txData : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        {/* Balance card */}
        {balLoading ? (
          <BalanceSkeleton />
        ) : (
          <BalanceCard balance={balance} userName={user?.name ?? ''} />
        )}

        {/* Quick actions */}
        <QuickActions />

        {/* Recent transactions */}
        {txLoading ? (
          <TxSkeleton />
        ) : (
          <RecentTransactions transactions={transactions} currentEmail={user?.email ?? ''} />
        )}
      </main>
    </div>
  );
}
