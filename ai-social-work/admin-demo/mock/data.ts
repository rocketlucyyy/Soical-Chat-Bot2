// 后台管理系统模拟数据

import type {
  User, Class, Student, AICharacter, Conversation, DialogMessage, DashboardStats
} from '../types';

// 用户数据
export const mockUsers: User[] = [
  {
    id: 'admin001',
    name: '系统管理员',
    email: 'admin@university.edu.cn',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: '2024-01-01',
  },
  {
    id: 'teacher001',
    name: '王教授',
    email: 'wang@university.edu.cn',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    classIds: ['class001', 'class002'],
    createdAt: '2024-01-15',
  },
  {
    id: 'teacher002',
    name: '李老师',
    email: 'li@university.edu.cn',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    classIds: ['class003'],
    createdAt: '2024-02-01',
  },
];

// 班级数据
export const mockClasses: Class[] = [
  {
    id: 'class001',
    name: '社会工作2023级1班',
    grade: '2023级',
    major: '社会工作',
    teacherId: 'teacher001',
    teacherName: '王教授',
    studentCount: 35,
  },
  {
    id: 'class002',
    name: '社会工作2023级2班',
    grade: '2023级',
    major: '社会工作',
    teacherId: 'teacher001',
    teacherName: '王教授',
    studentCount: 32,
  },
  {
    id: 'class003',
    name: '社会工作2022级1班',
    grade: '2022级',
    major: '社会工作',
    teacherId: 'teacher002',
    teacherName: '李老师',
    studentCount: 28,
  },
];

// 学生数据
export const mockStudents: Student[] = [
  { id: 'stu001', name: '张明', studentNo: '2023010101', classId: 'class001', className: '社会工作2023级1班', createdAt: '2024-02-01' },
  { id: 'stu002', name: '李华', studentNo: '2023010102', classId: 'class001', className: '社会工作2023级1班', createdAt: '2024-02-01' },
  { id: 'stu003', name: '王芳', studentNo: '2023010103', classId: 'class001', className: '社会工作2023级1班', createdAt: '2024-02-01' },
  { id: 'stu004', name: '刘洋', studentNo: '2023010104', classId: 'class001', className: '社会工作2023级1班', createdAt: '2024-02-01' },
  { id: 'stu005', name: '陈静', studentNo: '2023010201', classId: 'class002', className: '社会工作2023级2班', createdAt: '2024-02-01' },
  { id: 'stu006', name: '杨强', studentNo: '2023010202', classId: 'class002', className: '社会工作2023级2班', createdAt: '2024-02-01' },
  { id: 'stu007', name: '赵丽', studentNo: '2022010101', classId: 'class003', className: '社会工作2022级1班', createdAt: '2023-02-01' },
  { id: 'stu008', name: '孙杰', studentNo: '2022010102', classId: 'class003', className: '社会工作2022级1班', createdAt: '2023-02-01' },
];

// AI角色
export const mockCharacters: AICharacter[] = [
  { id: 'char001', name: '李大爷', type: 'elderly', description: '独居老人，性格固执但内心孤独', scenario: '独居老人探访' },
  { id: 'char002', name: '小明', type: 'child', description: '留守儿童，渴望关爱', scenario: '儿童心理辅导' },
  { id: 'char003', name: '王阿姨', type: 'disabled', description: '残障人士，需要心理支持', scenario: '残障人士帮扶' },
  { id: 'char004', name: '张先生', type: 'family', description: '面临家庭矛盾的丈夫', scenario: '家庭矛盾调解' },
  { id: 'char005', name: '社区张主任', type: 'community', description: '社区工作者，协调资源', scenario: '社区资源协调' },
];

// 生成对话消息
function generateMessages(): DialogMessage[] {
  return [
    { id: 'msg001', role: 'system', content: '开始模拟训练：你是一名社工，需要与独居老人李大爷建立信任关系。', timestamp: '2024-04-18T10:00:00' },
    { id: 'msg002', role: 'ai', content: '你是谁啊？来我家干什么？', timestamp: '2024-04-18T10:00:15', emotion: '怀疑' },
    { id: 'msg003', role: 'student', content: '李大爷您好，我是社区的社会工作者小张，听说您最近身体不太好，我来看看您。', timestamp: '2024-04-18T10:00:45' },
    { id: 'msg004', role: 'ai', content: '我不需要你们帮忙，我自己能照顾好自己。', timestamp: '2024-04-18T10:01:00', emotion: '抗拒' },
    { id: 'msg005', role: 'student', content: '大爷，我理解您独立生活的能力。我只是想认识一下您，如果您有需要的时候可以联系我。这是我的名片。', timestamp: '2024-04-18T10:01:30' },
    { id: 'msg006', role: 'ai', content: '（接过名片看了看）社区工作者...你们能提供什么帮助？', timestamp: '2024-04-18T10:02:00', emotion: '好奇' },
    { id: 'msg007', role: 'student', content: '我们可以帮您链接医疗资源、日间照料服务，还有定期的探访。您有什么需求都可以告诉我。', timestamp: '2024-04-18T10:02:30' },
    { id: 'msg008', role: 'ai', content: '我最近膝盖不太好，去医院不方便...', timestamp: '2024-04-18T10:03:00', emotion: '担忧' },
    { id: 'msg009', role: 'student', content: '这个我可以帮您联系社区医院的上门医疗服务。您什么时候方便，我帮您预约一下？', timestamp: '2024-04-18T10:03:30' },
    { id: 'msg010', role: 'ai', content: '真的吗？那太好了，我周三在家。', timestamp: '2024-04-18T10:04:00', emotion: '高兴' },
    { id: 'msg011', role: 'student', content: '好的李大爷，我记下了，周三上午我带您去医院做检查。还有其他需要帮忙的吗？', timestamp: '2024-04-18T10:04:30' },
    { id: 'msg012', role: 'ai', content: '暂时没有了，谢谢你啊小张。', timestamp: '2024-04-18T10:05:00', emotion: '感激' },
    { id: 'msg013', role: 'student', content: '不客气，大爷您保重身体，我周三再来找您。', timestamp: '2024-04-18T10:05:15' },
    { id: 'msg014', role: 'system', content: '训练完成', timestamp: '2024-04-18T10:15:00' },
  ];
}

// 生成随机评分
function generateScore() {
  const professionalSkills = Math.floor(Math.random() * 2) + 3;  // 3-5
  const ethics = Math.floor(Math.random() * 2) + 3;
  const culturalSensitivity = Math.floor(Math.random() * 2) + 3;
  const language = Math.floor(Math.random() * 2) + 3;
  const overall = Math.round((professionalSkills + ethics + culturalSensitivity + language) / 4 * 10) / 10;

  const feedbacks = [
    '表现优秀，能够准确把握服务对象需求，沟通技巧娴熟，体现了良好的专业素养。',
    '表现良好，沟通顺畅，但在深度共情方面还有提升空间。建议加强对服务对象情感需求的关注。',
    '表现中等，基本掌握服务流程，建议加强倾听技巧，多使用开放式问题。',
    '表现尚可，需要更多练习来建立专业自信。建议多参与模拟训练，提高应变能力。',
  ];

  return {
    professionalSkills,
    ethics,
    culturalSensitivity,
    language,
    overall,
    feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)],
  };
}

// 对话数据
export const mockConversations: Conversation[] = [];

// 为每个学生生成对话记录
mockStudents.forEach((student, index) => {
  const conversationCount = Math.floor(Math.random() * 8) + 2; // 2-10次

  for (let i = 0; i < conversationCount; i++) {
    const character = mockCharacters[Math.floor(Math.random() * mockCharacters.length)];
    const date = new Date('2024-04-01');
    date.setDate(date.getDate() + Math.floor(Math.random() * 30));
    const startTime = date.toISOString();
    const duration = Math.floor(Math.random() * 20) + 10;
    const endDate = new Date(date.getTime() + duration * 60000);

    mockConversations.push({
      id: `conv_${student.id}_${i}`,
      studentId: student.id,
      studentName: student.name,
      studentNo: student.studentNo,
      classId: student.classId,
      className: student.className,
      characterId: character.id,
      characterName: character.name,
      characterType: character.type,
      messages: generateMessages(),
      startTime,
      endTime: endDate.toISOString(),
      duration,
      messageCount: 14,
      status: 'completed',
      score: generateScore(),
      tags: Math.random() > 0.7 ? ['优秀案例'] : undefined,
    });
  }
});

// 统计数据
export function getDashboardStats(userRole: string, userId?: string): DashboardStats {
  let relevantConversations = mockConversations;

  // 教师只能看自己班级的数据
  if (userRole === 'teacher' && userId) {
    const teacher = mockUsers.find(u => u.id === userId);
    const classIds = teacher?.classIds || [];
    relevantConversations = mockConversations.filter(c => classIds.includes(c.classId));
  }

  const today = new Date().toISOString().split('T')[0];
  const todayConversations = relevantConversations.filter(c => c.startTime.startsWith(today));

  const scores = relevantConversations.filter(c => c.score).map(c => c.score!.overall);
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10
    : 0;

  const activeStudentIds = new Set();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  relevantConversations.forEach(c => {
    if (new Date(c.startTime) > oneWeekAgo) {
      activeStudentIds.add(c.studentId);
    }
  });

  const totalDuration = relevantConversations.reduce((sum, c) => sum + c.duration, 0);

  return {
    totalConversations: relevantConversations.length,
    todayConversations: todayConversations.length,
    totalStudents: userRole === 'admin' ? mockStudents.length :
      mockStudents.filter(s => {
        const teacher = mockUsers.find(u => u.id === userId);
        return teacher?.classIds?.includes(s.classId);
      }).length,
    activeStudents: activeStudentIds.size,
    avgScore,
    totalDuration,
  };
}

// 模拟延迟
export function mockDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
