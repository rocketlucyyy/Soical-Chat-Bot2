// 后台管理系统认证Hook

'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { mockUsers, mockDelay } from '../mock/data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 检查本地存储的登录状态
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await mockDelay(800);

    // 查找用户
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);

    if (foundUser && password === '123456') {
      localStorage.setItem('admin_user', JSON.stringify(foundUser));
      setUser(foundUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isTeacher: user?.role === 'teacher',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/admin/login';
    }
    if (!isLoading && isAuthenticated && allowedRoles && !allowedRoles.includes(user?.role as UserRole)) {
      window.location.href = '/admin/dashboard';
    }
  }, [isAuthenticated, isLoading, user?.role, allowedRoles]);

  return { user, isAuthenticated, isLoading };
}
