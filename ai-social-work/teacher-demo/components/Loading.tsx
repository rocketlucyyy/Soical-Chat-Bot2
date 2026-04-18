// 加载状态组件

'use client';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export function Loading({ size = 'medium', text = '加载中...' }: LoadingProps) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="mt-4 text-gray-500 text-sm">{text}</p>}
    </div>
  );
}

// 骨架屏组件
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
  );
}

// 表格行骨架
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
