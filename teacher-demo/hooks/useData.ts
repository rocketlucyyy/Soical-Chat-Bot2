// 数据查询 Hooks
// 当前基于本地 mock 数据，后续可逐步替换为真实 API 调用。

'use client';

import { useState, useEffect } from 'react';
import type {
  Class,
  Student,
  TrainingSession,
  ClassStats,
  Score,
  DashboardOverview,
  DashboardAlert,
  ClassPerformanceSummary,
} from '../types';
import {
  mockClasses,
  mockStudents,
  mockTrainingSessions,
  calculateClassStats,
  mockDelay,
  getTeacherClasses,
  getTeacherStudents,
  getTeacherSessions,
  getDashboardOverview,
  getDashboardAlerts,
  getClassPerformanceSummaries,
} from '../mock/data';

export function useTeacherClasses(teacherId: string) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await mockDelay(400);
        setClasses(getTeacherClasses(teacherId));
      } catch (error) {
        setError('获取班级列表失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (teacherId) {
      fetchClasses();
    } else {
      setClasses([]);
      setIsLoading(false);
    }
  }, [teacherId]);

  return { classes, isLoading, error, refetch: () => {} };
}

export function useTeacherDashboard(teacherId: string) {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [recentSessions, setRecentSessions] = useState<TrainingSession[]>([]);
  const [studentsNeedingAttention, setStudentsNeedingAttention] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await mockDelay(500);

        const students = getTeacherStudents(teacherId);
        const sessions = getTeacherSessions(teacherId);

        setOverview(getDashboardOverview(teacherId));
        setAlerts(getDashboardAlerts(teacherId));
        setRecentSessions(sessions.slice(0, 8));
        setStudentsNeedingAttention(
          students
            .filter((student) => student.status !== 'active' || student.trainingCount === 0)
            .sort((a, b) => a.trainingCount - b.trainingCount)
            .slice(0, 6)
        );
      } catch (error) {
        setError('加载仪表盘失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (teacherId) {
      fetchDashboard();
    } else {
      setIsLoading(false);
    }
  }, [teacherId]);

  return { overview, alerts, recentSessions, studentsNeedingAttention, isLoading, error };
}

export function useReportsCenter(teacherId: string) {
  const [classSummaries, setClassSummaries] = useState<ClassPerformanceSummary[]>([]);
  const [recentSessions, setRecentSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await mockDelay(450);
        setClassSummaries(getClassPerformanceSummaries(teacherId));
        setRecentSessions(getTeacherSessions(teacherId).slice(0, 12));
      } catch (error) {
        setError('加载报告中心失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (teacherId) {
      fetchReports();
    } else {
      setIsLoading(false);
    }
  }, [teacherId]);

  return { classSummaries, recentSessions, isLoading, error };
}

export function useClassDetails(classId: string) {
  const [classData, setClassData] = useState<Class | null>(null);
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await mockDelay(500);

        const cls = mockClasses.find((item) => item.id === classId);
        if (!cls) {
          setError('班级不存在');
          setClassData(null);
          return;
        }

        setClassData(cls);
        setStats(calculateClassStats(classId));
        setStudents(mockStudents.filter((student) => student.classId === classId));
        setSessions(
          mockTrainingSessions
            .filter((session) => session.classId === classId)
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        );
      } catch (error) {
        setError('获取班级数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (classId) {
      fetchData();
    }
  }, [classId]);

  return { classData, stats, students, sessions, isLoading, error };
}

export function useStudentDetails(studentId: string) {
  const [student, setStudent] = useState<Student | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [averageScore, setAverageScore] = useState<Score | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await mockDelay(400);

        const studentData = mockStudents.find((item) => item.id === studentId);
        if (!studentData) {
          setError('学生不存在');
          setStudent(null);
          return;
        }

        setStudent(studentData);

        const studentSessions = mockTrainingSessions
          .filter((session) => session.studentId === studentId)
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        setSessions(studentSessions);

        const scores = studentSessions
          .map((session) => session.score)
          .filter((score): score is Score => Boolean(score));

        if (scores.length > 0) {
          setAverageScore({
            communication: Math.round(
              scores.reduce((sum, score) => sum + score.communication, 0) / scores.length
            ),
            empathy: Math.round(scores.reduce((sum, score) => sum + score.empathy, 0) / scores.length),
            problemSolving: Math.round(
              scores.reduce((sum, score) => sum + score.problemSolving, 0) / scores.length
            ),
            professionalism: Math.round(
              scores.reduce((sum, score) => sum + score.professionalism, 0) / scores.length
            ),
            overall: Math.round(scores.reduce((sum, score) => sum + score.overall, 0) / scores.length),
            feedback: scores[0]?.feedback || '',
          });
        } else {
          setAverageScore(null);
        }
      } catch (error) {
        setError('获取学生数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    }
  }, [studentId]);

  return { student, sessions, averageScore, isLoading, error };
}
