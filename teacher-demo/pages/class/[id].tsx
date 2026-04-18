// 班级详情页 - 训练统计和学生列表（美化版）

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useClassDetails } from '../../hooks/useData';
import { TeacherLayout } from '../../components/Layout';
import { Loading } from '../../components/Loading';
import { ScoreCard } from '../../components/ScoreCard';
import { SearchFilter } from '../../components/SearchFilter';
import { StatCard, ProgressCard } from '../../components/StatCard';
import { exportClassReport } from '../../utils/pdfExport';
import { formatDate } from '../../utils/format';
import type { Student } from '../../types';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;
  const { classData, stats, students, isLoading } = useClassDetails(classId);

  // 筛选状态
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'recent',
  });

  // 处理搜索筛选
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterStudents(query, filterState);
  };

  const handleFilterChange = (filters: typeof filterState) => {
    setFilterState(filters);
    filterStudents(searchQuery, filters);
  };

  const filterStudents = (query: string, filters: typeof filterState) => {
    let result = [...students];

    // 搜索筛选
    if (query) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.studentNo.includes(query)
      );
    }

    // 状态筛选
    if (filters.status !== 'all') {
      result = result.filter((s) => {
        switch (filters.status) {
          case 'completed':
            return s.trainingCount >= 4;
          case 'in_progress':
            return s.trainingCount > 0 && s.trainingCount < 4;
          case 'not_started':
            return s.trainingCount === 0;
          default:
            return true;
        }
      });
    }

    // 排序
    switch (filters.sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'training_count':
        result.sort((a, b) => b.trainingCount - a.trainingCount);
        break;
      case 'recent':
      default:
        result.sort((a, b) => {
          if (!a.lastTrainingAt) return 1;
          if (!b.lastTrainingAt) return -1;
          return new Date(b.lastTrainingAt).getTime() - new Date(a.lastTrainingAt).getTime();
        });
    }

    setFilteredStudents(result);
  };

  useEffect(() => {
    filterStudents(searchQuery, filterState);
  }, [students]);

  const handleExportPDF = () => {
    if (classData && stats) {
      exportClassReport(classData, stats, students);
    }
  };

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="space-y-6">
          <Loading size="large" />
        </div>
      </TeacherLayout>
    );
  }

  if (!classData || !stats) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">班级不存在</p>
          <Link href="/teacher/dashboard" className="text-blue-600 mt-2 inline-block">
            返回班级列表
          </Link>
        </div>
      </TeacherLayout>
    );
  }

  const displayStudents = filteredStudents;

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
                <span>{classData.name}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{classData.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{classData.grade} · {classData.major}</p>
            </div>
            <button
              onClick={handleExportPDF}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <span>📄</span>
              <span>导出班级报告</span>
            </button>
          </div>

          {/* 美化后的统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="训练参与率"
              value={`${stats.trainingRate}%`}
              subtitle={`${stats.trainedStudents}/${stats.totalStudents} 人已训练`}
              icon="👥"
              color="blue"
              delay={0}
            />
            <StatCard
              title="总训练次数"
              value={stats.totalSessions}
              subtitle="累计训练"
              icon="🎯"
              color="green"
              delay={100}
            />
            <StatCard
              title="班级平均分"
              value={stats.avgScore}
              subtitle="综合得分"
              icon="⭐"
              color="purple"
              delay={200}
            />
            <StatCard
              title="优秀人数"
              value={stats.scoreDistribution.excellent}
              subtitle="90分以上"
              icon="🏆"
              color="orange"
              delay={300}
            />
          </div>

          {/* 训练进度 */}
          <ProgressCard
            title="训练完成进度"
            current={stats.trainedStudents}
            total={stats.totalStudents}
            color="blue"
          />

          {/* 各维度均分 */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
              各维度均分
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ScoreCard label="沟通能力" score={stats.avgCommunication} />
              <ScoreCard label="同理心" score={stats.avgEmpathy} />
              <ScoreCard label="问题解决" score={stats.avgProblemSolving} />
              <ScoreCard label="专业素养" score={stats.avgProfessionalism} />
            </div>
          </div>

          {/* 分数分布 */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
              分数分布
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <p className="text-3xl font-bold text-green-600">{stats.scoreDistribution.excellent}</p>
                <p className="text-sm text-gray-600 mt-1">优秀 (90-100)</p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((stats.scoreDistribution.excellent / stats.totalStudents) * 100) || 0}%
                </p>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-3xl font-bold text-blue-600">{stats.scoreDistribution.good}</p>
                <p className="text-sm text-gray-600 mt-1">良好 (80-89)</p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((stats.scoreDistribution.good / stats.totalStudents) * 100) || 0}%
                </p>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                <p className="text-3xl font-bold text-yellow-600">{stats.scoreDistribution.average}</p>
                <p className="text-sm text-gray-600 mt-1">中等 (60-79)</p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((stats.scoreDistribution.average / stats.totalStudents) * 100) || 0}%
                </p>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                <p className="text-3xl font-bold text-red-600">{stats.scoreDistribution.poor}</p>
                <p className="text-sm text-gray-600 mt-1">需改进 (&lt;60)</p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((stats.scoreDistribution.poor / stats.totalStudents) * 100) || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* 搜索筛选 */}
          <SearchFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            placeholder="搜索学生姓名或学号..."
            onExport={handleExportPDF}
            exportLabel="导出班级报告"
          />

          {/* 学生列表 - 美化版 */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                学生训练情况
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {displayStudents.length}
                </span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">学号</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">姓名</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">训练次数</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">最后训练</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-600 font-mono">{student.studentNo}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name[0]}
                          </div>
                          <span className="font-medium text-gray-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          student.trainingCount >= 4
                            ? 'bg-green-100 text-green-700'
                            : student.trainingCount > 0
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {student.trainingCount} 次
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {student.lastTrainingAt ? formatDate(student.lastTrainingAt) : (
                          <span className="text-gray-400">从未训练</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {student.trainingCount >= 4 ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm rounded-full font-medium flex items-center w-fit">
                            <span className="mr-1">🏆</span> 优秀
                          </span>
                        ) : student.trainingCount > 0 ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm rounded-full font-medium flex items-center w-fit">
                            <span className="mr-1">📚</span> 进行中
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium flex items-center w-fit">
                            <span className="mr-1">⏳</span> 未开始
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/teacher/student/${student.id}`}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          查看报告
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {displayStudents.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  🔍
                </div>
                <p className="text-gray-500 text-lg">没有找到匹配的学生</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterState({ status: 'all', dateRange: 'all', sortBy: 'recent' });
                    setFilteredStudents(students);
                  }}
                  className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  清除筛选
                </button>
              </div>
            )}
          </div>
        </div>
      </TeacherLayout>
  );
}
