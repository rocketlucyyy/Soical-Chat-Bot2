// 美化后的统计卡片组件

'use client';

import { useState, useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon = '📊',
  trend,
  color = 'blue',
  delay = 0,
}: StatCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const colorSchemes = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
      icon: 'bg-blue-500',
      text: 'text-blue-900',
      subtext: 'text-blue-600',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-200',
      icon: 'bg-green-500',
      text: 'text-green-900',
      subtext: 'text-green-600',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
      icon: 'bg-purple-500',
      text: 'text-purple-900',
      subtext: 'text-purple-600',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      border: 'border-orange-200',
      icon: 'bg-orange-500',
      text: 'text-orange-900',
      subtext: 'text-orange-600',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      border: 'border-red-200',
      icon: 'bg-red-500',
      text: 'text-red-900',
      subtext: 'text-red-600',
    },
  };

  const scheme = colorSchemes[color];

  // 数字动画效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (typeof value === 'number') {
        const duration = 1000;
        const steps = 30;
        const increment = value / steps;
        let current = 0;
        const interval = setInterval(() => {
          current += increment;
          if (current >= value) {
            setAnimatedValue(value);
            clearInterval(interval);
          } else {
            setAnimatedValue(Math.floor(current));
          }
        }, duration / steps);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const displayValue = typeof value === 'number' ? animatedValue : value;

  return (
    <div
      className={`${scheme.bg} border ${scheme.border} rounded-xl p-5 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${scheme.subtext}`}>{title}</p>
          <p className={`text-3xl font-bold ${scheme.text} mt-1`}>{displayValue}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center space-x-1 mt-2">
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              <span
                className={`text-sm ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.value}%
              </span>
              <span className="text-sm text-gray-400">vs 上周</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 ${scheme.icon} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// 进度条卡片
interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export function ProgressCard({
  title,
  current,
  total,
  color = 'blue',
}: ProgressCardProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const colorSchemes = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <span className="text-2xl font-bold text-gray-800">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorSchemes[color]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {current} / {total} 人
      </p>
    </div>
  );
}
