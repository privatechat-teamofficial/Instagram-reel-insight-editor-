import React, { useState, useEffect, useRef } from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { Calendar, TrendingUp } from 'lucide-react';

export const ViewsLineChart: React.FC = () => {
  const {
    data,
    viewsChartFilter,
    setViewsChartFilter,
    isEditMode,
    setIsChartModalOpen,
    setIsDateShiftModalOpen,
    setIsTypicalModalOpen,
  } = useInsights();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const touchTimerRef = useRef<number | null>(null);

  // Clear hover state on filter switch
  useEffect(() => {
    setHoverIndex(null);
  }, [viewsChartFilter]);

  const handleTouch = (idx: number) => {
    setHoverIndex(idx);
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = window.setTimeout(() => {
      setHoverIndex(null);
    }, 2500);
  };

  const points = data?.viewsChart?.points || [];
  const dates = data?.viewsChart?.dates || [];
  const yMax = data?.viewsChart?.yMax || 4000;

  // Extract values based on active filter
  const values = points.map((p) => {
    if (viewsChartFilter === 'followers') return p.followers;
    if (viewsChartFilter === 'non_followers') return p.nonFollowers;
    return p.all;
  });

  // Extract "Your typical reel" baseline values (starting at 0 for point 1)
  const typicalValues = points.map((p, idx) => {
    if (idx === 0) return 0;
    if (p.typical !== undefined) return p.typical;
    return Math.round((p.all || 100) * 0.12);
  });

  const svgWidth = 300;
  const svgHeight = 104;
  const padTop = 4;
  const padBottom = 4;

  const chartWidth = svgWidth;
  const chartHeight = svgHeight - padTop - padBottom;

  const maxVal = Math.max(...values, ...typicalValues, yMax);

  // Check if points contain explicit active/inactive flags
  const hasInactivePoint = points.some((p) => p.hasData === false);
  // If not explicitly marked, "This reel" represents progress up to current date (~60% across)
  const activeCutoffIndex = hasInactivePoint
    ? points.length
    : Math.min(points.length - 1, Math.max(1, Math.round(points.length * 0.6)));

  // Generate coordinates:
  // Both "This reel" and "Your typical reel" start directly from the initial position of the X-axis (x = 0)
  const coords = points.map((p, i) => {
    const t = i / (points.length - 1 || 1);
    const x = t * chartWidth;
    const hasData = hasInactivePoint ? p.hasData !== false : i <= activeCutoffIndex;
    const val = i === 0 ? 0 : values[i];
    const y = padTop + chartHeight - (val / (maxVal || 1)) * chartHeight;
    const typVal = i === 0 ? 0 : typicalValues[i];
    const typY = padTop + chartHeight - (typVal / (maxVal || 1)) * chartHeight;

    // Dynamically sync label with active X-axis dates
    let dynamicLabel = p.label;
    if (dates.length >= 2) {
      if (i === 0) dynamicLabel = dates[0];
      else if (i === points.length - 1) dynamicLabel = dates[dates.length - 1];
      else if (dates.length === 3) {
        dynamicLabel = t < 0.35 ? dates[0] : t < 0.7 ? dates[1] : dates[2];
      }
    }

    return { x, y, val, typVal, typY, label: dynamicLabel, hasData };
  });

  // Filter coordinates for "This reel" where data exists
  // Always include index 0 so the graph extends all the way to the left up to the first date
  const activeCoords = coords.filter((c, idx) => idx === 0 || c.hasData);

  // Build SVG path for "This reel" (vibrant pink solid line, in-progress)
  // Starts directly from the initial position of the X-axis (x = 0, y = 0)
  const pathData = activeCoords.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Build SVG path for "Your typical reel" (dashed gray line)
  // Extends horizontally from initial position of X-axis (0) all the way to last date (chartWidth)
  const typicalPathData = coords.reduce((acc, curr, index) => {
    const x = index === 0 ? 0 : index === coords.length - 1 ? chartWidth : curr.x;
    if (index === 0) return `M 0 ${curr.typY}`;
    return `${acc} L ${x} ${curr.typY}`;
  }, '');

  // Format numbers for Y-axis (e.g. 4K, 2K, 0)
  const formatYAxis = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return `${num}`;
  };

  return (
    <div className="w-full flex flex-col pt-0.5 pb-1 select-none">
      {/* Filter Pills matching exact screenshot styles:
          [ All ] [ Followers ] [ Non-followers ]
      */}
      <div className="flex items-center gap-2 mt-3">
        <button
          type="button"
          onClick={() => setViewsChartFilter('all')}
          className={`h-[34px] px-4 inline-flex items-center justify-center text-[13.5px] font-medium leading-none rounded-full border outline-none focus:outline-none active:scale-[0.98] select-none transition-all ${
            viewsChartFilter === 'all'
              ? 'bg-[#282d35] text-white border-[#38404c]'
              : 'bg-[#14171a] text-[#8e959b] border-[#252932] hover:text-[#d0d4d9]'
          }`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="leading-none text-center font-medium">All</span>
        </button>
        <button
          type="button"
          onClick={() => setViewsChartFilter('followers')}
          className={`h-[34px] px-4 inline-flex items-center justify-center text-[13.5px] font-medium leading-none rounded-full border outline-none focus:outline-none active:scale-[0.98] select-none transition-all ${
            viewsChartFilter === 'followers'
              ? 'bg-[#282d35] text-white border-[#38404c]'
              : 'bg-[#14171a] text-[#8e959b] border-[#252932] hover:text-[#d0d4d9]'
          }`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="leading-none text-center font-medium">Followers</span>
        </button>
        <button
          type="button"
          onClick={() => setViewsChartFilter('non_followers')}
          className={`h-[34px] px-4 inline-flex items-center justify-center text-[13.5px] font-medium leading-none rounded-full border outline-none focus:outline-none active:scale-[0.98] select-none transition-all ${
            viewsChartFilter === 'non_followers'
              ? 'bg-[#282d35] text-white border-[#38404c]'
              : 'bg-[#14171a] text-[#8e959b] border-[#252932] hover:text-[#d0d4d9]'
          }`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="leading-none text-center font-medium">Non-followers</span>
        </button>
      </div>

      {/* Chart Canvas Area on Dark Background */}
      <div className="relative flex items-stretch mt-7">
        {/* Y-Axis Labels: 4K, 2K, 0 perfectly aligned with the 3 grid line levels */}
        <div className="relative w-8 h-[104px] shrink-0 text-[11.5px] text-[#8e959b] font-normal tabular-numbers select-none">
          <div className="absolute top-[4px] -translate-y-1/2 right-2">
            <EditableValue
              path="viewsChart.yMax"
              title="Max Y value"
              type="number"
              value={yMax}
              className="text-[11.5px] text-[#8e959b] font-normal"
            >
              {formatYAxis(yMax)}
            </EditableValue>
          </div>
          <div className="absolute top-[52px] -translate-y-1/2 right-2">
            {formatYAxis(Math.round(yMax / 2))}
          </div>
          <div className="absolute top-[100px] -translate-y-1/2 right-2">0</div>
        </div>

        {/* SVG Curve & Axis Container */}
        <div className="relative flex-1 flex flex-col">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="w-full h-[104px] overflow-visible"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Horizontal Grid lines (Top, Mid, Bottom 0) spanning width */}
            <line
              x1="0"
              y1={padTop}
              x2={svgWidth}
              y2={padTop}
              stroke="#20242a"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1={padTop + chartHeight / 2}
              x2={svgWidth}
              y2={padTop + chartHeight / 2}
              stroke="#20242a"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1={padTop + chartHeight}
              x2={svgWidth}
              y2={padTop + chartHeight}
              stroke="#20242a"
              strokeWidth="1"
            />

            {/* "Your typical reel" Dashed Gray Baseline starting from X-axis date value */}
            <path
              d={typicalPathData}
              fill="none"
              stroke="#5c6370"
              strokeWidth="2.2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* "This reel" Vibrant Pink/Magenta Solid Line starting from X-axis date value */}
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
                    r="14"
                    fill="transparent"
                    onMouseEnter={() => setHoverIndex(i)}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleTouch(i);
                    }}
                  />

                  {/* Dot on hover */}
                  {isHovered && (
                    <>
                      <circle cx={c.x} cy={c.y} r="4.5" fill="#FE36FF" />
                      <circle cx={c.x} cy={c.y} r="2" fill="#ffffff" />
                      <circle cx={c.x} cy={c.typY} r="3.5" fill="#5c6370" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip on hover/touch */}
          {hoverIndex !== null && coords[hoverIndex] && (
            <div
              className="absolute pointer-events-none -top-7 bg-[#1c2024] text-white text-[10.5px] font-semibold px-2 py-1 rounded shadow-lg border border-[#2d333b] whitespace-nowrap z-20 transition-transform duration-150"
              style={{
                left: `${(coords[hoverIndex].x / svgWidth) * 100}%`,
                transform:
                  coords[hoverIndex].x > svgWidth * 0.75
                    ? 'translate(-90%, 0)'
                    : coords[hoverIndex].x < svgWidth * 0.25
                    ? 'translate(-10%, 0)'
                    : 'translate(-50%, 0)',
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

          {/* Date Markers on X-Axis right below 0 grid line: 29 Sept, 30 Sept, 1 Oct */}
          <div className="flex justify-between items-center text-[11.5px] text-[#8e959b] pt-2.5 px-0 select-none">
            {dates.map((dateStr, idx) => (
              <EditableValue
                key={idx}
                path={`viewsChart.dates.${idx}`}
                title={`Date label ${idx + 1}`}
                type="date"
                value={dateStr}
                className="text-[11.5px] text-[#8e959b] font-normal"
              >
                {dateStr}
              </EditableValue>
            ))}
          </div>

          {/* Dual series legend matching Instagram: ● This reel   ● Your typical reel */}
          <div className="flex items-center justify-between pt-3 pb-0.5 px-0 select-none text-[11px] text-[#8e959b]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-[6px] h-[6px] rounded-full bg-[#FE36FF] shrink-0" />
                <span className="text-[#8e959b] font-normal">This reel</span>
              </div>
              <div
                onClick={() => isEditMode && setIsTypicalModalOpen(true)}
                className={`flex items-center gap-1.5 ${
                  isEditMode ? 'cursor-pointer hover:text-white transition-colors group' : ''
                }`}
                title={isEditMode ? 'Click to edit typical video graph' : undefined}
              >
                <span className="w-[6px] h-[6px] rounded-full bg-[#5c6370] shrink-0 group-hover:bg-[#8e959b] transition-colors" />
                <span className={`font-normal ${isEditMode ? 'group-hover:text-white underline-offset-2 group-hover:underline' : 'text-[#8e959b]'}`}>
                  Your typical reel
                </span>
                {isEditMode && (
                  <span className="text-[9px] text-[#8e959b] bg-[#1a1e24] px-1 rounded border border-[#2b313a] group-hover:border-[#5c6370]">
                    edit
                  </span>
                )}
              </div>
            </div>

            {isEditMode && (
              <button
                type="button"
                onClick={() => setIsDateShiftModalOpen(true)}
                className="flex items-center gap-1 text-[11px] text-[#FE36FF] hover:underline transition-colors py-0.5 px-1.5 rounded-md hover:bg-[#1a1e24]"
                title="Shift reel graph back to an earlier date"
              >
                <Calendar className="w-3 h-3 text-[#FE36FF]" />
                <span>Shift date</span>
              </button>
            )}
          </div>
        </div>

        {/* Direct edit & image upload trigger in edit mode */}
        {isEditMode && (
          <div className="absolute -top-7 right-0 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsTypicalModalOpen(true)}
              className="text-[10.5px] text-[#8e959b] hover:text-white hover:underline font-semibold flex items-center gap-1 bg-[#1c2024] px-2 py-0.5 rounded-md border border-[#2d333b]"
              title="Edit typical video baseline graph"
            >
              <TrendingUp className="w-3 h-3 text-[#8e959b]" />
              <span>Edit Typical</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDateShiftModalOpen(true)}
              className="text-[10.5px] text-[#FE36FF] hover:underline font-semibold flex items-center gap-1 bg-[#1c2024] px-2 py-0.5 rounded-md border border-[#2d333b]"
            >
              <Calendar className="w-3 h-3" />
              <span>Shift date</span>
            </button>
            <button
              type="button"
              onClick={() => setIsChartModalOpen(true)}
              className="text-[10.5px] text-[#ec008c] hover:underline font-semibold flex items-center gap-1 bg-[#1c2024] px-2 py-0.5 rounded-md border border-[#2d333b]"
            >
              <span>📷 Edit Chart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
