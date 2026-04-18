// 对话详情页面 - 查看完整对话内容

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useConversationDetail } from '../../hooks/useData';
import { useAuth, useRequireAuth } from '../../hooks/useAuth';
import { AdminLayout } from '../../components/Layout';
import { formatDateTime, formatDuration, getCharacterIcon, getScoreColor, getScoreLevel } from '../../utils/format';

export default function ConversationDetailPage() {
  useRequireAuth();
  const params = useParams();
  const conversationId = params.id as string;
  const { conversation, isLoading } = useConversationDetail(conversationId);
  const { isAdmin } = useAuth();
  const [showAnalysis, setShowAnalysis] = useState(true);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!conversation) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">对话不存在或无权查看</p>
          <Link href="/admin/conversations" className="text-indigo-600 mt-2 inline-block">
            返回列表
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 头部导航 */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/admin/dashboard" className="hover:text-indigo-600">仪表盘</Link>
          <span>/</span>
          <Link href="/admin/conversations" className="hover:text-indigo-600">对话管理</Link>
          <span>/</span>
          <span className="text-gray-800">对话详情</span>
        </div>

        {/* 对话信息卡片 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* 学生信息 */}
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {conversation.studentName[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{conversation.studentName}</h1>
                <p className="text-gray-500">{conversation.studentNo}</p>
                <p className="text-sm text-gray-400 mt-1">{conversation.className}</p>
              </div>
            </div>

            {/* AI角色信息 */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{getCharacterIcon(conversation.characterType)}</span>
              <div>
                <h2 className="font-semibold text-gray-800">{conversation.characterName}</h2>
                <p className="text-sm text-gray-500">AI服务对象</p>
              </div>
            </div>

            {/* 训练统计 */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{formatDuration(conversation.duration)}</p>
                <p className="text-sm text-gray-500">训练时长</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{conversation.messageCount}</p>
                <p className="text-sm text-gray-500">消息数</p>
              </div>
              {conversation.score && (
                <div className="text-center">
                  <p className={`text-2xl font-bold ${getScoreColor(conversation.score.overall).split(' ')[0]}`}>
                    {conversation.score.overall.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500">综合评分</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
            <span>开始时间：{formatDateTime(conversation.startTime)}</span>
            <span>结束时间：{formatDateTime(conversation.endTime)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 对话内容 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">对话记录</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {showAnalysis ? '隐藏分析' : '显示分析'}
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {conversation.messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === 'student' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'student'
                          ? 'bg-indigo-500 text-white rounded-br-md'
                          : msg.role === 'system'
                          ? 'bg-gray-100 text-gray-600 rounded-full text-center text-sm mx-auto'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                      }`}
                    >
                      {msg.role !== 'system' && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs opacity-75">
                            {msg.role === 'student' ? conversation.studentName : conversation.characterName}
                          </span>
                          <span className="text-xs opacity-50">
                            {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.emotion && showAnalysis && (
                            <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                              {msg.emotion}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 评分分析 */}
          <div className="space-y-6">
            {conversation.score && (
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h3 className="font-semibold text-gray-800 mb-4">AI评分分析</h3>

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreColor(conversation.score.overall)}`}>
                    <span className="text-3xl font-bold">{conversation.score.overall.toFixed(1)}</span>
                  </div>
                  <p className="text-lg font-medium text-gray-700 mt-2">{getScoreLevel(conversation.score.overall)}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">专业技巧</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(conversation.score.professionalSkills / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{conversation.score.professionalSkills}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">伦理遵守</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(conversation.score.ethics / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{conversation.score.ethics}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">文化敏感</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(conversation.score.culturalSensitivity / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{conversation.score.culturalSensitivity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">语言适切</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(conversation.score.language / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{conversation.score.language}</span>
                    </div>
                  </div>
                </div>

                {conversation.score.feedback && (
                  <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">AI评语：</span>
                      {conversation.score.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-semibold text-gray-800 mb-4">操作</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  导出对话记录
                </button>
                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  标记为优秀案例
                </button>
                {isAdmin && (
                  <button className="w-full px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    删除记录
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
