// 搜索筛选组件

'use client';

import { useState } from 'react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  placeholder?: string;
  filterOptions?: FilterOption[];
  onExport?: () => void;
  exportLabel?: string;
}

interface FilterState {
  status: string;
  dateRange: string;
  sortBy: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export function SearchFilter({
  onSearch,
  onFilterChange,
  placeholder = '搜索...',
  onExport,
  exportLabel = '导出',
}: SearchFilterProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    dateRange: 'all',
    sortBy: 'recent',
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
      <div className="flex items-center space-x-4">
        {/* 搜索框 */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* 筛选按钮 */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center space-x-2 ${
            showFilters
              ? 'bg-blue-50 border-blue-300 text-blue-600'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span>⚙️</span>
          <span>筛选</span>
          {(filters.status !== 'all' || filters.dateRange !== 'all') && (
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* 导出按钮 */}
        {onExport && (
          <button
            onClick={onExport}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>📥</span>
            <span>{exportLabel}</span>
          </button>
        )}
      </div>

      {/* 筛选选项 */}
      {showFilters && (
        <div className="pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              训练状态
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">全部</option>
              <option value="completed">已完成</option>
              <option value="in_progress">进行中</option>
              <option value="not_started">未开始</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              时间范围
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">全部时间</option>
              <option value="today">今天</option>
              <option value="week">最近7天</option>
              <option value="month">最近30天</option>
              <option value="semester">本学期</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              排序方式
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="recent">最近训练</option>
              <option value="score_high">评分从高到低</option>
              <option value="score_low">评分从低到高</option>
              <option value="name">姓名排序</option>
              <option value="training_count">训练次数</option>
            </select>
          </div>
        </div>
      )}

      {/* 已选筛选标签 */}
      {(filters.status !== 'all' || filters.dateRange !== 'all') && (
        <div className="flex items-center space-x-2 pt-2">
          <span className="text-sm text-gray-500">已选筛选：</span>
          {filters.status !== 'all' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center space-x-1">
              <span>
                {filters.status === 'completed'
                  ? '已完成'
                  : filters.status === 'in_progress'
                  ? '进行中'
                  : '未开始'}
              </span>
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          )}
          {filters.dateRange !== 'all' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center space-x-1">
              <span>
                {filters.dateRange === 'today'
                  ? '今天'
                  : filters.dateRange === 'week'
                  ? '最近7天'
                  : filters.dateRange === 'month'
                  ? '最近30天'
                  : '本学期'}
              </span>
              <button
                onClick={() => handleFilterChange('dateRange', 'all')}
                className="hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setFilters({ status: 'all', dateRange: 'all', sortBy: 'recent' });
              onFilterChange({ status: 'all', dateRange: 'all', sortBy: 'recent' });
            }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            清除全部
          </button>
        </div>
      )}
    </div>
  );
}
