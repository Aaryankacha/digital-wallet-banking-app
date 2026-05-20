/**
 * BalanceCard – shows wallet balance with a gradient background.
 * Props: { balance: number, userName: string }
 */
export default function BalanceCard({ balance = 0, userName = '' }) {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(balance);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-800 p-6 text-white shadow-xl">
      {/* Decorative blobs */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10" />

      <p className="text-sm font-medium opacity-80">Total Balance</p>
      <p className="mt-1 text-4xl font-extrabold tracking-tight">{formatted}</p>
      <p className="mt-4 text-sm opacity-70">Welcome back, {userName} 👋</p>
    </div>
  );
}
