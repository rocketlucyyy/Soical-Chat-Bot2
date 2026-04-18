// 认证状态管理 Hook
// 等A完成登录后，替换为真实API调用

'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { AuthState } from '../types';
import { authenticateUser, mockDelay } from '../mock/data';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 检查本地存储的登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('teacher_token');
      const storedUser = localStorage.getItem('teacher_user');

      if (storedToken && storedUser) {
        setAuth({
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          token: storedToken,
        });
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await mockDelay(800); // 模拟网络延迟

    const matchedUser = authenticateUser(email, password);

    if (matchedUser) {
      const token = 'mock_token_' + Date.now();
      localStorage.setItem('teacher_token', token);
      localStorage.setItem('teacher_user', JSON.stringify(matchedUser));

      setAuth({
        isAuthenticated: true,
        user: matchedUser,
        token,
      });
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('teacher_token');
    localStorage.removeItem('teacher_user');
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoading }}>
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

export function useRequireAuth() {
  const { auth, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      window.location.href = '/teacher/login';
    }
  }, [auth.isAuthenticated, isLoading]);

  return { auth, isLoading };
}
