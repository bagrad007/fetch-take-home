import { createContext, useContext, useState, useEffect } from 'react';
import { dogsApi } from '../api';
import { authApi } from '../api';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dogsApi.fetchBreeds();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setInitialized(true);
      }
    };
    checkAuth();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!initialized) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
