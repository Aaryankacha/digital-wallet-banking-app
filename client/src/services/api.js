import axios from 'axios';

/**
 * Axios instance pre-configured for the backend API.
 * Automatically attaches JWT Bearer token from localStorage.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});
// Request interceptor – inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dw_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dw_token');
      localStorage.removeItem('dw_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
