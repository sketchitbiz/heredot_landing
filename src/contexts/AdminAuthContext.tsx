'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type AdminAuthContextType = {
  isLoggedIn: boolean;
  ready: boolean;
  login: (id: string, token: string) => void;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_access_token');
    setIsLoggedIn(!!token);
    setReady(true); // ✅ 상태 동기화 완료
  }, []);

  const login = (id: string, token: string) => {
    localStorage.setItem('adminId', id);
    localStorage.setItem('admin_access_token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn, ready, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
