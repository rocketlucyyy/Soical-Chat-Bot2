// 教师端入口 - 自动跳转到仪表盘或登录页

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';

export default function TeacherHomePage() {
  const { auth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (auth.isAuthenticated) {
        router.push('/teacher/dashboard');
      } else {
        router.push('/teacher/login');
      }
    }
  }, [auth.isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="large" text="正在加载..." />
    </div>
  );
}
