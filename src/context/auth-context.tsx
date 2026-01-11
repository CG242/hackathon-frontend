'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authApi, type User as ApiUser } from '@/lib/api';

interface AuthContextType {
  user: ApiUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // Format attendu: { access_token: string, user: {...} }
        if (parsed?.user) {
          setUser(parsed.user as ApiUser);
        } else {
          // Ancien format (front-only). On nettoie.
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      // Nettoyage de l'ancien mode auth front-only
      localStorage.removeItem('admin_users');
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('admin_users');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    localStorage.setItem('user', JSON.stringify(result));
    setUser(result.user);
    return result.user;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin_users');
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

