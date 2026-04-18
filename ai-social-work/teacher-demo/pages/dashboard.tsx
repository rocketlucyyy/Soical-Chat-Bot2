// 教师/管理员仪表盘

'use client';

import Link from 'next/link';
import { useRequireAuth } from '../hooks/useAuth';
import { useTeacherClasses, useTeacherDashboard } from '../hooks/useData';
import { TeacherLayout } from '../components/Layout';
import { Loading } from '../components/Loading';
import { StatCard } from '../components/StatCard';
import { formatDate, getScoreLevel } from '../utils/format';

const alertStyles = {
  info: 'bg-sky-50 border-sky-200 text-sky-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-rose-50 border-rose-200 text-rose-700',
};

export default function TeacherDashboardPage() {
  const { auth, isLoading: authLoading } = useRequireAuth();
  const { classes, isLoading: classesLoading } = useTeacherClasses(auth.user?.id || '');
  const {
    overview,
    alerts,
    recentSessions,
    studentsNeedingAttention,
    isLoading: dashboardLoading,
  } = useTeacherDashboard(auth.user?.id || '');

  if (authLoading || classesLoading || dashboardLoading) {
    return (
      <TeacherLayout>
        <Loading size="large" text="正在加载教师工作台..." />
      </TeacherLayout>
    );
  }

  if (!overview || !auth.user) {
    return (
      <TeacherLayout>
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
          无法加载教师端数据，请重新登录。
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm">
                {auth.user.role === 'admin' ? '管理员工作台' : '教师工作台'}
              </div>
              <h1 className="text-3xl font-bold">
                {auth.user.name}，欢迎回来
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100">
                这里集中查看班级训练进展、对话记录与评分报告。当前账号可管理 {overview.totalClasses} 个班级、{overview.totalStudents} 名学生。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="text-blue-100">活跃学生</div>
                <div className="mt-2 text-2xl font-semibold">{overview.activeStudents}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="text-blue-100">对话总数</div>
                <div className="mt-2 text-2xl font-semibold">{overview.totalSessions}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="text-blue-100">待复核</div>
                <div className="mt-2 text-2xl font-semibold">{overview.pendingReviews}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="text-blue-100">周增长</div>
                <div className="mt-2 text-2xl font-semibold">+{overview.weeklyGrowth}%</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="班级数量" value={overview.totalClasses} subtitle="可查看的教学班级" icon="🏫" color="blue" />
          <StatCard title="学生总数" value={overview.totalStudents} subtitle="已录入平台学生" icon="👨‍🎓" color="green" />
          <StatCard title="平均得分" value={overview.averageScore} subtitle="所有已评分训练记录" icon="⭐" color="purple" />
          <StatCard title="系统预警" value={overview.alertsCount} subtitle="需教师优先关注" icon="🚨" color="orange" />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">我的班级</h2>
                <p className="text-sm text-slate-500">从班级视角进入学生训练数据库</p>
              </div>
              <Link href="/teacher/reports" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                查看报告中心
              </Link>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              {classes.map((cls) => (
                <Link
                  key={cls.id}
                  href={`/teacher/class/${cls.id}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                      📚
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                      在线
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-800">{cls.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{cls.grade} · {cls.major}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
                    <span className="text-slate-500">{cls.studentCount} 名学生</span>
                    <span className="font-medium text-blue-600">进入班级数据库</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-800">系统预警</h2>
              <p className="text-sm text-slate-500">需要教师或管理员快速处理的训练信号</p>
            </div>
            <div className="space-y-3 p-6">
              {alerts.map((alert) => (
                <div key={alert.id} className={`rounded-2xl border p-4 ${alertStyles[alert.level]}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{alert.title}</h3>
                    <span className="text-xs">{formatDate(alert.createdAt, true)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">近期对话记录</h2>
                <p className="text-sm text-slate-500">教师端可直接追溯具体训练情境与评分结果</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">学生</th>
                    <th className="px-6 py-4 text-left font-medium">AI服务对象</th>
                    <th className="px-6 py-4 text-left font-medium">情境主题</th>
                    <th className="px-6 py-4 text-left font-medium">评分</th>
                    <th className="px-6 py-4 text-left font-medium">风险</th>
                    <th className="px-6 py-4 text-left font-medium">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentSessions.map((session) => {
                    const scoreLevel = session.score ? getScoreLevel(session.score.overall) : null;
                    return (
                      <tr key={session.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <Link href={`/teacher/student/${session.studentId}`} className="font-medium text-slate-800 hover:text-blue-600">
                            {session.studentName}
                          </Link>
                          <div className="text-xs text-slate-500">{session.className}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{session.characterName}</td>
                        <td className="px-6 py-4 text-slate-600">{session.scenarioTitle}</td>
                        <td className="px-6 py-4">
                          {scoreLevel ? (
                            <span
                              className="rounded-full px-3 py-1 text-xs font-semibold"
                              style={{ backgroundColor: `${scoreLevel.color}15`, color: scoreLevel.color }}
                            >
                              {session.score?.overall} · {scoreLevel.label}
                            </span>
                          ) : (
                            <span className="text-slate-400">待评分</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              session.riskLevel === 'high'
                                ? 'bg-rose-100 text-rose-700'
                                : session.riskLevel === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {session.riskLevel === 'high' ? '高风险' : session.riskLevel === 'medium' ? '中风险' : '低风险'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{formatDate(session.startTime, true)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-800">重点学生</h2>
              <p className="text-sm text-slate-500">训练频次不足或需要进一步关注</p>
            </div>
            <div className="space-y-3 p-6">
              {studentsNeedingAttention.map((student) => (
                <Link
                  key={student.id}
                  href={`/teacher/student/${student.id}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-slate-50"
                >
                  <div>
                    <div className="font-medium text-slate-800">{student.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {student.className} · {student.studentNo}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-800">{student.trainingCount} 次</div>
                    <div
                      className={`mt-1 text-xs ${
                        student.status === 'warning'
                          ? 'text-amber-600'
                          : student.status === 'inactive'
                          ? 'text-slate-400'
                          : 'text-emerald-600'
                      }`}
                    >
                      {student.status === 'warning' ? '建议跟进' : student.status === 'inactive' ? '未开始' : '正常'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </TeacherLayout>
  );
}
