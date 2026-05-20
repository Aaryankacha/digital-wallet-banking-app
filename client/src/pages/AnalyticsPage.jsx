import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getTransactions } from '../services/walletService.js';
import Navbar from '../components/common/Navbar.jsx';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const CATEGORY_COLORS = {
  food: '#F59E0B',          // Amber
  shopping: '#EC4899',      // Pink
  rent: '#3B82F6',          // Blue
  travel: '#10B981',        // Emerald
  utilities: '#6366F1',     // Indigo
  health: '#EF4444',         // Red
  education: '#8B5CF6',      // Purple
  entertainment: '#D946EF',  // Fuchsia
  other: '#6B7280',          // Gray
};

const CATEGORY_LABELS = {
  food: 'Food & Dining 🍔',
  shopping: 'Shopping 🛍️',
  rent: 'Rent & Living 🏠',
  travel: 'Travel & Transport ✈️',
  utilities: 'Bills & Utilities ⚡',
  health: 'Health & Wellness 🏥',
  education: 'Education 📚',
  entertainment: 'Entertainment 🎬',
  other: 'Others 💼',
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Aggregated states
  const [stats, setStats] = useState({ spent: 0, received: 0, balance: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topCategory, setTopCategory] = useState({ name: 'N/A', amount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getTransactions();
        const txList = res.data.filter((t) => t.status === 'completed');
        setTransactions(txList);
        aggregateData(txList);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load transaction statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const aggregateData = (txList) => {
    if (!user || txList.length === 0) return;

    let totalSpent = 0;
    let totalReceived = 0;

    const categoriesMap = {};
    const monthsMap = {};

    // Build past 6 months placeholder so months show in chronological order
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthsMap[key] = { month: key, Income: 0, Expenses: 0 };
    }

    txList.forEach((tx) => {
      const amount = tx.amount;
      const isOutgoing = tx.senderEmail.toLowerCase() === user.email.toLowerCase();

      // 1. Total statistics
      if (isOutgoing) {
        totalSpent += amount;
        // Category breakdown
        categoriesMap[tx.category] = (categoriesMap[tx.category] || 0) + amount;
      } else {
        totalReceived += amount;
      }

      // 2. Monthly trends
      const txDate = new Date(tx.date);
      const monthKey = txDate.toLocaleString('default', { month: 'short', year: '2-digit' });

      // Only track if it falls within the window we set up
      if (monthsMap[monthKey]) {
        if (isOutgoing) {
          monthsMap[monthKey].Expenses += amount;
        } else {
          monthsMap[monthKey].Income += amount;
        }
      }
    });

    // Format Category Data for Pie
    const formattedCategories = Object.keys(categoriesMap).map((cat) => ({
      name: CATEGORY_LABELS[cat] || cat,
      value: categoriesMap[cat],
      rawKey: cat,
      color: CATEGORY_COLORS[cat] || '#CBD5E1',
    })).sort((a, b) => b.value - a.value);

    // Format Monthly Trend Data for Line Chart
    const formattedMonths = Object.values(monthsMap);

    // Set Top Category
    if (formattedCategories.length > 0) {
      setTopCategory({
        name: formattedCategories[0].name,
        amount: formattedCategories[0].value,
      });
    }

    setStats({
      spent: totalSpent,
      received: totalReceived,
      balance: totalReceived - totalSpent,
    });
    setCategoryData(formattedCategories);
    setMonthlyData(formattedMonths);
  };

  const formatCurrency = (val) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Spending Analytics 📊</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time charts and category distributions of your account outflow.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Counter cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Total Spent Outflow</span>
            <span className="text-2xl font-black mt-1 block text-red-600 dark:text-red-400">
              {loading ? 'Calculating...' : formatCurrency(stats.spent)}
            </span>
          </div>

          <div className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500" />
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Total Income Inflow</span>
            <span className="text-2xl font-black mt-1 block text-green-600 dark:text-green-400">
              {loading ? 'Calculating...' : formatCurrency(stats.received)}
            </span>
          </div>

          <div className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500" />
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Primary Outflow Hub</span>
            <span className="text-lg font-bold mt-1 block text-gray-800 dark:text-gray-200 truncate">
              {loading ? 'Calculating...' : topCategory.name !== 'N/A' ? `${topCategory.name}` : 'No outgoings yet'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-64 rounded-3xl bg-white dark:bg-dark-card animate-pulse border border-gray-200 dark:border-dark-border" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64 rounded-3xl bg-white dark:bg-dark-card animate-pulse border border-gray-200 dark:border-dark-border" />
              <div className="h-64 rounded-3xl bg-white dark:bg-dark-card animate-pulse border border-gray-200 dark:border-dark-border" />
            </div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-6">
            {/* Income vs Expenses Trend Chart */}
            <div className="card p-6 border border-gray-250 shadow-sm">
              <h3 className="font-extrabold text-base mb-4 text-gray-800 dark:text-gray-200">Income vs Expenses (Last 6 Months)</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-dark-border" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#FFF',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="Income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="Expenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Distribution (Donut Chart) */}
              <div className="card p-6 flex flex-col justify-between border border-gray-250 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-base mb-1 text-gray-800 dark:text-gray-200">Category Share</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Visual breakdown of your expenses.</p>
                </div>
                <div className="h-[200px] flex items-center justify-center relative">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1E293B',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#FFF',
                            fontSize: '12px',
                          }}
                          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-sm text-gray-400">No outgoing spendings record</span>
                  )}
                  {categoryData.length > 0 && (
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Top Spend</span>
                      <span className="text-sm font-black text-gray-700 dark:text-white truncate max-w-[100px]">
                        {categoryData[0].rawKey.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {/* Custom category list/legend */}
                <div className="mt-4 max-h-[120px] overflow-y-auto space-y-1.5 pr-1">
                  {categoryData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full block shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-600 dark:text-gray-400 truncate max-w-[180px]">{entry.name}</span>
                      </div>
                      <span className="font-bold">{formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                  {categoryData.length === 0 && (
                    <div className="text-center text-xs text-gray-400 py-4">No categories spent yet</div>
                  )}
                </div>
              </div>

              {/* Spendings by Category (Bar Chart) */}
              <div className="card p-6 flex flex-col justify-between border border-gray-250 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-base mb-1 text-gray-800 dark:text-gray-200">Category Comparison</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Direct bar metrics of category outputs.</p>
                </div>
                <div className="h-[240px]">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1E293B',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#FFF',
                            fontSize: '12px',
                          }}
                          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                          {categoryData.slice(0, 5).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No outflow transactions recorded
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center border border-dashed border-gray-300 dark:border-dark-border">
            <span className="text-5xl block mb-3">📈</span>
            <h3 className="font-bold text-lg">No completed transaction history</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              Please run some test transfers or let us seed dummy data so your spending metrics become beautifully alive!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
