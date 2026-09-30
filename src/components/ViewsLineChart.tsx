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

  // Extract "Your typical reel" baseline values
  const typicalValues = points.map((p) => {
    if (p.typical !== undefined) return p.typical;
    return Math.round((p.all || 100) * 0.12);
  });

  const svgWidth = 330;
  const svgHeight = 110;
  const padLeft = 8;
  const padRight = 8;
  const padTop = 12;
  const padBottom = 20;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  const maxVal = Math.max(...values, ...typicalValues, yMax);

  // Generate coordinates for "This reel"
  const coords = points.map((_, i) => {
    const x = padLeft + (i / (points.length - 1 || 1)) * chartWidth;
    const val = values[i];
    const y = padTop + chartHeight - (val / (maxVal || 1)) * chartHeight;
    const typVal = typicalValues[i];
    const typY = padTop + chartHeight - (typVal / (maxVal || 1)) * chartHeight;
    return { x, y, val, typVal, typY, label: points[i].label };
  });

  // Build SVG paths
  const pathData = coords.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const typicalPathData = coords.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.typY}`;
    return `${acc} L ${curr.x} ${curr.typY}`;
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
          className={`h-[28px] p-0 px-3.5 flex items-center justify-center text-[12.5px] font-medium rounded-full transition-colors duration-150 border outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none select-none ${
            viewsChartFilter === 'all'
              ? 'bg-[#282d35] text-white border-[#38404c]'
              : 'bg-[#14171a] text-[#8e959b] border-[#252932] hover:text-[#d0d4d9]'
          }`}
        >
          <span className="leading-none text-center block translate-y-[1px]">All</span>
        </button>
        <button
          type="button"
          onClick={() => setViewsChartFilter('followers')}
          className={`h-[28px] p-0 px-3.5 flex items-center justify-center text-[12.5px] font-medium rounded-full transition-colors duration-150 border outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none select-none ${
            viewsChartFilter === 'followers'
              ? 'bg-[#282d35] text-white border-[#38404c]'
              : 'bg-[#14171a] text-[#8e959b] border-[#252932] hover:text-[#d0d4d9]'
          }`}
        >
          <span className="leading-none text-center block translate-y-[1px]">Followers</span>
        </button>
        <button
          type="button"
          onClick={() => setViewsChartFilter('non_followers')}
          className={`h-[28px] p-0 px-3.5 flex items-center justify-center text-[12.5px] font-medium rounded-full transition-colors duration-150 border outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none select-none ${
            viewsChartFilter === 'non_followers'
              ? 'bg-[#282d35] text-white border-[#38404c]'
              : 'bg-[#14171a] text-[#8e959b] border-[#252932] hover:text-[#d0d4d9]'
          }`}
        >
          <span className="leading-none text-center block translate-y-[1px]">Non-followers</span>
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

            {/* "Your typical reel" Dashed Gray Baseline */}
            <path
              d={typicalPathData}
              fill="none"
              stroke="#5c6370"
              strokeWidth="2.2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* "This reel" Vibrant Pink/Magenta Solid Line */}
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
                      <circle cx={c.x} cy={c.typY} r="3" fill="#5c6370" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip on hover/touch */}
          {hoverIndex !== null && coords[hoverIndex] && (
            <div
              className="absolute pointer-events-none -top-6 -translate-x-1/2 bg-[#1c2024] text-white text-[10.5px] font-semibold px-2 py-1 rounded shadow-lg border border-[#2d333b] whitespace-nowrap z-20"
              style={{
                left: `${(coords[hoverIndex].x / svgWidth) * 100}%`,
              }}
            >
              <div className="flex items-center gap-1.5 text-[#FE36FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FE36FF]" />
                <span>{new Intl.NumberFormat('en-US').format(coords[hoverIndex].val)} views</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8e959b] text-[9.5px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5c6370]" />
                <span>Typical: {new Intl.NumberFormat('en-US').format(coords[hoverIndex].typVal)}</span>
              </div>
              <span className="block text-[9px] font-normal text-[#8a9199] mt-0.5">{coords[hoverIndex].label}</span>
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

          {/* Dual series legend matching Instagram: ● This reel   ● Your typical reel */}
          <div className="flex items-center gap-5 pt-3 pb-0.5 px-0.5 select-none text-[11px] text-[#8e959b]">
            <div className="flex items-center gap-1.5">
              <span className="w-[6.5px] h-[6.5px] rounded-full bg-[#FE36FF] shrink-0" />
              <span className="text-[#8e959b] font-normal">This reel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-[6.5px] h-[6.5px] rounded-full bg-[#5c6370] shrink-0" />
              <span className="text-[#8e959b] font-normal">Your typical reel</span>
            </div>
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
