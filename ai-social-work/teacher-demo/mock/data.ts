// 演示数据层
// 当前使用本地 mock 数据模拟数据库平台，后续可替换为真实 API / Supabase 查询。

import type {
  Teacher,
  Class,
  Student,
  TrainingSession,
  Score,
  ClassStats,
  AICharacter,
  DashboardAlert,
  DashboardOverview,
  ClassPerformanceSummary,
  DialogMessage,
  CharacterType,
  SessionRiskLevel,
} from '../types';

interface LoginAccount {
  email: string;
  password: string;
  userId: string;
}

const scoreTemplates: Score[] = [
  {
    communication: 92,
    empathy: 95,
    problemSolving: 90,
    professionalism: 93,
    overall: 93,
    feedback: '能够迅速建立信任关系，回应具体需求时兼顾了情绪支持与资源链接。',
  },
  {
    communication: 88,
    empathy: 84,
    problemSolving: 85,
    professionalism: 87,
    overall: 86,
    feedback: '整体表现稳健，问题识别准确，建议在追问细节时继续强化开放式提问。',
  },
  {
    communication: 79,
    empathy: 82,
    problemSolving: 76,
    professionalism: 80,
    overall: 79,
    feedback: '基本完成服务流程，但在需求澄清和资源整合方面仍有提升空间。',
  },
  {
    communication: 73,
    empathy: 75,
    problemSolving: 71,
    professionalism: 77,
    overall: 74,
    feedback: '能保持礼貌沟通，但需要更主动地回应服务对象核心困境。',
  },
];

function buildMessages(
  studentName: string,
  characterName: string,
  scenarioTitle: string,
  riskLevel: SessionRiskLevel,
  startHour: string
): DialogMessage[] {
  const riskPrompt =
    riskLevel === 'high'
      ? '系统提示：本次情境包含明显危机信号，请特别关注情绪稳定与转介判断。'
      : riskLevel === 'medium'
      ? '系统提示：请在情绪支持之外同步识别资源需求。'
      : '系统提示：本次训练重点是建立信任与澄清需求。';

  return [
    {
      id: `${studentName}-${characterName}-system-start`,
      role: 'system',
      content: `开始模拟情境：${scenarioTitle}`,
      time: startHour,
    },
    {
      id: `${studentName}-${characterName}-system-risk`,
      role: 'system',
      content: riskPrompt,
      time: startHour,
    },
    {
      id: `${studentName}-${characterName}-ai-1`,
      role: 'ai',
      content: `${studentName ? '老师让我和你聊聊' : ''}${characterName}看起来有些迟疑：“你是来做什么的？”`,
      time: '10:01',
    },
    {
      id: `${studentName}-${characterName}-student-1`,
      role: 'student',
      content: `您好，我是社会工作专业的实训学生${studentName}。我今天主要想了解您的近况，也看看有没有我能协助的地方。`,
      time: '10:02',
    },
    {
      id: `${studentName}-${characterName}-ai-2`,
      role: 'ai',
      content: `${characterName}叹了口气：“最近事情有点多，我也不知道从哪说起。”`,
      time: '10:04',
    },
    {
      id: `${studentName}-${characterName}-student-2`,
      role: 'student',
      content: '没关系，我们可以慢慢来。现在最让您困扰的是哪一件事？我先从最紧急的部分陪您一起梳理。',
      time: '10:05',
    },
    {
      id: `${studentName}-${characterName}-ai-3`,
      role: 'ai',
      content:
        riskLevel === 'high'
          ? '“我这几天情绪特别差，晚上一直睡不着，有时候会觉得撑不下去。”'
          : riskLevel === 'medium'
          ? '“家里事情压在一起，我有点扛不住，也没人能帮忙。”'
          : '“其实就是最近身体不太舒服，很多事情做起来不方便。”',
      time: '10:07',
    },
    {
      id: `${studentName}-${characterName}-student-3`,
      role: 'student',
      content:
        riskLevel === 'high'
          ? '谢谢您愿意告诉我这些。您现在的感受很重要，我会先陪着您，也想确认一下，身边有没有可以马上联系的人，或者我们一起联系老师和专业支持？'
          : '我听到您现在既累又有压力。我们先把最需要支持的事情列出来，再看看可以联系哪些社区资源或家人一起处理。',
      time: '10:08',
    },
    {
      id: `${studentName}-${characterName}-system-end`,
      role: 'system',
      content: '训练结束，系统已生成结构化评分。',
      time: '10:15',
    },
  ];
}

function getCharacterAvatar(seed: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

export const mockTeachers: Teacher[] = [
  {
    id: 't001',
    name: '王教授',
    email: 'wang@university.edu.cn',
    avatar: getCharacterAvatar('wang-teacher'),
    title: '社会工作系副教授',
    department: '社会发展学院',
    role: 'teacher',
    classIds: ['c001', 'c002'],
    permissions: ['class:read', 'student:read', 'report:export', 'conversation:read'],
    createdAt: '2024-01-15',
    lastLoginAt: '2026-04-18T09:00:00+08:00',
  },
  {
    id: 't002',
    name: '刘老师',
    email: 'liu@university.edu.cn',
    avatar: getCharacterAvatar('liu-teacher'),
    title: '社会工作系讲师',
    department: '社会发展学院',
    role: 'teacher',
    classIds: ['c003'],
    permissions: ['class:read', 'student:read', 'report:export', 'conversation:read'],
    createdAt: '2024-02-03',
    lastLoginAt: '2026-04-17T18:20:00+08:00',
  },
  {
    id: 'a001',
    name: '陈管理员',
    email: 'admin@university.edu.cn',
    avatar: getCharacterAvatar('admin-chen'),
    title: '平台管理员',
    department: '教育技术中心',
    role: 'admin',
    classIds: ['c001', 'c002', 'c003'],
    permissions: [
      'class:read',
      'student:read',
      'report:export',
      'conversation:read',
      'teacher:read',
      'system:manage',
    ],
    createdAt: '2024-01-01',
    lastLoginAt: '2026-04-18T08:30:00+08:00',
  },
];

export const mockLoginAccounts: LoginAccount[] = [
  { email: 'wang@university.edu.cn', password: '123456', userId: 't001' },
  { email: 'liu@university.edu.cn', password: '123456', userId: 't002' },
  { email: 'admin@university.edu.cn', password: 'admin123', userId: 'a001' },
];

export const mockClasses: Class[] = [
  {
    id: 'c001',
    name: '社会工作2023级1班',
    grade: '2023级',
    major: '社会工作',
    teacherId: 't001',
    studentCount: 8,
    createdAt: '2024-02-01',
  },
  {
    id: 'c002',
    name: '社会工作2023级2班',
    grade: '2023级',
    major: '社会工作',
    teacherId: 't001',
    studentCount: 7,
    createdAt: '2024-02-01',
  },
  {
    id: 'c003',
    name: '社区治理2024级实验班',
    grade: '2024级',
    major: '社区治理',
    teacherId: 't002',
    studentCount: 6,
    createdAt: '2024-09-03',
  },
];

export const mockStudents: Student[] = [
  { id: 's001', name: '张明', studentNo: '2023010101', classId: 'c001', className: '社会工作2023级1班', grade: '2023级', major: '社会工作', status: 'active', trainingCount: 4, lastTrainingAt: '2026-04-17T10:30:00+08:00' },
  { id: 's002', name: '李华', studentNo: '2023010102', classId: 'c001', className: '社会工作2023级1班', grade: '2023级', major: '社会工作', status: 'warning', trainingCount: 2, lastTrainingAt: '2026-04-15T14:20:00+08:00' },
  { id: 's003', name: '王芳', studentNo: '2023010103', classId: 'c001', className: '社会工作2023级1班', grade: '2023级', major: '社会工作', status: 'active', trainingCount: 5, lastTrainingAt: '2026-04-18T09:00:00+08:00' },
  { id: 's004', name: '刘洋', studentNo: '2023010104', classId: 'c001', className: '社会工作2023级1班', grade: '2023级', major: '社会工作', status: 'inactive', trainingCount: 0 },
  { id: 's005', name: '陈静', studentNo: '2023010105', classId: 'c001', className: '社会工作2023级1班', grade: '2023级', major: '社会工作', status: 'active', trainingCount: 3, lastTrainingAt: '2026-04-16T11:30:00+08:00' },
  { id: 's006', name: '杨强', studentNo: '2023010106', classId: 'c001', className: '社会工作2023级1班', grade: '2023级', major: '社会工作', status: 'warning', trainingCount: 1, lastTrainingAt: '2026-04-11T09:00:00+08:00' },
  { id: 's007', name: '赵丽', studentNo: '2023010107', classId: 'c001', className: '社会工作2023级1班', grade: '2023级', major: '社会工作', status: 'active', trainingCount: 3, lastTrainingAt: '2026-04-14T13:00:00+08:00' },
  { id: 's008', name: '黄伟', studentNo: '2023010108', classId: 'c001', className: '社会工作2023级1班', grade: '2023级', major: '社会工作', status: 'active', trainingCount: 4, lastTrainingAt: '2026-04-17T15:20:00+08:00' },
  { id: 's009', name: '周婷', studentNo: '2023010201', classId: 'c002', className: '社会工作2023级2班', grade: '2023级', major: '社会工作', status: 'active', trainingCount: 5, lastTrainingAt: '2026-04-18T10:00:00+08:00' },
  { id: 's010', name: '吴磊', studentNo: '2023010202', classId: 'c002', className: '社会工作2023级2班', grade: '2023级', major: '社会工作', status: 'active', trainingCount: 3, lastTrainingAt: '2026-04-12T09:30:00+08:00' },
  { id: 's011', name: '徐丽', studentNo: '2023010203', classId: 'c002', className: '社会工作2023级2班', grade: '2023级', major: '社会工作', status: 'warning', trainingCount: 2, lastTrainingAt: '2026-04-13T08:30:00+08:00' },
  { id: 's012', name: '孙杰', studentNo: '2023010204', classId: 'c002', className: '社会工作2023级2班', grade: '2023级', major: '社会工作', status: 'active', trainingCount: 4, lastTrainingAt: '2026-04-17T14:00:00+08:00' },
  { id: 's013', name: '马超', studentNo: '2023010205', classId: 'c002', className: '社会工作2023级2班', grade: '2023级', major: '社会工作', status: 'inactive', trainingCount: 0 },
  { id: 's014', name: '朱婷', studentNo: '2023010206', classId: 'c002', className: '社会工作2023级2班', grade: '2023级', major: '社会工作', status: 'active', trainingCount: 4, lastTrainingAt: '2026-04-16T11:00:00+08:00' },
  { id: 's015', name: '胡军', studentNo: '2023010207', classId: 'c002', className: '社会工作2023级2班', grade: '2023级', major: '社会工作', status: 'warning', trainingCount: 1, lastTrainingAt: '2026-04-15T16:00:00+08:00' },
  { id: 's016', name: '林雪', studentNo: '2024010301', classId: 'c003', className: '社区治理2024级实验班', grade: '2024级', major: '社区治理', status: 'active', trainingCount: 3, lastTrainingAt: '2026-04-17T09:20:00+08:00' },
  { id: 's017', name: '何涛', studentNo: '2024010302', classId: 'c003', className: '社区治理2024级实验班', grade: '2024级', major: '社区治理', status: 'active', trainingCount: 2, lastTrainingAt: '2026-04-16T13:10:00+08:00' },
  { id: 's018', name: '宋雨', studentNo: '2024010303', classId: 'c003', className: '社区治理2024级实验班', grade: '2024级', major: '社区治理', status: 'warning', trainingCount: 1, lastTrainingAt: '2026-04-12T15:40:00+08:00' },
  { id: 's019', name: '许晨', studentNo: '2024010304', classId: 'c003', className: '社区治理2024级实验班', grade: '2024级', major: '社区治理', status: 'inactive', trainingCount: 0 },
  { id: 's020', name: '沈宁', studentNo: '2024010305', classId: 'c003', className: '社区治理2024级实验班', grade: '2024级', major: '社区治理', status: 'active', trainingCount: 2, lastTrainingAt: '2026-04-18T11:10:00+08:00' },
  { id: 's021', name: '程浩', studentNo: '2024010306', classId: 'c003', className: '社区治理2024级实验班', grade: '2024级', major: '社区治理', status: 'active', trainingCount: 3, lastTrainingAt: '2026-04-18T08:55:00+08:00' },
];

export const mockAICharacters: AICharacter[] = [
  { id: 'char001', name: '李大爷', type: 'elderly', description: '独居老人，慢性病反复，排斥外界介入。', avatar: getCharacterAvatar('elder1') },
  { id: 'char002', name: '小明', type: 'child', description: '留守儿童，学习动力下降，渴望稳定陪伴。', avatar: getCharacterAvatar('child1') },
  { id: 'char003', name: '王阿姨', type: 'disabled', description: '残障人士，照护资源不足，情绪波动较大。', avatar: getCharacterAvatar('disabled1') },
  { id: 'char004', name: '张先生', type: 'family', description: '家庭关系紧张，伴侣沟通冲突频繁。', avatar: getCharacterAvatar('family1') },
  { id: 'char005', name: '社区张主任', type: 'community', description: '社区协调者，需要整合多方资源处理复杂个案。', avatar: getCharacterAvatar('community1') },
];

const scenarioTemplates: Record<CharacterType, string[]> = {
  elderly: ['独居老人健康支持', '上门探访与医疗转介', '社区照护资源链接'],
  child: ['留守儿童情绪关怀', '青少年学习挫败支持', '校园适应沟通训练'],
  disabled: ['残障人士生活支持', '康复资源协调', '情绪危机初步干预'],
  family: ['家庭矛盾调解', '亲子冲突沟通', '照护者压力识别'],
  community: ['社区资源协调会议', '多方联动个案管理', '邻里纠纷协商'],
};

function getRiskLevel(index: number): SessionRiskLevel {
  if (index % 7 === 0) return 'high';
  if (index % 3 === 0) return 'medium';
  return 'low';
}

function createTrainingSession(student: Student, index: number): TrainingSession {
  const character = mockAICharacters[(index + student.name.length) % mockAICharacters.length];
  const score = scoreTemplates[(index + student.id.length) % scoreTemplates.length];
  const dayOffset = (index % 5) + 1;
  const hourOffset = (index % 4) * 2;
  const startDate = new Date(`2026-04-${String(19 - dayOffset).padStart(2, '0')}T${String(9 + hourOffset).padStart(2, '0')}:00:00+08:00`);
  const duration = 14 + (index % 5) * 4;
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
  const riskLevel = getRiskLevel(index + Number(student.id.slice(1)));
  const scenarioList = scenarioTemplates[character.type];
  const scenarioTitle = scenarioList[index % scenarioList.length];
  const messages = buildMessages(student.name, character.name, scenarioTitle, riskLevel, '10:00');

  return {
    id: `session-${student.id}-${index + 1}`,
    studentId: student.id,
    studentName: student.name,
    studentNo: student.studentNo,
    classId: student.classId,
    className: student.className,
    characterId: character.id,
    characterName: character.name,
    characterType: character.type,
    scenarioTitle,
    summary: `${student.name}围绕“${scenarioTitle}”完成了一次${riskLevel === 'high' ? '高风险' : '常规'}训练。`,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    duration,
    messageCount: messages.length - 2,
    status: 'completed',
    evaluationStatus: 'evaluated',
    riskLevel,
    messages,
    score,
  };
}

export const mockTrainingSessions: TrainingSession[] = mockStudents.flatMap((student) =>
  Array.from({ length: student.trainingCount }, (_, index) => createTrainingSession(student, index))
).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

export const mockDashboardAlerts: DashboardAlert[] = [
  {
    id: 'alert-001',
    level: 'critical',
    title: '高风险对话待复核',
    description: '李华在“残障人士生活支持”训练中出现明显危机线索，建议教师优先复盘。',
    relatedStudentId: 's002',
    relatedClassId: 'c001',
    createdAt: '2026-04-18T09:20:00+08:00',
  },
  {
    id: 'alert-002',
    level: 'warning',
    title: '班级参与率偏低',
    description: '社会工作2023级2班仍有 2 名学生未开始训练，建议发布提醒。',
    relatedClassId: 'c002',
    createdAt: '2026-04-18T08:45:00+08:00',
  },
  {
    id: 'alert-003',
    level: 'info',
    title: '本周训练量上升',
    description: '王教授所带班级近 7 天训练次数较上周提升 18%，整体活跃度稳定增长。',
    relatedClassId: 'c001',
    createdAt: '2026-04-18T08:10:00+08:00',
  },
];

export function getUserByEmail(email: string): Teacher | null {
  const account = mockLoginAccounts.find((item) => item.email === email);
  if (!account) return null;
  return mockTeachers.find((teacher) => teacher.id === account.userId) || null;
}

export function authenticateUser(email: string, password: string): Teacher | null {
  const account = mockLoginAccounts.find(
    (item) => item.email === email.trim().toLowerCase() && item.password === password
  );
  if (!account) return null;
  return mockTeachers.find((teacher) => teacher.id === account.userId) || null;
}

export function getTeacherClasses(userId: string): Class[] {
  const user = mockTeachers.find((teacher) => teacher.id === userId);
  if (!user) return [];
  if (user.role === 'admin') return mockClasses;
  return mockClasses.filter((item) => item.teacherId === userId);
}

export function getTeacherStudents(userId: string): Student[] {
  const classes = getTeacherClasses(userId).map((item) => item.id);
  return mockStudents.filter((student) => classes.includes(student.classId));
}

export function getTeacherSessions(userId: string): TrainingSession[] {
  const students = getTeacherStudents(userId).map((item) => item.id);
  return mockTrainingSessions.filter((session) => students.includes(session.studentId));
}

export function calculateClassStats(classId: string): ClassStats {
  const students = mockStudents.filter((student) => student.classId === classId);
  const totalStudents = students.length;
  const trainedStudents = students.filter((student) => student.trainingCount > 0).length;
  const sessions = mockTrainingSessions.filter((session) => session.classId === classId);
  const scores = sessions
    .map((session) => session.score)
    .filter((score): score is Score => Boolean(score));

  const average = (selector: (score: Score) => number) =>
    scores.length === 0
      ? 0
      : Math.round(scores.reduce((sum, score) => sum + selector(score), 0) / scores.length);

  return {
    classId,
    totalStudents,
    trainedStudents,
    trainingRate: totalStudents === 0 ? 0 : Math.round((trainedStudents / totalStudents) * 100),
    totalSessions: sessions.length,
    avgScore: average((score) => score.overall),
    avgCommunication: average((score) => score.communication),
    avgEmpathy: average((score) => score.empathy),
    avgProblemSolving: average((score) => score.problemSolving),
    avgProfessionalism: average((score) => score.professionalism),
    scoreDistribution: {
      excellent: scores.filter((score) => score.overall >= 90).length,
      good: scores.filter((score) => score.overall >= 80 && score.overall < 90).length,
      average: scores.filter((score) => score.overall >= 60 && score.overall < 80).length,
      poor: scores.filter((score) => score.overall < 60).length,
    },
  };
}

export function getDashboardOverview(userId: string): DashboardOverview {
  const classes = getTeacherClasses(userId);
  const students = getTeacherStudents(userId);
  const sessions = getTeacherSessions(userId);
  const activeStudents = students.filter((student) => student.trainingCount > 0).length;
  const scores = sessions
    .map((session) => session.score?.overall)
    .filter((score): score is number => typeof score === 'number');

  return {
    totalClasses: classes.length,
    totalStudents: students.length,
    activeStudents,
    totalSessions: sessions.length,
    averageScore:
      scores.length === 0 ? 0 : Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
    alertsCount: getDashboardAlerts(userId).length,
    pendingReviews: sessions.filter((session) => session.riskLevel === 'high').length,
    weeklyGrowth: 18,
  };
}

export function getDashboardAlerts(userId: string): DashboardAlert[] {
  const classIds = getTeacherClasses(userId).map((item) => item.id);
  return mockDashboardAlerts.filter((alert) => !alert.relatedClassId || classIds.includes(alert.relatedClassId));
}

export function getClassPerformanceSummaries(userId: string): ClassPerformanceSummary[] {
  return getTeacherClasses(userId).map((classData) => {
    const classSessions = mockTrainingSessions.filter((session) => session.classId === classData.id);
    return {
      classData,
      stats: calculateClassStats(classData.id),
      latestTrainingAt: classSessions[0]?.startTime,
    };
  });
}

// 模拟 API 延迟
export function mockDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
