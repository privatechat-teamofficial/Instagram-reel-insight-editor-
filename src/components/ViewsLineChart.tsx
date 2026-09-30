import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';

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

  const svgWidth = 330;
  const svgHeight = 110;
  const padLeft = 8;
  const padRight = 8;
  const padTop = 12;
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
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Format numbers for Y-axis (e.g. 4K, 2K, 0)
  const formatYAxis = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return `${num}`;
  };

  return (
    <div className="w-full flex flex-col gap-3 pt-1 pb-1 select-none">
      {/* Filter Pills matching exact screenshot styles:
          [ All ] [ Followers ] [ Non-followers ]
      */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setViewsChartFilter('all')}
          className={`px-3.5 py-1 text-[12.5px] font-medium rounded-full transition-all border ${
            viewsChartFilter === 'all'
              ? 'bg-[#2e3339] text-white border-[#3d444d]'
              : 'bg-[#14171a] text-[#d0d4d9] border-[#2d333b] hover:text-white'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setViewsChartFilter('followers')}
          className={`px-3.5 py-1 text-[12.5px] font-medium rounded-full transition-all border ${
            viewsChartFilter === 'followers'
              ? 'bg-[#2e3339] text-white border-[#3d444d]'
              : 'bg-[#14171a] text-[#d0d4d9] border-[#2d333b] hover:text-white'
          }`}
        >
          Followers
        </button>
        <button
          type="button"
          onClick={() => setViewsChartFilter('non_followers')}
          className={`px-3.5 py-1 text-[12.5px] font-medium rounded-full transition-all border ${
            viewsChartFilter === 'non_followers'
              ? 'bg-[#2e3339] text-white border-[#3d444d]'
              : 'bg-[#14171a] text-[#d0d4d9] border-[#2d333b] hover:text-white'
          }`}
        >
          Non-followers
        </button>
      </div>

      {/* Chart Canvas Area on Dark Background */}
      <div className="relative flex items-stretch mt-1">
        {/* Y-Axis Labels: 4K, 2K, 0 */}
        <div className="flex flex-col justify-between items-end pr-2 text-[10.5px] text-[#8a9199] font-normal w-8 pb-5 tabular-numbers select-none">
          <EditableValue
            path="viewsChart.yMax"
            title="Max Y value"
            type="number"
            value={yMax}
            className="text-[10.5px] text-[#8a9199]"
          >
            {formatYAxis(yMax)}
          </EditableValue>
          <span className="text-[10.5px] text-[#8a9199]">{formatYAxis(Math.round(yMax / 2))}</span>
          <span className="text-[10.5px] text-[#8a9199]">0</span>
        </div>

        {/* SVG Curve Container */}
        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-[110px] overflow-visible"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Horizontal Grid lines matching screenshot (solid subtle thin lines) */}
            <line
              x1={padLeft}
              y1={padTop}
              x2={svgWidth - padRight}
              y2={padTop}
              stroke="#20242a"
              strokeWidth="1"
            />
            <line
              x1={padLeft}
              y1={padTop + chartHeight / 2}
              x2={svgWidth - padRight}
              y2={padTop + chartHeight / 2}
              stroke="#20242a"
              strokeWidth="1"
            />
            <line
              x1={padLeft}
              y1={padTop + chartHeight}
              x2={svgWidth - padRight}
              y2={padTop + chartHeight}
              stroke="#20242a"
              strokeWidth="1"
            />

            {/* Pure Vibrant Pink/Magenta Line (no shaded gradient underneath, matching screenshot!) */}
            <path
              d={pathData}
              fill="none"
              stroke="#FE36FF"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Points */}
            {coords.map((c, i) => {
              const isHovered = hoverIndex === i;
              return (
                <g key={i} className="cursor-pointer">
                  {/* Invisible hit target */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="12"
                    fill="transparent"
                    onMouseEnter={() => setHoverIndex(i)}
                    onTouchStart={() => setHoverIndex(i)}
                  />

                  {/* Dot on hover */}
                  {isHovered && (
                    <>
                      <circle cx={c.x} cy={c.y} r="4" fill="#FE36FF" />
                      <circle cx={c.x} cy={c.y} r="1.8" fill="#ffffff" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip on hover/touch */}
          {hoverIndex !== null && coords[hoverIndex] && (
            <div
              className="absolute pointer-events-none -top-4 -translate-x-1/2 bg-[#1c2024] text-white text-[10.5px] font-semibold px-2 py-0.5 rounded shadow-lg border border-[#2d333b] whitespace-nowrap z-20"
              style={{
                left: `${(coords[hoverIndex].x / svgWidth) * 100}%`,
              }}
            >
              {new Intl.NumberFormat('en-US').format(coords[hoverIndex].val)} views
              <span className="block text-[9px] font-normal text-[#8a9199]">{coords[hoverIndex].label}</span>
            </div>
          )}

          {/* Date Markers on X-Axis: 12 Sept, 21 Sept, 29 Sept */}
          <div className="flex justify-between items-center text-[10.5px] text-[#8a9199] pt-1 px-1 select-none">
            {dates.map((dateStr, idx) => (
              <EditableValue
                key={idx}
                path={`viewsChart.dates.${idx}`}
                title={`Date label ${idx + 1}`}
                type="date"
                value={dateStr}
                className="text-[10.5px] text-[#8a9199]"
              >
                {dateStr}
              </EditableValue>
            ))}
          </div>
        </div>

        {/* Direct edit & image upload trigger in edit mode */}
        {isEditMode && (
          <button
            type="button"
            onClick={() => setIsChartModalOpen(true)}
            className="absolute -top-6 right-0 text-[10.5px] text-[#ec008c] hover:underline font-semibold flex items-center gap-1 bg-[#1c2024] px-2 py-0.5 rounded-md border border-[#2d333b]"
          >
            <span>📷 Upload graph image / Edit</span>
          </button>
        )}
      </div>
    </div>
  );
};
