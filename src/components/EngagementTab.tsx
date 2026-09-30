import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { InfoCircleIcon } from './InstagramIcons';
import { DEFAULT_REEL_DATA } from '../data/defaultData';
import { Play, Calendar } from 'lucide-react';

export const EngagementTab: React.FC = () => {
  const { data, isEditMode, setIsMediaModalOpen, setIsDateShiftModalOpen } = useInsights();
  const [hoverPoint, setHoverPoint] = useState<{ time: string; percentage: number; x: number } | null>(null);

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

  const whenLikedPoints =
    data?.engagement?.whenLikedPoints && data.engagement.whenLikedPoints.length > 0
      ? data.engagement.whenLikedPoints
      : DEFAULT_REEL_DATA.engagement.whenLikedPoints;
  const svgWidth = 320;
  const svgHeight = 85;
  const padLeft = 10;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 20;
  const width = svgWidth - padLeft - padRight;
  const height = svgHeight - padTop - padBottom;

  const coords = whenLikedPoints.map((pt, i) => {
    const x = padLeft + (i / (whenLikedPoints.length - 1 || 1)) * width;
    const y = padTop + height - (pt.percentage / 100) * height;
    return { x, y, pt };
  });

  const pathData = coords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="flex flex-col px-4 pt-[54px] pb-14 w-full text-white select-none bg-[#0d0f12]">
      {/* 1. Actions after viewing */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
          <span className="leading-none">Actions after viewing</span>
          <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-[17.5px] font-normal text-white">Follows</span>
          <EditableValue
            path="engagement.followsAfterViewing"
            title="Follows after viewing"
            type="number"
            value={data.engagement.followsAfterViewing}
            className="text-[17.5px] font-normal text-white tabular-numbers"
          >
            {formatNumber(data.engagement.followsAfterViewing)}
          </EditableValue>
        </div>
      </section>

      {/* 2. Interactions Breakdown */}
      <section className="flex flex-col gap-2 mt-10">
        <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
          <span className="leading-none">Interactions</span>
          <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
        </div>

        <div className="flex flex-col gap-4 py-1.5">
          {/* Likes */}
          <div className="flex items-center justify-between">
            <span className="text-[17.5px] font-normal text-white">Likes</span>
            <EditableValue
              path="topMetrics.likes"
              title="Likes count"
              type="number"
              value={data.topMetrics.likes}
              className="text-[17.5px] font-normal text-white tabular-numbers"
            >
              {formatNumber(data.topMetrics.likes)}
            </EditableValue>
          </div>

          {/* Comments */}
          <div className="flex items-center justify-between">
            <span className="text-[17.5px] font-normal text-white">Comments</span>
            <EditableValue
              path="topMetrics.comments"
              title="Comments count"
              type="number"
              value={data.topMetrics.comments}
              className="text-[17.5px] font-normal text-white tabular-numbers"
            >
              {formatNumber(data.topMetrics.comments)}
            </EditableValue>
          </div>

          {/* Reposts */}
          <div className="flex items-center justify-between">
            <span className="text-[17.5px] font-normal text-white">Reposts</span>
            <EditableValue
              path="topMetrics.reposts"
              title="Reposts count"
              type="number"
              value={data.topMetrics.reposts}
              className="text-[17.5px] font-normal text-white tabular-numbers"
            >
              {formatNumber(data.topMetrics.reposts)}
            </EditableValue>
          </div>

          {/* Shares */}
          <div className="flex items-center justify-between">
            <span className="text-[17.5px] font-normal text-white">Shares</span>
            <EditableValue
              path="topMetrics.shares"
              title="Shares count"
              type="number"
              value={data.topMetrics.shares}
              className="text-[17.5px] font-normal text-white tabular-numbers"
            >
              {formatNumber(data.topMetrics.shares)}
            </EditableValue>
          </div>

          {/* Saves */}
          <div className="flex items-center justify-between">
            <span className="text-[17.5px] font-normal text-white">Saves</span>
            <EditableValue
              path="topMetrics.saves"
              title="Saves count"
              type="number"
              value={data.topMetrics.saves}
              className="text-[17.5px] font-normal text-white tabular-numbers"
            >
              {formatNumber(data.topMetrics.saves)}
            </EditableValue>
          </div>
        </div>
      </section>

      {/* 3. When people liked your reel */}
      <section className="flex flex-col gap-2 mt-[48px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
            <span className="leading-none">When people liked your reel</span>
            <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
          </div>

          {/* Shift date button: ONLY shown in edit mode */}
          {isEditMode && (
            <button
              type="button"
              onClick={() => setIsDateShiftModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-[#FE36FF] hover:underline transition-colors py-0.5 px-1.5 rounded-md hover:bg-[#1a1e24]"
              title="Shift reel graph date"
            >
              <Calendar className="w-3 h-3 text-[#FE36FF]" />
              <span>Shift date</span>
            </button>
          )}
        </div>

        {/* Center Thumbnail with Play Button matching Instagram reference */}
        <div className="flex justify-center my-3">
          <div
            onClick={() => isEditMode && setIsMediaModalOpen(true)}
            className="relative w-[78px] h-[112px] rounded-[8px] overflow-hidden bg-[#000000] border border-[#222228] shadow cursor-pointer group"
          >
            {data.mediaType === 'video' ? (
              <video src={data.mediaUrl} className="w-full h-full object-cover" muted playsInline preload="metadata" />
            ) : (
              <img
                src={data.mediaUrl}
                alt="Reel thumbnail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="w-5 h-5 text-white fill-white/80" />
            </div>
          </div>
        </div>

        {/* When liked chart */}
        <div className="relative flex items-stretch mt-1">
          {/* Y-Axis (80%, 40%, 0%) */}
          <div className="flex flex-col justify-between items-end pr-2 text-[10px] text-[#8e959b] font-normal w-8 pb-5 tabular-numbers">
            <span>80%</span>
            <span>40%</span>
            <span>0%</span>
          </div>

          <div className="relative flex-1">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              className="w-full h-[80px] overflow-visible"
              onMouseLeave={() => setHoverPoint(null)}
            >
              <line x1={padLeft} y1={padTop} x2={svgWidth - padRight} y2={padTop} stroke="#20242a" strokeWidth="1" />
              <line x1={padLeft} y1={padTop + height / 2} x2={svgWidth - padRight} y2={padTop + height / 2} stroke="#20242a" strokeWidth="1" />
              <line x1={padLeft} y1={padTop + height} x2={svgWidth - padRight} y2={padTop + height} stroke="#20242a" strokeWidth="1" />

              <path
                d={pathData}
                fill="none"
                stroke="#FE36FF"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {coords.map((c, i) => (
                <circle
                  key={i}
                  cx={c.x}
                  cy={c.y}
                  r="10"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverPoint({ time: c.pt.time, percentage: c.pt.percentage, x: c.x })}
                  onTouchStart={() => setHoverPoint({ time: c.pt.time, percentage: c.pt.percentage, x: c.x })}
                />
              ))}

              {hoverPoint && (
                <>
                  <circle cx={hoverPoint.x} cy={padTop + height - (hoverPoint.percentage / 100) * height} r="4" fill="#FE36FF" />
                  <circle cx={hoverPoint.x} cy={padTop + height - (hoverPoint.percentage / 100) * height} r="1.8" fill="#ffffff" />
                </>
              )}
            </svg>

            {/* Hover tooltip */}
            {hoverPoint && (
              <div
                className="absolute -top-3.5 bg-[#1c2024] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow border border-[#2d333b] -translate-x-1/2 pointer-events-none z-10 whitespace-nowrap"
                style={{
                  left: `${(hoverPoint.x / svgWidth) * 100}%`,
                }}
              >
                {hoverPoint.percentage}% at {hoverPoint.time}
              </div>
            )}

            {/* X-Axis time boundaries */}
            <div className="flex justify-between items-center text-[10.5px] text-[#8e959b] pt-1 px-1">
              <span>0:00</span>
              <span>{data.watchTimeRetention.videoDuration}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
