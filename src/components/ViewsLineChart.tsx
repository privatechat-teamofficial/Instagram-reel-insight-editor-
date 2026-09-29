import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { Pencil } from 'lucide-react';

export const ViewsLineChart: React.FC = () => {
  const { data, viewsChartFilter, setViewsChartFilter, isEditMode, setIsChartModalOpen } = useInsights();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = data.viewsChart.points;
  const dates = data.viewsChart.dates;
  const yMax = data.viewsChart.yMax || 4000;

  // Extract values based on active filter
  const values = points.map((p) => {
    if (viewsChartFilter === 'followers') return p.followers;
    if (viewsChartFilter === 'non_followers') return p.nonFollowers;
    return p.all;
  });

  // Calculate SVG dimensions
  const svgWidth = 320;
  const svgHeight = 110;
  const padLeft = 10;
  const padRight = 10;
  const padTop = 15;
  const padBottom = 20;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  const maxVal = Math.max(...values, yMax);

  // Generate coordinates
  const coords = points.map((_, i) => {
    const x = padLeft + (i / (points.length - 1 || 1)) * chartWidth;
    const val = values[i];
    const y = padTop + chartHeight - (val / (maxVal || 1)) * chartHeight;
    return { x, y, val, label: points[i].label };
  });

  // Build SVG path
  const pathData = coords.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    // Draw smooth or clean line
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Format numbers for Y-axis (e.g., 4K, 2K, 0)
  const formatYAxis = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return `${num}`;
  };

  return (
    <div className="w-full flex flex-col gap-3 py-2 select-none">
      {/* Filter Pills */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setViewsChartFilter('all')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all ${
            viewsChartFilter === 'all'
              ? 'bg-[#262626] text-[#ffffff] border border-[#3f3f46]'
              : 'bg-[#181818] text-[#8e8e8e] border border-transparent hover:text-white'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setViewsChartFilter('followers')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all ${
            viewsChartFilter === 'followers'
              ? 'bg-[#262626] text-[#ffffff] border border-[#3f3f46]'
              : 'bg-[#181818] text-[#8e8e8e] border border-transparent hover:text-white'
          }`}
        >
          Followers
        </button>
        <button
          type="button"
          onClick={() => setViewsChartFilter('non_followers')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all ${
            viewsChartFilter === 'non_followers'
              ? 'bg-[#262626] text-[#ffffff] border border-[#3f3f46]'
              : 'bg-[#181818] text-[#8e8e8e] border border-transparent hover:text-white'
          }`}
        >
          Non-followers
        </button>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative flex items-stretch mt-1 group/chart">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between items-end pr-2 text-[11px] text-[#8e8e8e] font-medium w-9 pb-5 tabular-numbers select-none">
          <EditableValue
            path="viewsChart.yMax"
            title="Max Y value"
            type="number"
            value={yMax}
            className="text-[11px] text-[#8e8e8e]"
          >
            {formatYAxis(yMax)}
          </EditableValue>
          <span className="text-[11px] text-[#8e8e8e]">{formatYAxis(Math.round(yMax / 2))}</span>
          <span className="text-[11px] text-[#8e8e8e]">0</span>
        </div>

        {/* SVG Curve Container */}
        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-[120px] overflow-visible"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Horizontal Grid lines */}
            <line
              x1={padLeft}
              y1={padTop}
              x2={svgWidth - padRight}
              y2={padTop}
              stroke="#262626"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <line
              x1={padLeft}
              y1={padTop + chartHeight / 2}
              x2={svgWidth - padRight}
              y2={padTop + chartHeight / 2}
              stroke="#262626"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <line
              x1={padLeft}
              y1={padTop + chartHeight}
              x2={svgWidth - padRight}
              y2={padTop + chartHeight}
              stroke="#262626"
              strokeWidth="1"
            />

            {/* Gradient Fill under the line (subtle) */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d9287a" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#d9287a" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area under curve */}
            {coords.length > 0 && (
              <path
                d={`${pathData} L ${coords[coords.length - 1].x} ${padTop + chartHeight} L ${coords[0].x} ${
                  padTop + chartHeight
                } Z`}
                fill="url(#chartGradient)"
              />
            )}

            {/* The Main Pink/Magenta Line */}
            <path
              d={pathData}
              fill="none"
              stroke="#d9287a"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Points */}
            {coords.map((c, i) => {
              const isHovered = hoverIndex === i;
              return (
                <g key={i} className="cursor-pointer">
                  {/* Invisible larger hit target */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="12"
                    fill="transparent"
                    onMouseEnter={() => setHoverIndex(i)}
                    onTouchStart={() => setHoverIndex(i)}
                  />

                  {/* Visible point circle on hover or end */}
                  {(isHovered || i === coords.length - 1) && (
                    <>
                      <circle cx={c.x} cy={c.y} r="5" fill="#d9287a" />
                      <circle cx={c.x} cy={c.y} r="2.5" fill="#ffffff" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip */}
          {hoverIndex !== null && coords[hoverIndex] && (
            <div
              className="absolute pointer-events-none -top-4 -translate-x-1/2 bg-[#1f1f1f] text-white text-[11px] font-semibold px-2 py-1 rounded shadow-lg border border-[#333333] whitespace-nowrap z-20"
              style={{
                left: `${(coords[hoverIndex].x / svgWidth) * 100}%`,
              }}
            >
              {new Intl.NumberFormat('en-US').format(coords[hoverIndex].val)} views
              <span className="block text-[9px] font-normal text-gray-400">{coords[hoverIndex].label}</span>
            </div>
          )}

          {/* Date Markers on X-Axis */}
          <div className="flex justify-between items-center text-[11px] text-[#8e8e8e] pt-1 px-2 select-none">
            {dates.map((dateStr, idx) => (
              <EditableValue
                key={idx}
                path={`viewsChart.dates.${idx}`}
                title={`Date label ${idx + 1}`}
                type="date"
                value={dateStr}
                className="text-[11px] text-[#8e8e8e]"
              >
                {dateStr}
              </EditableValue>
            ))}
          </div>
        </div>

        {/* Quick Edit button for chart in edit mode */}
        {isEditMode && (
          <button
            type="button"
            onClick={() => setIsChartModalOpen(true)}
            className="absolute top-0 right-0 bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1 shadow transition-all"
          >
            <Pencil className="w-3 h-3" />
            Edit Data Points
          </button>
        )}
      </div>
    </div>
  );
};
