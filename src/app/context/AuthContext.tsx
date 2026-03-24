import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType } from '@models/auth';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const login = (newToken: string) => setToken(newToken);

  const logout = () => setToken(null);

  const reissue = async (): Promise<string | null> => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reissue`,
        {},
        {withCredentials: true}
      );
      login(res.data.data.accessToken);
      return res.data.data.accessToken;
    } catch {
      logout();
      return null;
    }
  };

  useEffect(() => {
    reissue();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken: token, login, logout, reissue }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}