// 评分卡片组件

'use client';

import { getScoreLevel } from '../utils/format';

interface ScoreCardProps {
  label: string;
  score: number;
  size?: 'small' | 'medium' | 'large';
}

export function ScoreCard({ label, score, size = 'medium' }: ScoreCardProps) {
  const { color, label: levelLabel } = getScoreLevel(score);

  const sizeStyles = {
    small: { card: 'p-3', value: 'text-xl', label: 'text-xs', level: 'text-xs' },
    medium: { card: 'p-4', value: 'text-3xl', label: 'text-sm', level: 'text-xs' },
    large: { card: 'p-6', value: 'text-4xl', label: 'text-base', level: 'text-sm' },
  };

  const style = sizeStyles[size];

  return (
    <div className={`bg-gray-50 rounded-lg ${style.card} text-center`}>
      <div className={`${style.value} font-bold`} style={{ color }}>
        {score}
      </div>
      <div className={`${style.label} text-gray-600 mt-1`}>{label}</div>
      <div className={`${style.level} text-gray-400 mt-1`}>{levelLabel}</div>
    </div>
  );
}

// 环形进度条评分组件
export function CircularScore({ score, size = 120 }: { score: number; size?: number }) {
  const { color, label } = getScoreLevel(score);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{score}</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
    </div>
  );
}
