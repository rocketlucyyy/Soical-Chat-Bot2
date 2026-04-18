// 后台数据查询 Hooks

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Conversation, DashboardStats, Class, Student, FilterState } from '../types';
import { mockConversations, mockClasses, mockStudents, getDashboardStats, mockDelay } from '../mock/data';
import { useAuth } from './useAuth';

// 获取仪表盘统计数据
export function useDashboardStats() {
  const { user, isAdmin, isTeacher } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setIsLoading(true);
      await mockDelay(500);
      const data = getDashboardStats(user.role, user.id);
      setStats(data);
      setIsLoading(false);
    };
    fetchStats();
  }, [user]);

  return { stats, isLoading };
}

// 获取对话列表
export function useConversations(filters?: FilterState) {
  const { user, isAdmin, isTeacher } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      setIsLoading(true);
      await mockDelay(600);

      let data = [...mockConversations];

      // 权限过滤
      if (isTeacher && user.classIds) {
        data = data.filter(c => user.classIds?.includes(c.classId));
      }

      // 应用筛选
      if (filters) {
        if (filters.search) {
          const search = filters.search.toLowerCase();
          data = data.filter(c =>
            c.studentName.toLowerCase().includes(search) ||
            c.studentNo.includes(search) ||
            c.characterName.toLowerCase().includes(search)
          );
        }

        if (filters.classId && filters.classId !== 'all') {
          data = data.filter(c => c.classId === filters.classId);
        }

        if (filters.characterType && filters.characterType !== 'all') {
          data = data.filter(c => c.characterType === filters.characterType);
        }

        if (filters.status && filters.status !== 'all') {
          data = data.filter(c => c.status === filters.status);
        }

        if (filters.dateRange && filters.dateRange !== 'all') {
          const now = new Date();
          data = data.filter(c => {
            const convDate = new Date(c.startTime);
            switch (filters.dateRange) {
              case 'today':
                return convDate.toDateString() === now.toDateString();
              case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return convDate >= weekAgo;
              case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return convDate >= monthAgo;
              default:
                return true;
            }
          });
        }

        if (filters.minScore) {
          data = data.filter(c => c.score && c.score.overall >= parseFloat(filters.minScore));
        }

        if (filters.maxScore) {
          data = data.filter(c => c.score && c.score.overall <= parseFloat(filters.maxScore));
        }
      }

      // 按时间倒序
      data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

      setTotal(data.length);
      setConversations(data);
      setIsLoading(false);
    };

    fetchConversations();
  }, [user, isAdmin, isTeacher, filters]);

  return { conversations, total, isLoading };
}

// 获取单个对话详情
export function useConversationDetail(conversationId: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!user || !conversationId) return;
      setIsLoading(true);
      await mockDelay(400);

      const found = mockConversations.find(c => c.id === conversationId);

      // 权限检查
      if (found && user.role === 'teacher' && user.classIds) {
        if (!user.classIds.includes(found.classId)) {
          setConversation(null);
          setIsLoading(false);
          return;
        }
      }

      setConversation(found || null);
      setIsLoading(false);
    };

    fetchDetail();
  }, [conversationId, user]);

  return { conversation, isLoading };
}

// 获取班级列表
export function useClasses() {
  const { user, isAdmin, isTeacher } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return;
      setIsLoading(true);
      await mockDelay(400);

      let data = [...mockClasses];

      if (isTeacher && user.classIds) {
        data = data.filter(c => user.classIds?.includes(c.id));
      }

      setClasses(data);
      setIsLoading(false);
    };

    fetchClasses();
  }, [user, isAdmin, isTeacher]);

  return { classes, isLoading };
}

// 获取学生列表
export function useStudents(classId?: string) {
  const { user, isAdmin, isTeacher } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;
      setIsLoading(true);
      await mockDelay(400);

      let data = [...mockStudents];

      if (isTeacher && user.classIds) {
        data = data.filter(s => user.classIds?.includes(s.classId));
      }

      if (classId && classId !== 'all') {
        data = data.filter(s => s.classId === classId);
      }

      setStudents(data);
      setIsLoading(false);
    };

    fetchStudents();
  }, [user, isAdmin, isTeacher, classId]);

  return { students, isLoading };
}
