import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string; id: string; isActive: boolean } | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const navigate = useNavigate();

  // Check cookie/session on mount
  useEffect(() => {
    axios
      .get(`${API_URL}/web/v1/auth/me`, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.success && res.data.admin) {
          console.log('Auth check success:', res.data);
          setAuthState({ isAuthenticated: true, user: res.data.admin, loading: false });
        } else {
          console.log('Auth check failed:', res.data);
          setAuthState({ isAuthenticated: false, user: null, loading: false });
        }
      })
      .catch(() => setAuthState({ isAuthenticated: false, user: null, loading: false }));
  }, []);


  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${API_URL}/web/v1/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      // Correctly check for success and admin object
      if (res.data && res.data.success && res.data.admin) {
        setAuthState({ isAuthenticated: true, user: res.data.admin, loading: false });
        return true;
      }
      setAuthState({ isAuthenticated: false, user: null, loading: false });
      return false;
    } catch (err) {
      setAuthState({ isAuthenticated: false, user: null, loading: false });
      return false;
    }
  };


  const logout = async () => {
    try {
      await axios.post(
        `${API_URL}/web/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      // Ignore error, just clear state
    }
    setAuthState({ isAuthenticated: false, user: null, loading: false });
    navigate('/', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        loading: authState.loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
