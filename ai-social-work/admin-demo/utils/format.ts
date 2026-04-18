// 格式化工具函数

/**
 * 格式化日期时间
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
 * 获取角色颜色
 */
export function getRoleColor(role: string): string {
  switch (role) {
    case 'student':
      return 'bg-blue-100 text-blue-700';
    case 'ai':
      return 'bg-green-100 text-green-700';
    case 'system':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

/**
 * 获取AI角色类型图标
 */
export function getCharacterIcon(type: string): string {
  switch (type) {
    case 'elderly':
      return '👴';
    case 'child':
      return '👶';
    case 'disabled':
      return '♿';
    case 'family':
      return '👨‍👩‍👧';
    case 'community':
      return '🏘️';
    default:
      return '👤';
  }
}

/**
 * 获取AI角色类型名称
 */
export function getCharacterTypeName(type: string): string {
  const names: Record<string, string> = {
    elderly: '老年人服务',
    child: '儿童服务',
    disabled: '残障服务',
    family: '家庭服务',
    community: '社区服务',
  };
  return names[type] || type;
}

/**
 * 获取评分颜色
 */
export function getScoreColor(score: number): string {
  if (score >= 4.5) return 'text-green-600 bg-green-50';
  if (score >= 3.5) return 'text-blue-600 bg-blue-50';
  if (score >= 2.5) return 'text-yellow-600 bg-yellow-50';
  if (score >= 1.5) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}

/**
 * 获取评分等级
 */
export function getScoreLevel(score: number): string {
  if (score >= 4.5) return '优秀';
  if (score >= 3.5) return '良好';
  if (score >= 2.5) return '中等';
  if (score >= 1.5) return '待改进';
  return '不合格';
}

/**
 * 截断文本
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
