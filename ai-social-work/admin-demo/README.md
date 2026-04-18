# AI社会工作训练平台 - 后台管理系统

一个支持管理员和教师双角色登录的后台管理系统，用于查看、管理和分析AI虚拟服务对象训练产生的对话数据。

## ✨ 功能特性

### 双角色权限系统
| 角色 | 权限 |
|------|------|
| **管理员** | 查看所有班级数据、管理用户、系统设置 |
| **教师** | 查看自己班级的数据、学生管理、生成报告 |

### 核心功能
- 📊 **仪表盘** - 数据统计概览（对话数、学生数、平均评分、训练时长）
- 💬 **对话管理** - 查看所有储存的对话记录，支持多维度筛选
- 👨‍🎓 **学生管理** - 学生信息查看和管理
- 📚 **班级管理** - 班级数据查看（管理员可见全部）
- 👥 **用户管理** - 管理教师和和管理员账号（仅管理员）
- 🔍 **高级筛选** - 支持按班级、服务类型、时间范围、评分等条件筛选

## 📁 文件结构

```
admin-demo/
├── types/
│   └── index.ts              # 数据类型定义
├── mock/
│   └── data.ts               # 模拟数据（含8名学生、50+对话记录）
├── hooks/
│   ├── useAuth.ts            # 认证状态管理
│   └── useData.ts            # 数据查询hooks
├── components/
│   └── Layout.tsx            # 后台布局组件
├── utils/
│   └── format.ts             # 格式化工具函数
└── pages/
    ├── layout.tsx            # 根布局
    ├── login.tsx             # 登录页面（双角色选择）
    ├── dashboard.tsx         # 仪表盘
    ├── conversations.tsx     # 对话列表（含筛选）
    ├── conversations/[id].tsx # 对话详情（查看完整对话）
    ├── students.tsx          # 学生管理
    └── users.tsx             # 用户管理（仅管理员）
```

## 🔑 测试账号

### 管理员
- 邮箱：`admin@university.edu.cn`
- 密码：`123456`
- 权限：查看所有数据、用户管理

### 教师
- 邮箱：`wang@university.edu.cn`
- 密码：`123456`
- 权限：查看自己班级（1班、2班）的数据
- 邮箱：`li@university.edu.cn`
- 密码：`123456`
- 权限：查看自己班级（2022级1班）的数据

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问系统
打开 `http://localhost:3000/admin/login`

## 📊 数据结构

### 对话记录 Conversation
```typescript
{
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  characterName: string;      // AI角色名称
  characterType: string;      // 服务类型（elderly/child/disabled/family/community）
  messages: DialogMessage[];  // 完整对话内容
  startTime: string;
  endTime: string;
  duration: number;           // 训练时长（分钟）
  score?: {
    professionalSkills: number;  // 专业技巧 (0-5)
    ethics: number;              // 伦理遵守 (0-5)
    culturalSensitivity: number; // 文化敏感 (0-5)
    language: number;            // 语言适切 (0-5)
    overall: number;             // 综合得分
    feedback: string;            // AI评语
  }
}
```

## 🔧 与真实后端对接

当前使用模拟数据，对接真实后端时需要修改以下文件：

1. **hooks/useAuth.ts** - 替换登录API调用
2. **hooks/useData.ts** - 替换数据获取为真实API
3. **mock/data.ts** - 可删除或保留用于离线演示

## 📝 评分维度说明

系统采用社会工作个案会谈的四维评分标准：

1. **专业技巧使用 (0-5分)**
   - 支持性技巧：专注、倾听、同理心、鼓励
   - 引导性技巧：澄清、对焦、摘要
   - 影响性技巧：提供信息、自我披露、建议、忠告、对质

2. **专业伦理遵守 (0-5分)**
   - 尊重自决权
   - 知情同意
   - 保密原则
   - 避免伤害

3. **文化敏感性 (0-5分)**
   - 尊重文化多样性
   - 避免文化偏见
   - 语言适应

4. **语言适切性 (0-5分)**
   - 通俗易懂
   - 简明扼要
   - 温和尊重

**总分 = 四个维度得分的平均分**

## 🎨 UI设计特点

- 响应式设计，支持桌面和移动设备
- 渐变色卡片和统计数字动画
- 对话气泡式展示，支持情绪标签显示
- 侧边栏导航，根据角色动态显示菜单

## 📄 使用说明

1. **登录** - 选择角色（管理员/教师），输入账号密码
2. **查看仪表盘** - 了解整体数据统计
3. **浏览对话** - 进入"对话管理"，使用筛选器查找特定记录
4. **查看详情** - 点击"查看详情"查看完整对话和AI评分分析
5. **管理学生** - 查看学生列表，快速访问其对话记录

## ⚠️ 注意事项

- 当前为演示版本，使用本地存储保存登录状态
- 刷新页面会保持登录状态（基于localStorage）
- 对接真实后端后，需要替换认证机制为JWT或Session
