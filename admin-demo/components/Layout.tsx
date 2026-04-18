// 后台管理系统布局组件

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: LayoutProps) {
  const { user, logout, isAdmin, isTeacher } = useAuth();
  const pathname = usePathname();

  const adminNavItems = [
    { href: '/admin/dashboard', label: '仪表盘', icon: '📊' },
    { href: '/admin/conversations', label: '对话管理', icon: '💬' },
    { href: '/admin/students', label: '学生管理', icon: '👨‍🎓' },
    { href: '/admin/classes', label: '班级管理', icon: '📚' },
    { href: '/admin/users', label: '用户管理', icon: '👥' },
    { href: '/admin/settings', label: '系统设置', icon: '⚙️' },
  ];

  const teacherNavItems = [
    { href: '/admin/dashboard', label: '仪表盘', icon: '📊' },
    { href: '/admin/conversations', label: '对话记录', icon: '💬' },
    { href: '/admin/students', label: '我的学生', icon: '👨‍🎓' },
    { href: '/admin/reports', label: '训练报告', icon: '📈' },
  ];

  const navItems = isAdmin ? adminNavItems : teacherNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-xl font-bold text-indigo-600">
                AI社会工作训练平台
              </Link>
              <span className={`px-2 py-1 text-xs rounded-full ${
                isAdmin ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {isAdmin ? '管理员' : '教师'}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="flex items-center space-x-3">
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full border-2 border-gray-200"
                      />
                    )}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    退出
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* 侧边栏 */}
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r sticky top-16">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 底部信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="text-xs text-gray-500 text-center">
              <p>AI社会工作训练平台</p>
              <p className="mt-1">版本 1.0.0</p>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
