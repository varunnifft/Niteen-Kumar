import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api, getStoredToken } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    companyName: string;
    email: string;
    mobile: string;
    designation: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  quickLoginAdmin: () => Promise<void>;
  quickLoginUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api.getMe()
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        api.logout();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const register = async (data: {
    fullName: string;
    companyName: string;
    email: string;
    mobile: string;
    designation: string;
    password: string;
  }) => {
    const res = await api.register(data);
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const res = await api.updateProfile(data);
    setUser(res.user);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const quickLoginAdmin = async () => {
    await login('admin@ironmaking-tech.com', 'Admin@Ironmaking2026!');
  };

  const quickLoginUser = async () => {
    await login('vikram.roy@apexsteel.com', 'Engineer@2026');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        openAuthModal,
        closeAuthModal,
        authModalOpen,
        authModalMode,
        quickLoginAdmin,
        quickLoginUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
