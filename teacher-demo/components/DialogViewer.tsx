// 对话详情查看组件 - 显示学生与AI的完整对话记录

'use client';

import { useState } from 'react';
import type { TrainingSession } from '../types';
import { formatDate, formatDuration } from '../utils/format';

interface DialogViewerProps {
  session: TrainingSession;
  studentName: string;
  onClose: () => void;
}

export function DialogViewer({ session, studentName, onClose }: DialogViewerProps) {
  const [activeTab, setActiveTab] = useState<'dialog' | 'analysis'>('dialog');

  const handleExport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${studentName} - ${session.characterName} 对话记录</title>
          <style>
            body { font-family: 'Microsoft YaHei', sans-serif; padding: 32px; color: #1f2937; }
            h1 { margin-bottom: 8px; }
            .meta { color: #6b7280; margin-bottom: 24px; }
            .message { margin-bottom: 16px; padding: 12px 16px; border-radius: 12px; background: #f8fafc; }
            .message strong { display: inline-block; margin-bottom: 6px; }
          </style>
        </head>
        <body>
          <h1>${studentName} - ${session.characterName}</h1>
          <div class="meta">${formatDate(session.startTime, true)} | ${formatDuration(session.duration)} | ${session.messageCount}轮</div>
          ${session.messages
            .map(
              (message) => `
                <div class="message">
                  <strong>${getRoleName(message.role)}</strong>
                  <div>${message.content}</div>
                </div>
              `
            )
            .join('')}
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return '👨‍🎓';
      case 'ai':
        return '🤖';
      case 'system':
        return '🔔';
      default:
        return '💬';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'student':
        return studentName;
      case 'ai':
        return session.characterName;
      case 'system':
        return '系统';
      default:
        return '';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-50 border-blue-200';
      case 'ai':
        return 'bg-green-50 border-green-200';
      case 'system':
        return 'bg-gray-100 border-gray-200 text-gray-600';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              {session.characterType === 'elderly' ? '👴' :
               session.characterType === 'child' ? '👶' :
               session.characterType === 'disabled' ? '♿' :
               session.characterType === 'family' ? '👨‍👩‍👧' : '🏘️'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {studentName} vs {session.characterName}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(session.startTime, true)} · {formatDuration(session.duration)} · {session.messageCount}轮对话
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('dialog')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'dialog'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            💬 对话记录
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📊 AI分析
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'dialog' ? (
            <div className="space-y-4">
              {session.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'student'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : msg.role === 'system'
                        ? 'bg-gray-100 text-gray-600 rounded-full text-center text-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {msg.role !== 'system' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span>{getRoleIcon(msg.role)}</span>
                        <span className="text-xs opacity-75">{getRoleName(msg.role)}</span>
                        {msg.time && <span className="text-xs opacity-50">{msg.time}</span>}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI评分分析 */}
              {session.score && (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">🎯 综合评分</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{session.score.overall}</div>
                        <div className="text-sm text-gray-600">综合得分</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{session.score.communication}</div>
                        <div className="text-sm text-gray-600">沟通能力</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{session.score.empathy}</div>
                        <div className="text-sm text-gray-600">同理心</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{session.score.problemSolving}</div>
                        <div className="text-sm text-gray-600">问题解决</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">💡 AI评语</h4>
                    <p className="text-amber-800">{session.score.feedback}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">📋 详细分析</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">开场建立信任</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[85%] h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">85</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">需求识别能力</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[92%] h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">92</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">资源链接能力</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[78%] h-full bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-yellow-600">78</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">沟通技巧运用</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[88%] h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">88</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📝 改进建议</h4>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li className="flex items-start space-x-2">
                        <span>•</span>
                        <span>开场时可以更主动地介绍自己的身份和来意，减少服务对象的防备心理</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span>•</span>
                        <span>在资源链接方面表现良好，但可以提前准备更多资源信息</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span>•</span>
                        <span>建议多使用开放式问题，鼓励服务对象表达更多需求</span>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            关闭
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            导出此记录
          </button>
        </div>
      </div>
    </div>
  );
}
