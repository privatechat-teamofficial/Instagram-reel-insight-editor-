import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { InfoCircleIcon } from './InstagramIcons';
import { Play } from 'lucide-react';

export const EngagementTab: React.FC = () => {
  const { data, isEditMode, setIsMediaModalOpen } = useInsights();
  const [hoverPoint, setHoverPoint] = useState<{ time: string; percentage: number; x: number } | null>(null);

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

  const whenLikedPoints = data.engagement.whenLikedPoints;
  const svgWidth = 320;
  const svgHeight = 90;
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
    <div className="flex flex-col gap-6 px-4 py-4 max-w-md mx-auto text-[#f5f5f5] select-none">
      {/* 1. Actions after viewing */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
          <h2>Actions after viewing</h2>
          <InfoCircleIcon className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center justify-between py-2 border-b border-[#181818]">
          <span className="text-[14px] font-medium text-[#f5f5f5]">Follows</span>
          <EditableValue
            path="engagement.followsAfterViewing"
            title="Follows after viewing"
            type="number"
            value={data.engagement.followsAfterViewing}
            className="text-[14px] font-semibold text-[#f5f5f5] tabular-numbers"
          >
            {formatNumber(data.engagement.followsAfterViewing)}
          </EditableValue>
        </div>
      </section>

      {/* 2. Interactions Breakdown */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
          <h2>Interactions</h2>
          <InfoCircleIcon className="w-3.5 h-3.5" />
        </div>

        <div className="flex flex-col divide-y divide-[#181818]">
          {/* Likes */}
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] font-medium text-[#f5f5f5]">Likes</span>
            <EditableValue
              path="topMetrics.likes"
              title="Likes count"
              type="number"
              value={data.topMetrics.likes}
              className="text-[14px] font-semibold text-[#f5f5f5] tabular-numbers"
            >
              {formatNumber(data.topMetrics.likes)}
            </EditableValue>
          </div>

          {/* Comments */}
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] font-medium text-[#f5f5f5]">Comments</span>
            <EditableValue
              path="topMetrics.comments"
              title="Comments count"
              type="number"
              value={data.topMetrics.comments}
              className="text-[14px] font-semibold text-[#f5f5f5] tabular-numbers"
            >
              {formatNumber(data.topMetrics.comments)}
            </EditableValue>
          </div>

          {/* Reposts */}
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] font-medium text-[#f5f5f5]">Reposts</span>
            <EditableValue
              path="topMetrics.reposts"
              title="Reposts count"
              type="number"
              value={data.topMetrics.reposts}
              className="text-[14px] font-semibold text-[#f5f5f5] tabular-numbers"
            >
              {formatNumber(data.topMetrics.reposts)}
            </EditableValue>
          </div>

          {/* Shares */}
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] font-medium text-[#f5f5f5]">Shares</span>
            <EditableValue
              path="topMetrics.shares"
              title="Shares count"
              type="number"
              value={data.topMetrics.shares}
              className="text-[14px] font-semibold text-[#f5f5f5] tabular-numbers"
            >
              {formatNumber(data.topMetrics.shares)}
            </EditableValue>
          </div>

          {/* Saves */}
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] font-medium text-[#f5f5f5]">Saves</span>
            <EditableValue
              path="topMetrics.saves"
              title="Saves count"
              type="number"
              value={data.topMetrics.saves}
              className="text-[14px] font-semibold text-[#f5f5f5] tabular-numbers"
            >
              {formatNumber(data.topMetrics.saves)}
            </EditableValue>
          </div>
        </div>
      </section>

      {/* 3. When people liked your reel */}
      <section className="flex flex-col gap-3 border-t border-[#181818] pt-4 mb-8">
        <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
          <h2>When people liked your reel</h2>
          <InfoCircleIcon className="w-3.5 h-3.5" />
        </div>

        {/* Center Thumbnail */}
        <div className="flex justify-center my-2">
          <div
            onClick={() => isEditMode && setIsMediaModalOpen(true)}
            className="relative w-24 h-32 rounded-lg overflow-hidden bg-[#181818] border border-[#262626] shadow cursor-pointer group"
          >
            {data.mediaType === 'video' ? (
              <video src={data.mediaUrl} className="w-full h-full object-cover" muted />
            ) : (
              <img
                src={data.mediaUrl}
                alt="Reel thumbnail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="w-6 h-6 text-white fill-white/80" />
            </div>
          </div>
        </div>

        {/* When liked chart */}
        <div className="relative flex items-stretch mt-1">
          {/* Y-Axis (80%, 40%, 0%) */}
          <div className="flex flex-col justify-between items-end pr-2 text-[10px] text-[#8e8e8e] font-medium w-9 pb-5 tabular-numbers">
            <span>80%</span>
            <span>40%</span>
            <span>0%</span>
          </div>

          <div className="relative flex-1">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-[90px] overflow-visible"
              onMouseLeave={() => setHoverPoint(null)}
            >
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
                y1={padTop + height / 2}
                x2={svgWidth - padRight}
                y2={padTop + height / 2}
                stroke="#262626"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1={padLeft}
                y1={padTop + height}
                x2={svgWidth - padRight}
                y2={padTop + height}
                stroke="#262626"
                strokeWidth="1"
              />

              <path
                d={pathData}
                fill="none"
                stroke="#d9287a"
                strokeWidth="3.2"
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
            </svg>

            {/* Hover tooltip */}
            {hoverPoint && (
              <div
                className="absolute -top-3 bg-[#1e1e1e] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow border border-[#333333] -translate-x-1/2 pointer-events-none z-10 whitespace-nowrap"
                style={{
                  left: `${(hoverPoint.x / svgWidth) * 100}%`,
                }}
              >
                {hoverPoint.percentage}% at {hoverPoint.time}
              </div>
            )}

            {/* X-Axis time boundaries */}
            <div className="flex justify-between items-center text-[10px] text-[#8e8e8e] pt-1 px-1">
              <span>0:00</span>
              <span>{data.watchTimeRetention.videoDuration}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
