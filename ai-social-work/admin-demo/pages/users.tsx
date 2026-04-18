// 用户管理页面 - 仅管理员可见

'use client';

import { useAuth, useRequireAuth } from '../hooks/useAuth';
import { AdminLayout } from '../components/Layout';
import { mockUsers } from '../mock/data';

export default function UsersPage() {
  useRequireAuth(['admin']);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">用户管理</h1>
            <p className="text-gray-500 mt-1">管理系统用户账号和权限</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            + 添加用户
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">用户</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">角色</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">邮箱</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      {user.avatar && (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      )}
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? '管理员' : '教师'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-4">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      编辑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
