import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem('safedrive_auth');
    return stored ? JSON.parse(stored) : { isAuthenticated: false, user: null };
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('safedrive_auth', JSON.stringify(authState));
  }, [authState]);

  const login = (email: string, password: string) => {
    // Dummy authentication logic
    if (email === 'admin@safedrive.com' && password === 'Admin@123') {
      const user = { email, name: 'Admin User' };
      setAuthState({ isAuthenticated: true, user });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, user: null });
    localStorage.removeItem('safedrive_auth');
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
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
