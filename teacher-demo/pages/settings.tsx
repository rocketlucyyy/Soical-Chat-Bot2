// 系统设置页

'use client';

import { useRequireAuth } from '../hooks/useAuth';
import { TeacherLayout } from '../components/Layout';
import { Loading } from '../components/Loading';

export default function SettingsPage() {
  const { auth, isLoading } = useRequireAuth();

  if (isLoading || !auth.user) {
    return (
      <TeacherLayout>
        <Loading size="large" text="正在加载系统设置..." />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold">系统设置</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">
            当前页面用于展示教师端/管理端账号信息、权限范围和后续接入真实数据库时的配置入口。
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">当前账号</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">姓名</div>
                <div className="mt-1 font-medium text-slate-800">{auth.user.name}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">邮箱</div>
                <div className="mt-1 font-medium text-slate-800">{auth.user.email}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">身份</div>
                <div className="mt-1 font-medium text-slate-800">
                  {auth.user.role === 'admin' ? '平台管理员' : '任课教师'}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">管理范围</div>
                <div className="mt-1 font-medium text-slate-800">{auth.user.classIds.length} 个班级</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">权限与数据配置</h2>
            <div className="mt-5 space-y-3">
              {auth.user.permissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
                >
                  <span className="font-mono text-sm text-slate-700">{permission}</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    已启用
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">后续接入建议</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="text-sm font-semibold text-blue-800">数据库表</div>
              <p className="mt-2 text-sm leading-6 text-blue-700">
                建议拆分为 `users`、`classes`、`students`、`sessions`、`messages`、`reports` 六张核心表。
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-5">
              <div className="text-sm font-semibold text-amber-800">权限模型</div>
              <p className="mt-2 text-sm leading-6 text-amber-700">
                使用角色字段加班级归属控制，确保教师仅能访问自己的班级数据，管理员查看全局。
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5">
              <div className="text-sm font-semibold text-emerald-800">报告生成</div>
              <p className="mt-2 text-sm leading-6 text-emerald-700">
                现阶段由浏览器打印导出，正式版建议接入服务端 PDF 任务队列，支持批量生成。
              </p>
            </div>
          </div>
        </section>
      </div>
    </TeacherLayout>
  );
}
