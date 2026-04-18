// 教师登录页面

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';

export default function TeacherLoginPage() {
  const [email, setEmail] = useState('wang@university.edu.cn');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const accountPresets = [
    {
      label: '教师账号',
      email: 'wang@university.edu.cn',
      password: '123456',
      description: '查看自己负责班级、学生对话和评分报告',
    },
    {
      label: '第二教师账号',
      email: 'liu@university.edu.cn',
      password: '123456',
      description: '演示不同教师只能访问自己班级数据',
    },
    {
      label: '管理员账号',
      email: 'admin@university.edu.cn',
      password: 'admin123',
      description: '查看全平台班级数据与系统预警',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/teacher/dashboard');
    } else {
      setError('邮箱或密码错误，请使用下方演示账号登录');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#f7fafc_100%)] flex items-center justify-center p-4">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] bg-slate-900 p-8 text-white shadow-2xl">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm">
            教师端 / 管理端
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight">
            AI社会工作教育平台数据库后台
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">
            管理员或教师登录后，可按班级查看学生训练记录、对话详情、多维评分和导出报告。当前页面是可在线演示的后台入口，后续可直接接入真实数据库与权限系统。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-semibold">对话记录库</div>
              <p className="mt-2 text-sm text-slate-200">按班级、学生、AI服务对象追溯训练过程</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-semibold">多维评分</div>
              <p className="mt-2 text-sm text-slate-200">沟通、同理心、问题解决、专业素养一体查看</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-semibold">班级报告</div>
              <p className="mt-2 text-sm text-slate-200">自动汇总训练人数、训练次数、总体表现</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-semibold">权限管理</div>
              <p className="mt-2 text-sm text-slate-200">教师仅看自己班级，管理员查看全平台数据</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg">
              👨‍🏫
            </div>
            <h2 className="text-2xl font-bold text-gray-800">登录后台</h2>
            <p className="mt-2 text-gray-500">输入教师或管理员账号进入数据库平台</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="请输入教师邮箱"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="请输入密码"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 font-medium text-white transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loading size="small" text="" />
                  <span className="ml-2">登录中...</span>
                </>
              ) : (
                '进入后台'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="mb-3 text-sm font-medium text-gray-700">演示账号</div>
            <div className="space-y-3">
              {accountPresets.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                    setError('');
                  }}
                  className="w-full rounded-2xl border border-gray-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{account.label}</span>
                    <span className="text-xs text-blue-600">点击填充</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">{account.description}</div>
                  <div className="mt-2 text-xs text-gray-400">
                    {account.email} / {account.password}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
