import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SendMoneyPage from './pages/SendMoneyPage.jsx';
import RequestMoneyPage from './pages/RequestMoneyPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import QRPage from './pages/QRPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import ContactsPage from './pages/ContactsPage.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"    element={<DashboardPage />} />
              <Route path="/send"         element={<SendMoneyPage />} />
              <Route path="/request"      element={<RequestMoneyPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/qr"           element={<QRPage />} />
              <Route path="/analytics"    element={<AnalyticsPage />} />
              <Route path="/contacts"     element={<ContactsPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
