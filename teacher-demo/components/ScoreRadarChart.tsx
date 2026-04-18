// 评分雷达图组件 - 展示多维度评分
// 等最后阶段可接入echarts或chart.js

'use client';

interface ScoreRadarChartProps {
  scores: {
    communication: number;
    empathy: number;
    problemSolving: number;
    professionalism: number;
  };
  size?: number;
}

export function ScoreRadarChart({ scores, size = 200 }: ScoreRadarChartProps) {
  const dimensions = [
    { key: 'communication', label: '沟通能力', value: scores.communication },
    { key: 'empathy', label: '同理心', value: scores.empathy },
    { key: 'problemSolving', label: '问题解决', value: scores.problemSolving },
    { key: 'professionalism', label: '专业素养', value: scores.professionalism },
  ];

  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / 4;

  // 计算顶点位置
  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // 生成多边形路径
  const pathData = dimensions
    .map((d, i) => {
      const point = getPoint(i, d.value);
      return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ') + ' Z';

  // 生成网格线
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="inline-block">
      <svg width={size} height={size}>
        {/* 背景网格 */}
        {gridLevels.map((level) => {
          const points = dimensions
            .map((_, i) => {
              const point = getPoint(i, level);
              return `${point.x},${point.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* 轴线 */}
        {dimensions.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* 数据区域 */}
        <path
          d={pathData}
          fill="rgba(24, 144, 255, 0.2)"
          stroke="#1890ff"
          strokeWidth="2"
        />

        {/* 数据点 */}
        {dimensions.map((d, i) => {
          const point = getPoint(i, d.value);
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#1890ff"
            />
          );
        })}

        {/* 标签 */}
        {dimensions.map((d, i) => {
          const point = getPoint(i, 115);
          return (
            <text
              key={i}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-600"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
