// 报告中心

'use client';

import Link from 'next/link';
import { useRequireAuth } from '../hooks/useAuth';
import { useReportsCenter } from '../hooks/useData';
import { TeacherLayout } from '../components/Layout';
import { Loading } from '../components/Loading';
import { exportClassReport, exportStudentReport } from '../utils/pdfExport';
import { formatDate } from '../utils/format';
import { mockStudents, mockTrainingSessions } from '../mock/data';

export default function ReportsPage() {
  const { auth, isLoading: authLoading } = useRequireAuth();
  const { classSummaries, recentSessions, isLoading } = useReportsCenter(auth.user?.id || '');

  if (authLoading || isLoading) {
    return (
      <TeacherLayout>
        <Loading size="large" text="正在汇总报告数据..." />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-amber-50 via-white to-blue-50 p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-800">报告中心</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            这里集中管理班级训练效果报告和学生个体报告。当前演示版使用网页打印导出 PDF，后续可替换成真实 PDF 生成服务。
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">班级训练效果报告</h2>
            <p className="text-sm text-slate-500">用于教师查看班级参与率、平均分和整体训练效果</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">班级</th>
                  <th className="px-6 py-4 text-left font-medium">参与率</th>
                  <th className="px-6 py-4 text-left font-medium">训练次数</th>
                  <th className="px-6 py-4 text-left font-medium">平均分</th>
                  <th className="px-6 py-4 text-left font-medium">最近训练</th>
                  <th className="px-6 py-4 text-left font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classSummaries.map(({ classData, stats, latestTrainingAt }) => (
                  <tr key={classData.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{classData.name}</div>
                      <div className="text-xs text-slate-500">{classData.grade} · {classData.major}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{stats.trainingRate}%</td>
                    <td className="px-6 py-4 text-slate-600">{stats.totalSessions}</td>
                    <td className="px-6 py-4 text-slate-600">{stats.avgScore}</td>
                    <td className="px-6 py-4 text-slate-500">{latestTrainingAt ? formatDate(latestTrainingAt, true) : '暂无'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/teacher/class/${classData.id}`}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
                        >
                          查看
                        </Link>
                        <button
                          onClick={() => {
                            const students = mockStudents.filter((student) => student.classId === classData.id);
                            exportClassReport(classData, stats, students);
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
                        >
                          导出 PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">学生个体报告快捷入口</h2>
            <p className="text-sm text-slate-500">按最近训练记录快速进入学生页面或直接导出个人报告</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">学生</th>
                  <th className="px-6 py-4 text-left font-medium">班级</th>
                  <th className="px-6 py-4 text-left font-medium">AI服务对象</th>
                  <th className="px-6 py-4 text-left font-medium">评分</th>
                  <th className="px-6 py-4 text-left font-medium">训练时间</th>
                  <th className="px-6 py-4 text-left font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSessions.map((session) => {
                  const student = mockStudents.find((item) => item.id === session.studentId);
                  if (!student) return null;

                  return (
                    <tr key={session.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{session.studentName}</td>
                      <td className="px-6 py-4 text-slate-600">{session.className}</td>
                      <td className="px-6 py-4 text-slate-600">{session.characterName}</td>
                      <td className="px-6 py-4 text-slate-600">{session.score?.overall || '-'}</td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(session.startTime, true)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/teacher/student/${session.studentId}`}
                            className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
                          >
                            查看
                          </Link>
                          <button
                            onClick={() => {
                              const studentSessions = mockTrainingSessions.filter((item) => item.studentId === session.studentId);
                              const scores = studentSessions
                                .map((item) => item.score)
                                .filter((item): item is NonNullable<typeof item> => Boolean(item));
                              const averageScore = scores.length
                                ? {
                                    communication: Math.round(scores.reduce((sum, item) => sum + item.communication, 0) / scores.length),
                                    empathy: Math.round(scores.reduce((sum, item) => sum + item.empathy, 0) / scores.length),
                                    problemSolving: Math.round(scores.reduce((sum, item) => sum + item.problemSolving, 0) / scores.length),
                                    professionalism: Math.round(scores.reduce((sum, item) => sum + item.professionalism, 0) / scores.length),
                                    overall: Math.round(scores.reduce((sum, item) => sum + item.overall, 0) / scores.length),
                                    feedback: scores[0].feedback,
                                  }
                                : null;
                              exportStudentReport(student, studentSessions, averageScore);
                            }}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
                          >
                            导出 PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </TeacherLayout>
  );
}
