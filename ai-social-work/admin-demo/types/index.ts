// 后台管理系统类型定义

export type UserRole = 'admin' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  classIds?: string[];  // 教师管理的班级
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  major: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
}

export interface Student {
  id: string;
  name: string;
  studentNo: string;
  classId: string;
  className: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface AICharacter {
  id: string;
  name: string;
  type: 'elderly' | 'child' | 'disabled' | 'family' | 'community';
  description: string;
  scenario: string;
}

export interface DialogMessage {
  id: string;
  role: 'student' | 'ai' | 'system';
  content: string;
  timestamp: string;
  emotion?: string;  // AI分析的情绪标签
}

export interface Conversation {
  id: string;
  studentId: string;
  studentName: string;
  studentNo: string;
  classId: string;
  className: string;
  characterId: string;
  characterName: string;
  characterType: string;
  messages: DialogMessage[];
  startTime: string;
  endTime: string;
  duration: number;  // 分钟
  messageCount: number;
  status: 'completed' | 'in_progress' | 'abandoned';
  score?: {
    professionalSkills: number;  // 专业技巧
    ethics: number;              // 伦理遵守
    culturalSensitivity: number; // 文化敏感
    language: number;            // 语言适切
    overall: number;             // 总分
    feedback: string;
  };
  tags?: string[];  // 标签：如"优秀案例"、"需关注"等
}

export interface DashboardStats {
  totalConversations: number;
  todayConversations: number;
  totalStudents: number;
  activeStudents: number;  // 本周有训练的学生
  avgScore: number;
  totalDuration: number;   // 总训练时长（分钟）
}

export interface FilterState {
  search: string;
  classId: string;
  characterType: string;
  dateRange: string;
  status: string;
  minScore: string;
  maxScore: string;
}
