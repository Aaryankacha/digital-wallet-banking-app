import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sendMoney } from '../services/walletService.js';
import { CATEGORY_LIST } from '../utils/categories.js';
import Navbar from '../components/common/Navbar.jsx';

export default function SendMoneyPage() {
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledEmail = searchParams.get('to') || '';
  
  const [form, setForm]     = useState({ receiverEmail: prefilledEmail, amount: '', category: 'other', note: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.receiverEmail.trim()) return 'Recipient email is required.';
    if (!/\S+@\S+\.\S+/.test(form.receiverEmail)) return 'Enter a valid email.';
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
      await sendMoney({
        receiverEmail: form.receiverEmail,
        amount: parseFloat(form.amount),
        category: form.category,
        note: form.note,
      });
      setSuccess(`₹${parseFloat(form.amount).toFixed(2)} sent to ${form.receiverEmail}! Redirecting…`);
      setTimeout(() => navigate('/dashboard'), 1600);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed. Please try again.');
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
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Send Money 💸</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Transfer funds to any PayWave user instantly.
          </p>
        </div>

        <div className="card p-6 shadow-md">
          {error && (
            <div id="send-error-banner" className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div id="send-success-banner" className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
              <span>✅</span> {success}
            </div>
          )}

          <form id="send-money-form" onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Recipient */}
            <div>
              <label htmlFor="send-receiver-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Recipient email
              </label>
              <input
                id="send-receiver-email"
                name="receiverEmail"
                type="email"
                required
                value={form.receiverEmail}
                onChange={handleChange}
                placeholder="friend@example.com"
                className="input-field"
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="send-amount" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold select-none">₹</span>
                <input
                  id="send-amount"
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
              <label htmlFor="send-category" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="relative">
                {selectedCategory && (
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg select-none">
                    {selectedCategory.icon}
                  </span>
                )}
                <select
                  id="send-category"
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

            {/* Note */}
            <div>
              <label htmlFor="send-note" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Note <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="send-note"
                name="note"
                type="text"
                maxLength={80}
                value={form.note}
                onChange={handleChange}
                placeholder="What's it for?"
                className="input-field"
              />
            </div>

            <button
              id="send-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending…
                </span>
              ) : (
                '💸 Send Money'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
