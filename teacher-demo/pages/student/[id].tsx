// 学生详情页 - 个人训练记录和评分（已集成对话查看）

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStudentDetails } from '../../hooks/useData';
import { TeacherLayout } from '../../components/Layout';
import { Loading } from '../../components/Loading';
import { ScoreCard, CircularScore } from '../../components/ScoreCard';
import { ScoreRadarChart } from '../../components/ScoreRadarChart';
import { DialogViewer } from '../../components/DialogViewer';
import { SearchFilter } from '../../components/SearchFilter';
import { StatCard } from '../../components/StatCard';
import { exportStudentReport } from '../../utils/pdfExport';
import { formatDate, formatDuration, getScoreLevel } from '../../utils/format';
import type { TrainingSession } from '../../types';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const { student, sessions, averageScore, isLoading } = useStudentDetails(studentId);

  // 对话查看弹窗状态
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);

  // 筛选状态
  const [filteredSessions, setFilteredSessions] = useState<TrainingSession[]>(sessions);
  const [searchQuery, setSearchQuery] = useState('');

  // 处理搜索筛选
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterSessions(query, filterState);
  };

  const [filterState, setFilterState] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'recent',
  });

  const handleFilterChange = (filters: typeof filterState) => {
    setFilterState(filters);
    filterSessions(searchQuery, filters);
  };

  const filterSessions = (query: string, filters: typeof filterState) => {
    let result = [...sessions];

    // 搜索筛选
    if (query) {
      result = result.filter(
        (s) =>
          s.characterName.toLowerCase().includes(query.toLowerCase()) ||
          s.characterType.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      result = result.filter((session) => {
        switch (filters.status) {
          case 'completed':
            return (session.score?.overall || 0) >= 85;
          case 'in_progress':
            return session.riskLevel === 'medium';
          case 'not_started':
            return session.riskLevel === 'high';
          default:
            return true;
        }
      });
    }

    // 时间范围筛选
    if (filters.dateRange !== 'all') {
      const now = new Date();
      result = result.filter((s) => {
        const sessionDate = new Date(s.startTime);
        switch (filters.dateRange) {
          case 'today':
            return sessionDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return sessionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return sessionDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // 排序
    switch (filters.sortBy) {
      case 'score_high':
        result.sort((a, b) => (b.score?.overall || 0) - (a.score?.overall || 0));
        break;
      case 'score_low':
        result.sort((a, b) => (a.score?.overall || 100) - (b.score?.overall || 100));
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    }

    setFilteredSessions(result);
  };

  useEffect(() => {
    filterSessions(searchQuery, filterState);
  }, [sessions]);

  const handleExportPDF = () => {
    if (student) {
      exportStudentReport(student, sessions, averageScore);
    }
  };

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center py-12">
          <Loading size="large" />
        </div>
      </TeacherLayout>
    );
  }

  if (!student) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">学生不存在</p>
          <Link href="/teacher/dashboard" className="text-blue-600 mt-2 inline-block">
            返回班级列表
          </Link>
        </div>
      </TeacherLayout>
    );
  }

  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgDuration = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;

  // 使用筛选后的数据或全部数据
  const displaySessions = filteredSessions;

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* 头部 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
              <Link href="/teacher/dashboard" className="hover:text-blue-600">
                我的班级
              </Link>
              <span>/</span>
              <Link href={`/teacher/class/${student.classId}`} className="hover:text-blue-600">
                {student.className}
              </Link>
              <span>/</span>
              <span>{student.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
                {student.name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
                <p className="text-gray-500 text-sm">学号：{student.studentNo}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleExportPDF}
            disabled={sessions.length === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <span>📄</span>
            <span>导出报告</span>
          </button>
        </div>

        {/* 美化后的统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="训练次数"
            value={sessions.length}
            subtitle={`累计 ${Math.floor(totalDuration / 60)}小时${totalDuration % 60}分钟`}
            icon="🎯"
            color="blue"
            delay={0}
          />
          <StatCard
            title="平均时长"
            value={avgDuration}
            subtitle="分钟/次"
            icon="⏱️"
            color="green"
            delay={100}
          />
          <StatCard
            title="平均得分"
            value={averageScore?.overall || '-'}
            subtitle={averageScore ? '综合评分' : '暂无评分'}
            icon="⭐"
            color="purple"
            delay={200}
          />
        </div>

        {averageScore && (
          <>
            {/* 综合评分 - 美化版 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                综合评分
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                  <CircularScore score={averageScore.overall} size={140} />
                  <p className="text-sm text-gray-600 mt-2 font-medium">综合得分</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <ScoreCard label="沟通能力" score={averageScore.communication} size="small" />
                    <ScoreCard label="同理心" score={averageScore.empathy} size="small" />
                    <ScoreCard label="问题解决" score={averageScore.problemSolving} size="small" />
                    <ScoreCard label="专业素养" score={averageScore.professionalism} size="small" />
                  </div>
                </div>
                <div className="hidden md:block p-4 bg-gray-50 rounded-xl">
                  <ScoreRadarChart scores={averageScore} size={180} />
                </div>
              </div>
              {averageScore.feedback && (
                <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-xl">
                  <p className="text-amber-900">
                    <span className="font-semibold flex items-center mb-1">
                      <span className="mr-2">💡</span>
                      AI评语：
                    </span>
                    {averageScore.feedback}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* 搜索筛选 */}
        <SearchFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          placeholder="搜索AI角色或类型..."
          onExport={handleExportPDF}
          exportLabel="导出学生报告"
        />

        {/* 训练记录 - 美化版 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
              训练记录
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {displaySessions.length}
              </span>
            </h2>
            {sessions.length > 0 && (
              <p className="text-sm text-gray-500">
                共 {sessions.length} 次训练
              </p>
            )}
          </div>

          {displaySessions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                🔍
              </div>
              <p className="text-gray-500 text-lg">
                {searchQuery ? '没有找到匹配的训练记录' : '该学生尚未开始训练'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterState({ status: 'all', dateRange: 'all', sortBy: 'recent' });
                    setFilteredSessions(sessions);
                  }}
                  className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  清除筛选
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">序号</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">AI服务对象</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">开始时间</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">时长</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">对话轮数</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">评分</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displaySessions.map((session, index) => (
                    <tr key={session.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                        {displaySessions.length - index}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-xl">
                            {session.characterType === 'elderly' ? '👴' :
                             session.characterType === 'child' ? '👶' :
                             session.characterType === 'disabled' ? '♿' :
                             session.characterType === 'family' ? '👨‍👩‍👧' : '🏘️'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 block">{session.characterName}</span>
                            <span className="text-xs text-gray-500">{session.characterType}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div>{formatDate(session.startTime, true).split(' ')[0]}</div>
                        <div className="text-xs text-gray-400">
                          {formatDate(session.startTime, true).split(' ')[1]}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDuration(session.duration)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {session.messageCount} 轮
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {session.score ? (
                          <span
                            className="px-3 py-1.5 rounded-full text-sm font-semibold"
                            style={{
                              backgroundColor: `${getScoreLevel(session.score.overall).color}15`,
                              color: getScoreLevel(session.score.overall).color,
                            }}
                          >
                            {session.score.overall}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedSession(session)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <span>👁️</span>
                          <span>查看对话</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 对话查看弹窗 */}
      {selectedSession && student && (
        <DialogViewer
          session={selectedSession}
          studentName={student.name}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </TeacherLayout>
  );
}
