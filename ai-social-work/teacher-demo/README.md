# AI社会工作教育平台 - 教师端

这是社会工作教育AI应用的教师后台页面，使用假数据进行演示。

## 📁 文件结构

```
teacher-demo/
├── types/
│   └── index.ts          # 数据模型类型定义
├── mock/
│   └── data.ts           # 模拟数据
├── components/
│   ├── Layout.tsx        # 教师端布局
│   ├── Loading.tsx       # 加载状态组件
│   ├── ScoreCard.tsx     # 评分卡片
│   └── ScoreRadarChart.tsx  # 评分雷达图
├── hooks/
│   ├── useAuth.ts        # 认证状态管理
│   └── useData.ts        # 数据查询hooks
├── utils/
│   ├── format.ts         # 格式化工具
│   └── pdfExport.ts      # PDF导出
└── pages/
    ├── layout.tsx        # 根布局
    ├── page.tsx          # 入口页
    ├── login.tsx         # 登录页
    ├── dashboard.tsx     # 仪表盘/班级列表
    ├── class/[id].tsx    # 班级详情
    └── student/[id].tsx  # 学生详情
```

## 🚀 如何集成到A的项目

### 1. 复制文件到Next.js项目

将以下文件夹复制到A的Next.js项目的对应位置：

```bash
# 假设A的项目在 ai-social-work/
cp -r teacher-demo/types/* ai-social-work/types/
cp -r teacher-demo/components/* ai-social-work/components/teacher/
cp -r teacher-demo/hooks/* ai-social-work/hooks/
cp -r teacher-demo/utils/* ai-social-work/utils/
cp -r teacher-demo/mock/* ai-social-work/mock/
```

### 2. 复制页面文件

页面文件需要放在正确的路由位置：

```bash
# 创建教师端路由文件夹
mkdir -p ai-social-work/app/teacher/login
mkdir -p ai-social-work/app/teacher/dashboard
mkdir -p ai-social-work/app/teacher/class/\[id\]
mkdir -p ai-social-work/app/teacher/student/\[id\]

# 复制页面文件
cp teacher-demo/pages/login.tsx ai-social-work/app/teacher/login/page.tsx
cp teacher-demo/pages/dashboard.tsx ai-social-work/app/teacher/dashboard/page.tsx
cp teacher-demo/pages/class/\[id\].tsx ai-social-work/app/teacher/class/\[id\]/page.tsx
cp teacher-demo/pages/student/\[id\].tsx ai-social-work/app/teacher/student/\[id\]/page.tsx
```

### 3. 更新导入路径

检查并更新以下文件中的导入路径：

- 将所有 `from '../hooks/...'` 改为 `from '@/hooks/...`
- 将所有 `from '../components/...'` 改为 `from '@/components/...`
- 将所有 `from '../types'` 改为 `from '@/types`
- 将所有 `from '../utils/...'` 改为 `from '@/utils/...`
- 将所有 `from '../mock/...'` 改为 `from '@/mock/...`

### 4. 配置Tailwind CSS

确保项目已配置Tailwind CSS。如果A使用CSS Modules，需要迁移样式。

### 5. 等A完成数据库后的对接

| 当前(假数据) | 对接后(真实数据) |
|------------|----------------|
| `mock/data.ts` | 替换为Supabase查询 |
| `useAuth.ts` | 接入真实登录API |
| `useData.ts` | 接入真实数据API |
| `pdfExport.ts` | 接入jspdf/html2pdf |

## 🔑 测试账号

- 邮箱：`wang@university.edu.cn`
- 密码：`123456`

## 📊 功能清单

- [x] 教师登录/登出
- [x] 班级列表查看
- [x] 班级详情（统计、学生列表）
- [x] 学生详情（训练记录、评分）
- [x] 个人报告导出（PDF）
- [x] 班级报告导出（PDF）
- [ ] 真实PDF生成（接入jspdf）
- [ ] 对话详情查看

## 📝 与B的协作

B做的学生端完成后，C需要：
1. 确认B生成的训练记录数据结构
2. 更新 `types/index.ts` 中的类型定义
3. 确保mock数据和真实数据结构一致

## 🔧 下一步工作

1. 等A完成：将假数据替换为Supabase查询
2. 等B完成：确认数据结构，对接真实训练记录
3. 最后阶段：完善PDF导出功能
