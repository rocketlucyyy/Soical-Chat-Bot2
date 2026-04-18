// 学生管理页面

'use client';

import Link from 'next/link';
import { useAuth, useRequireAuth } from '../hooks/useAuth';
import { useStudents, useClasses } from '../hooks/useData';
import { AdminLayout } from '../components/Layout';

export default function StudentsPage() {
  useRequireAuth();
  const { isAdmin } = useAuth();
  const { classes } = useClasses();
  const { students, isLoading } = useStudents();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isAdmin ? '学生管理' : '我的学生'}
            </h1>
            <p className="text-gray-500 mt-1">
              共 {students.length} 名学生
            </p>
          </div>
          {isAdmin && (
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              + 添加学生
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">加载中...</div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-gray-500">暂无学生数据</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">学号</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">姓名</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">班级</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-600 font-mono">{student.studentNo}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name[0]}
                          </div>
                          <span className="font-medium text-gray-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{student.className}</td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/conversations?student=${student.id}`}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          查看对话
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
