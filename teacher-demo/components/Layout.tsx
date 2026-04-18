// 教师端布局组件

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { auth, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/teacher/dashboard', label: '数据总览', icon: '🧭' },
    { href: '/teacher/reports', label: '报告中心', icon: '📊' },
    { href: '/teacher/settings', label: '系统设置', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/teacher/dashboard" className="text-xl font-bold text-blue-600">
                AI社会工作教育平台
              </Link>
              <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {auth.user?.role === 'admin' ? '管理端' : '教师端'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {auth.user && (
                <>
                  <div className="flex items-center space-x-2">
                    {auth.user.avatar && (
                      <img
                        src={auth.user.avatar}
                        alt={auth.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="text-right">
                      <div className="text-sm text-gray-700">{auth.user.name}</div>
                      <div className="text-xs text-gray-400">{auth.user.title}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-500 hover:text-gray-700"
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
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
