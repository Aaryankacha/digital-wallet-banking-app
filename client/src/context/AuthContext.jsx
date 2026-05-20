import { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext – stores JWT token + user info globally.
 * Phase 1: JWT-based login/register with localStorage persistence.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);   // { id, name, email }
  const [token, setToken] = useState(null);   // raw JWT string
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('dw_token');
    const storedUser  = localStorage.getItem('dw_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('dw_token', jwtToken);
    localStorage.setItem('dw_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dw_token');
    localStorage.removeItem('dw_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
