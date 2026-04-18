// PDF导出工具 - 等最后阶段接入真实PDF库
// 目前使用window.print作为演示，后续可替换为jspdf或html2pdf

import type { Class, Student, ClassStats, TrainingSession, Score } from '../types';

/**
 * 导出学生个人报告
 * 后续接入：import jsPDF from 'jspdf';
 */
export function exportStudentReport(
  student: Student,
  sessions: TrainingSession[],
  averageScore: Score | null
): void {
  // 生成报告HTML
  const reportHtml = generateStudentReportHtml(student, sessions, averageScore);

  // 打开打印窗口
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.print();
  }
}

/**
 * 导出班级报告
 */
export function exportClassReport(
  classData: Class,
  stats: ClassStats,
  students: Student[]
): void {
  const reportHtml = generateClassReportHtml(classData, stats, students);

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.print();
  }
}

/**
 * 生成学生报告HTML
 */
function generateStudentReportHtml(
  student: Student,
  sessions: TrainingSession[],
  averageScore: Score | null
): string {
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>AI社会工作训练报告 - ${student.name}</title>
      <style>
        body { font-family: 'Microsoft YaHei', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #1890ff; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1890ff; margin: 0; }
        .info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .info-item { padding: 10px; background: #f5f5f5; border-radius: 4px; }
        .info-label { color: #666; font-size: 14px; }
        .info-value { font-size: 18px; font-weight: bold; color: #333; margin-top: 5px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-left: 4px solid #1890ff; padding-left: 10px; }
        .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
        .score-item { text-align: center; padding: 20px; background: #f0f7ff; border-radius: 8px; }
        .score-value { font-size: 32px; font-weight: bold; color: #1890ff; }
        .score-label { color: #666; margin-top: 10px; }
        .feedback { background: #fff7e6; padding: 20px; border-radius: 8px; border-left: 4px solid #faad14; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e8e8e8; }
        .table th { background: #fafafa; font-weight: 600; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e8e8e8; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>AI社会工作训练个人报告</h1>
        <p>生成时间：${new Date().toLocaleString('zh-CN')}</p>
      </div>

      <div class="info">
        <div class="info-item">
          <div class="info-label">姓名</div>
          <div class="info-value">${student.name}</div>
        </div>
        <div class="info-item">
          <div class="info-label">学号</div>
          <div class="info-value">${student.studentNo}</div>
        </div>
        <div class="info-item">
          <div class="info-label">班级</div>
          <div class="info-value">${student.className}</div>
        </div>
        <div class="info-item">
          <div class="info-label">训练次数</div>
          <div class="info-value">${totalSessions}次</div>
        </div>
      </div>

      ${averageScore ? `
      <div class="section">
        <h2>综合评分</h2>
        <div class="score-grid">
          <div class="score-item">
            <div class="score-value">${averageScore.overall}</div>
            <div class="score-label">综合得分</div>
          </div>
          <div class="score-item">
            <div class="score-value">${averageScore.communication}</div>
            <div class="score-label">沟通能力</div>
          </div>
          <div class="score-item">
            <div class="score-value">${averageScore.empathy}</div>
            <div class="score-label">同理心</div>
          </div>
          <div class="score-item">
            <div class="score-value">${averageScore.problemSolving}</div>
            <div class="score-label">问题解决</div>
          </div>
        </div>
        <div class="feedback">
          <strong>AI评语：</strong>${averageScore.feedback}
        </div>
      </div>
      ` : ''}

      <div class="section">
        <h2>训练记录</h2>
        <p>总训练时长：${Math.floor(totalDuration / 60)}小时${totalDuration % 60}分钟 | 平均每次：${avgDuration}分钟</p>
        <table class="table">
          <thead>
            <tr>
              <th>序号</th>
              <th>AI服务对象</th>
              <th>日期</th>
              <th>时长</th>
              <th>评分</th>
            </tr>
          </thead>
          <tbody>
            ${sessions.map((s, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${s.characterName}</td>
                <td>${new Date(s.startTime).toLocaleDateString('zh-CN')}</td>
                <td>${s.duration}分钟</td>
                <td>${s.score?.overall || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>社会工作教育AI训练平台 © 2024</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * 生成班级报告HTML
 */
function generateClassReportHtml(
  classData: Class,
  stats: ClassStats,
  students: Student[]
): string {
  const trainedStudents = students.filter(s => s.trainingCount > 0);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>班级训练报告 - ${classData.name}</title>
      <style>
        body { font-family: 'Microsoft YaHei', sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #1890ff; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1890ff; margin: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #f0f7ff; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 36px; font-weight: bold; color: #1890ff; }
        .stat-label { color: #666; margin-top: 8px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-left: 4px solid #1890ff; padding-left: 10px; }
        .dimension-scores { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
        .dim-item { text-align: center; padding: 15px; background: #f5f5f5; border-radius: 8px; }
        .dim-value { font-size: 28px; font-weight: bold; color: #52c41a; }
        .dim-label { color: #666; margin-top: 8px; font-size: 14px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e8e8e8; }
        .table th { background: #fafafa; font-weight: 600; }
        .table td:last-child { text-align: center; }
        .badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; }
        .badge-good { background: #f6ffed; color: #52c41a; }
        .badge-average { background: #fff7e6; color: #faad14; }
        .badge-poor { background: #fff1f0; color: #ff4d4f; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e8e8e8; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${classData.name} - AI社会工作训练报告</h1>
        <p>报告周期：2024年春季学期 | 生成时间：${new Date().toLocaleString('zh-CN')}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.trainingRate}%</div>
          <div class="stat-label">训练参与率<br><small>(${stats.trainedStudents}/${stats.totalStudents}人)</small></div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalSessions}</div>
          <div class="stat-label">总训练次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.avgScore}</div>
          <div class="stat-label">班级平均分</div>
        </div>
      </div>

      <div class="section">
        <h2>各维度均分</h2>
        <div class="dimension-scores">
          <div class="dim-item">
            <div class="dim-value">${stats.avgCommunication}</div>
            <div class="dim-label">沟通能力</div>
          </div>
          <div class="dim-item">
            <div class="dim-value">${stats.avgEmpathy}</div>
            <div class="dim-label">同理心</div>
          </div>
          <div class="dim-item">
            <div class="dim-value">${stats.avgProblemSolving}</div>
            <div class="dim-label">问题解决</div>
          </div>
          <div class="dim-item">
            <div class="dim-value">${stats.avgProfessionalism}</div>
            <div class="dim-label">专业素养</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>分数分布</h2>
        <p>优秀(90-100)：${stats.scoreDistribution.excellent}人 | 良好(80-89)：${stats.scoreDistribution.good}人 | 中等(60-79)：${stats.scoreDistribution.average}人 | 需改进(&lt;60)：${stats.scoreDistribution.poor}人</p>
      </div>

      <div class="section">
        <h2>学生训练情况明细</h2>
        <table class="table">
          <thead>
            <tr>
              <th>学号</th>
              <th>姓名</th>
              <th>训练次数</th>
              <th>最后训练时间</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => {
              const lastTime = s.lastTrainingAt ? new Date(s.lastTrainingAt).toLocaleDateString('zh-CN') : '从未训练';
              const statusClass = s.trainingCount >= 10 ? 'badge-good' : s.trainingCount > 0 ? 'badge-average' : 'badge-poor';
              const statusText = s.trainingCount >= 10 ? '优秀' : s.trainingCount > 0 ? '进行中' : '未开始';
              return `
                <tr>
                  <td>${s.studentNo}</td>
                  <td>${s.name}</td>
                  <td>${s.trainingCount}次</td>
                  <td>${lastTime}</td>
                  <td><span class="badge ${statusClass}">${statusText}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>社会工作教育AI训练平台 © 2024</p>
      </div>
    </body>
    </html>
  `;
}
