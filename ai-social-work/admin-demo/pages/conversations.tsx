// 对话管理页面 - 查看所有储存的对话数据

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, useRequireAuth } from '../hooks/useAuth';
import { useConversations, useClasses } from '../hooks/useData';
import { AdminLayout } from '../components/Layout';
import { formatDateTime, formatDuration, getCharacterIcon, getCharacterTypeName, getScoreColor, getScoreLevel } from '../utils/format';
import type { FilterState } from '../types';

export default function ConversationsPage() {
  useRequireAuth();
  const { isAdmin } = useAuth();
  const { classes } = useClasses();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    classId: 'all',
    characterType: 'all',
    dateRange: 'all',
    status: 'all',
    minScore: '',
    maxScore: '',
  });

  const { conversations, total, isLoading } = useConversations(filters);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      classId: 'all',
      characterType: 'all',
      dateRange: 'all',
      status: 'all',
      minScore: '',
      maxScore: '',
    });
  };

  const hasActiveFilters = filters.search || filters.classId !== 'all' ||
    filters.characterType !== 'all' || filters.dateRange !== 'all' ||
    filters.status !== 'all' || filters.minScore || filters.maxScore;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">对话管理</h1>
            <p className="text-gray-500 mt-1">
              共 {total} 条对话记录
              {isAdmin && ' · 管理员可查看所有数据'}
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
            <span>📥</span>
            <span>导出数据</span>
          </button>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white p-5 rounded-xl shadow-sm border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 搜索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">搜索</label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="姓名、学号..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            {/* 班级筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">班级</label>
              <select
                value={filters.classId}
                onChange={(e) => handleFilterChange('classId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">全部班级</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* 角色类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">服务类型</label>
              <select
                value={filters.characterType}
                onChange={(e) => handleFilterChange('characterType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">全部类型</option>
                <option value="elderly">老年人服务</option>
                <option value="child">儿童服务</option>
                <option value="disabled">残障服务</option>
                <option value="family">家庭服务</option>
                <option value="community">社区服务</option>
              </select>
            </div>

            {/* 时间范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">时间范围</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">全部时间</option>
                <option value="today">今天</option>
                <option value="week">最近7天</option>
                <option value="month">最近30天</option>
              </select>
            </div>
          </div>

          {/* 评分筛选 */}
          <div className="flex items-center space-x-4 pt-2 border-t">
            <span className="text-sm text-gray-600">评分范围：</span>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={filters.minScore}
              onChange={(e) => handleFilterChange('minScore', e.target.value)}
              placeholder="最低分"
              className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={filters.maxScore}
              onChange={(e) => handleFilterChange('maxScore', e.target.value)}
              placeholder="最高分"
              className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                <span>✕</span>
                <span>清除筛选</span>
              </button>
            )}
          </div>
        </div>

        {/* 对话列表 */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">加载中...</div>
          ) : conversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                🔍
              </div>
              <p className="text-gray-500 text-lg">没有找到匹配的记录</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  清除筛选条件
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">学生信息</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">AI服务对象</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">训练时间</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">时长/消息</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">评分</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {conversations.map((conv) => (
                    <tr key={conv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {conv.studentName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{conv.studentName}</p>
                            <p className="text-xs text-gray-500">{conv.studentNo}</p>
                            <p className="text-xs text-gray-400">{conv.className}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getCharacterIcon(conv.characterType)}</span>
                          <div>
                            <p className="font-medium text-gray-800">{conv.characterName}</p>
                            <p className="text-xs text-gray-500">{getCharacterTypeName(conv.characterType)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDateTime(conv.startTime)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-600">
                          <p>{formatDuration(conv.duration)}</p>
                          <p className="text-xs text-gray-400">{conv.messageCount} 条消息</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {conv.score ? (
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(conv.score.overall)}`}>
                              {conv.score.overall.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500">{getScoreLevel(conv.score.overall)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/conversations/${conv.id}`}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          查看详情
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 分页 */}
          {conversations.length > 0 && (
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <p className="text-sm text-gray-500">
                显示 {conversations.length} 条记录
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                  上一页
                </button>
                <button className="px-3 py-1 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
