import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestMoney } from '../services/walletService.js';
import { CATEGORY_LIST } from '../utils/categories.js';
import Navbar from '../components/common/Navbar.jsx';

export default function RequestMoneyPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ targetEmail: '', amount: '', category: 'other', note: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.targetEmail.trim()) return 'Target user email is required.';
    if (!/\S+@\S+\.\S+/.test(form.targetEmail)) return 'Enter a valid email.';
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) return 'Enter a valid amount greater than ₹0.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      await requestMoney({
        targetEmail: form.targetEmail,
        amount: parseFloat(form.amount),
        category: form.category,
        note: form.note,
      });
      setSuccess(`Request sent to ${form.targetEmail}! Redirecting…`);
      setTimeout(() => navigate('/dashboard'), 1600);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = CATEGORY_LIST.find((c) => c.value === form.category);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Request Money 📥</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Send a payment request to another PayWave user.
          </p>
        </div>

        <div className="card p-6 shadow-md">
          {error && (
            <div id="request-error-banner" className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div id="request-success-banner" className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
              <span>✅</span> {success}
            </div>
          )}

          {/* Info banner */}
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 px-4 py-3 text-sm text-brand-700 dark:text-brand-300">
            <span className="mt-0.5 text-base">ℹ️</span>
            <p>A <strong>pending</strong> request will be created. The recipient will need to approve it before funds transfer.</p>
          </div>

          <form id="request-money-form" onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Target user */}
            <div>
              <label htmlFor="req-target-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Request from (email)
              </label>
              <input
                id="req-target-email"
                name="targetEmail"
                type="email"
                required
                value={form.targetEmail}
                onChange={handleChange}
                placeholder="friend@example.com"
                className="input-field"
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="req-amount" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold select-none">₹</span>
                <input
                  id="req-amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="input-field pl-8"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="req-category" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="relative">
                {selectedCategory && (
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg select-none">
                    {selectedCategory.icon}
                  </span>
                )}
                <select
                  id="req-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="input-field pl-10 cursor-pointer"
                >
                  {CATEGORY_LIST.map(({ value, label, icon }) => (
                    <option key={value} value={value}>
                      {icon} {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note / Reason */}
            <div>
              <label htmlFor="req-note" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="req-note"
                name="note"
                type="text"
                maxLength={80}
                value={form.note}
                onChange={handleChange}
                placeholder="e.g. Split for dinner"
                className="input-field"
              />
            </div>

            <button
              id="request-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending request…
                </span>
              ) : (
                '📥 Send Request'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
