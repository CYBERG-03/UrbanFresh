import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Context Layer – Manages authentication state across the app.
 * Stores JWT token and user info in localStorage for persistence.
 * Provides login/logout functions and current user data to all components.
 */
const AuthContext = createContext(null);

const TOKEN_KEY = 'uf_token';
const USER_KEY = 'uf_user';

/** Parse stored user JSON safely. Returns null if invalid. */
const loadUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => loadUser());

  /** Keep localStorage in sync whenever token/user changes. */
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  /**
   * Save token and user info after successful login.
   * @param {string} jwt - JWT token from backend
   * @param {object} userData - { email, name, role }
   */
  const login = (jwt, userData) => {
    setToken(jwt);
    setUser(userData);
  };

  /** Clear auth state on logout. */
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth state from any component.
 * @returns {{ token, user, isAuthenticated, login, logout }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
