// 格式化工具函数

/**
 * 格式化日期
 */
export function formatDate(dateString: string, includeTime = false): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (!includeTime) {
    return `${year}-${month}-${day}`;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return formatDate(dateString);
}

/**
 * 格式化时长
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
}

/**
 * 获取评分等级
 */
export function getScoreLevel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90) return { label: '优秀', color: '#52c41a' };
  if (score >= 80) return { label: '良好', color: '#1890ff' };
  if (score >= 60) return { label: '及格', color: '#faad14' };
  return { label: '需改进', color: '#ff4d4f' };
}

/**
 * 获取评分评语
 */
export function getScoreComment(score: number): string {
  if (score >= 90) return '表现卓越，展现了出色的专业素养';
  if (score >= 80) return '表现优秀，具备良好的沟通技巧';
  if (score >= 70) return '表现良好，能够完成基本服务流程';
  if (score >= 60) return '表现合格，需要继续练习提升';
  return '需要加强训练，建议多参与模拟练习';
}
