// 后台仪表盘页面

'use client';

import Link from 'next/link';
import { useAuth, useRequireAuth } from '../hooks/useAuth';
import { useDashboardStats, useConversations } from '../hooks/useData';
import { AdminLayout } from '../components/Layout';
import { formatDateTime, formatDuration, getCharacterIcon, getScoreColor, getScoreLevel } from '../utils/format';

export default function AdminDashboardPage() {
  useRequireAuth();
  const { user, isAdmin, isTeacher } = useAuth();
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { conversations, isLoading: convLoading } = useConversations();

  const recentConversations = conversations.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 欢迎区域 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">
            欢迎回来，{user?.name}！
          </h1>
          <p className="mt-2 text-indigo-100">
            {isAdmin
              ? '您是系统管理员，可以查看和管理所有训练数据。'
              : '您可以查看和管理您班级学生的训练数据。'}
          </p>
        </div>

        {/* 统计卡片 */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总对话数</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalConversations}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  💬
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                今日新增 {stats.todayConversations} 条
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">学生总数</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                  👨‍🎓
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                本周活跃 {stats.activeStudents} 人
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">平均评分</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.avgScore.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                  ⭐
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                满分 5.0
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总训练时长</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {Math.floor(stats.totalDuration / 60)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                  ⏱️
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {stats.totalDuration % 60} 分钟
              </p>
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/conversations"
            className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📋
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">查看对话记录</h3>
                <p className="text-sm text-gray-500">浏览所有训练对话数据</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/students"
            className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                👥
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">学生管理</h3>
                <p className="text-sm text-gray-500">管理学生信息和训练情况</p>
              </div>
            </div>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/users"
              className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ⚙️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">系统设置</h3>
                  <p className="text-sm text-gray-500">管理用户和系统配置</p>
                </div>
              </div>
            </Link>
          )}

          {isTeacher && (
            <Link
              href="/admin/reports"
              className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📊
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">训练报告</h3>
                  <p className="text-sm text-gray-500">生成班级训练报告</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* 最近对话 */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">最近对话记录</h2>
            <Link href="/admin/conversations" className="text-sm text-indigo-600 hover:text-indigo-700">
              查看全部 →
            </Link>
          </div>

          {convLoading ? (
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : recentConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">暂无对话记录</div>
          ) : (
            <div className="divide-y">
              {recentConversations.map((conv) => (
                <div key={conv.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCharacterIcon(conv.characterType)}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-800">{conv.studentName}</span>
                          <span className="text-xs text-gray-400">{conv.studentNo}</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {conv.className}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          与 {conv.characterName} 的对话 · {formatDuration(conv.duration)} · {conv.messageCount}条消息
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {conv.score && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(conv.score.overall)}`}>
                          {conv.score.overall.toFixed(1)}
                        </span>
                      )}
                      <span className="text-sm text-gray-400">
                        {formatDateTime(conv.startTime)}
                      </span>
                      <Link
                        href={`/admin/conversations/${conv.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        查看
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
