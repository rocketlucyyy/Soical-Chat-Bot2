// 数据模型类型定义
// 当前为教师端/管理端演示模型，后续可平滑替换为真实数据库实体

export type UserRole = 'teacher' | 'admin';
export type CharacterType = 'elderly' | 'child' | 'disabled' | 'family' | 'community';
export type SessionRiskLevel = 'low' | 'medium' | 'high';

// 教师 / 管理员账号
export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
  department: string;
  role: UserRole;
  classIds: string[];
  permissions: string[];
  createdAt: string;
  lastLoginAt?: string;
}

// 班级
export interface Class {
  id: string;
  name: string;
  grade: string;
  major: string;
  teacherId: string;
  studentCount: number;
  createdAt: string;
}

// 学生
export interface Student {
  id: string;
  name: string;
  studentNo: string;
  classId: string;
  className: string;
  grade: string;
  major: string;
  status: 'active' | 'warning' | 'inactive';
  avatar?: string;
  trainingCount: number;
  lastTrainingAt?: string;
}

// AI服务对象类型
export interface AICharacter {
  id: string;
  name: string;
  type: CharacterType;
  description: string;
  avatar: string;
}

export interface DialogMessage {
  id: string;
  role: 'system' | 'ai' | 'student';
  content: string;
  time: string;
}

// 训练会话
export interface TrainingSession {
  id: string;
  studentId: string;
  studentName: string;
  studentNo: string;
  classId: string;
  className: string;
  characterId: string;
  characterName: string;
  characterType: CharacterType;
  scenarioTitle: string;
  summary: string;
  startTime: string;
  endTime: string;
  duration: number; // 分钟
  messageCount: number;
  status: 'completed' | 'in_progress' | 'abandoned';
  evaluationStatus: 'evaluated' | 'pending';
  riskLevel: SessionRiskLevel;
  messages: DialogMessage[];
  score?: Score;
}

// 评分维度
export interface Score {
  communication: number;      // 沟通能力 (0-100)
  empathy: number;            // 同理心 (0-100)
  problemSolving: number;     // 问题解决 (0-100)
  professionalism: number;    // 专业素养 (0-100)
  overall: number;            // 综合得分 (0-100)
  feedback: string;           // AI评语
}

// 班级统计
export interface ClassStats {
  classId: string;
  totalStudents: number;
  trainedStudents: number;
  trainingRate: number;
  totalSessions: number;
  avgScore: number;
  avgCommunication: number;
  avgEmpathy: number;
  avgProblemSolving: number;
  avgProfessionalism: number;
  scoreDistribution: {
    excellent: number; // 90-100
    good: number;      // 80-89
    average: number;   // 60-79
    poor: number;      // <60
  };
}

export interface DashboardOverview {
  totalClasses: number;
  totalStudents: number;
  activeStudents: number;
  totalSessions: number;
  averageScore: number;
  alertsCount: number;
  pendingReviews: number;
  weeklyGrowth: number;
}

export interface DashboardAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  relatedStudentId?: string;
  relatedClassId?: string;
  createdAt: string;
}

export interface ClassPerformanceSummary {
  classData: Class;
  stats: ClassStats;
  latestTrainingAt?: string;
}

// 用户认证
export interface AuthState {
  isAuthenticated: boolean;
  user: Teacher | null;
  token: string | null;
}

// 报告导出选项
export interface ExportOptions {
  format: 'pdf';
  includeCharts: boolean;
  includeDetails: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}
