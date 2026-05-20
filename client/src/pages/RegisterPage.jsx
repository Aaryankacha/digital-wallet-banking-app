import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService.js';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())    return 'Name is required.';
    if (!form.email.trim())   return 'Email is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
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
      await registerUser({ name: form.name, email: form.email, password: form.password });
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login', { replace: true }), 1400);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 dark:bg-dark-bg px-4 py-10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-800/10 blur-3xl" />

      <div className="card w-full max-w-md p-8 shadow-xl animate-fade-in">
        {/* Logo */}
        <div className="mb-8 text-center">
          <p className="text-3xl font-extrabold tracking-tight text-brand-500">
            Pay<span className="text-gray-900 dark:text-white">Wave</span>
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create your free account
          </p>
        </div>

        {error && (
          <div id="register-error-banner" className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div id="register-success-banner" className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            <span>✅</span> {success}
          </div>
        )}

        <form id="register-form" onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full name
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Aryan Sharma"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-field pr-12"
              />
              <button
                type="button"
                id="toggle-reg-password-btn"
                onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="reg-confirm" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm password
            </label>
            <input
              id="reg-confirm"
              name="confirm"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="input-field"
            />
          </div>

          {/* Password strength hint */}
          {form.password.length > 0 && (
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    form.password.length >= i * 3
                      ? i === 1 ? 'bg-red-400' : i === 2 ? 'bg-yellow-400' : 'bg-green-500'
                      : 'bg-gray-200 dark:bg-dark-border'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating account…
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            id="go-to-login-link"
            className="font-semibold text-brand-500 hover:text-brand-600 transition-colors"
          >
            Sign in
          </Link>
        </p>

        {/* Starter balance note */}
        <p className="mt-4 text-center text-xs text-gray-400">
          🎁 New accounts start with ₹1,000 demo balance
        </p>
      </div>
    </div>
  );
}
