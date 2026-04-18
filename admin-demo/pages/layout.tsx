// 后台管理系统根布局

import { AuthProvider } from '../hooks/useAuth';

export const metadata = {
  title: 'AI社会工作训练平台 - 后台管理',
  description: '社会工作AI训练数据管理平台',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
