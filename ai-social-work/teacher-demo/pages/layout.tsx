// 教师端根布局

import { AuthProvider } from '../hooks/useAuth';

export const metadata = {
  title: 'AI社会工作教育平台 - 教师端',
  description: '社会工作教育AI训练平台教师后台',
};

export default function TeacherRootLayout({
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
