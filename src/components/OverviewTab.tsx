import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { ViewsLineChart } from './ViewsLineChart';
import {
  InfoCircleIcon,
  ClockImpactIcon,
  FunnelImpactIcon,
  HeartIcon,
  BookmarkIcon,
  RepostIcon,
  CommentIcon,
} from './InstagramIcons';
import { Plus, Trash2, Play } from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { data, isEditMode, addSourceItem, removeSourceItem, setIsMediaModalOpen } = useInsights();
  const [retentionHover, setRetentionHover] = useState<{ time: string; percentage: number; x: number } | null>(null);

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

  const getImpactIcon = (iconType: string) => {
    switch (iconType) {
      case 'skip':
        return <ClockImpactIcon className="w-5 h-5 text-[#f5f5f5]" />;
      case 'share':
        return <FunnelImpactIcon className="w-5 h-5 text-[#f5f5f5]" />;
      case 'like':
        return <HeartIcon className="w-5 h-5 text-[#f5f5f5]" />;
      case 'save':
        return <BookmarkIcon className="w-5 h-5 text-[#f5f5f5]" />;
      case 'repost':
        return <RepostIcon className="w-5 h-5 text-[#f5f5f5]" />;
      case 'comment':
        return <CommentIcon className="w-5 h-5 text-[#f5f5f5]" />;
      default:
        return <ClockImpactIcon className="w-5 h-5 text-[#f5f5f5]" />;
    }
  };

  // Retention chart coordinates
  const retentionPoints = data.watchTimeRetention.points;
  const retSvgWidth = 320;
  const retSvgHeight = 90;
  const retPadLeft = 10;
  const retPadRight = 10;
  const retPadTop = 10;
  const retPadBottom = 20;
  const retWidth = retSvgWidth - retPadLeft - retPadRight;
  const retHeight = retSvgHeight - retPadTop - retPadBottom;

  const retCoords = retentionPoints.map((pt, i) => {
    const x = retPadLeft + (i / (retentionPoints.length - 1 || 1)) * retWidth;
    const y = retPadTop + retHeight - (pt.percentage / 100) * retHeight;
    return { x, y, pt };
  });

  const retPathData = retCoords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="flex flex-col gap-6 px-4 py-4 max-w-md mx-auto text-[#f5f5f5] select-none">
      {/* 1. Summary Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
          <h2>Summary</h2>
          <InfoCircleIcon className="w-3.5 h-3.5" />
        </div>

        {/* 2x2 Grid Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Views */}
          <div className="bg-[#121212] border border-[#202020] rounded-xl p-3 flex flex-col justify-between min-h-[76px]">
            <span className="text-[12px] text-[#8e8e8e] font-normal">Views</span>
            <EditableValue
              path="summary.views"
              title="Views"
              type="number"
              value={data.summary.views}
              className="text-[19px] font-bold text-[#ffffff] tracking-tight tabular-numbers"
            >
              {formatNumber(data.summary.views)}
            </EditableValue>
          </div>

          {/* Viewers */}
          <div className="bg-[#121212] border border-[#202020] rounded-xl p-3 flex flex-col justify-between min-h-[76px]">
            <span className="text-[12px] text-[#8e8e8e] font-normal">Viewers</span>
            <EditableValue
              path="summary.viewers"
              title="Viewers"
              type="number"
              value={data.summary.viewers}
              className="text-[19px] font-bold text-[#ffffff] tracking-tight tabular-numbers"
            >
              {formatNumber(data.summary.viewers)}
            </EditableValue>
          </div>

          {/* Average watch time */}
          <div className="bg-[#121212] border border-[#202020] rounded-xl p-3 flex flex-col justify-between min-h-[76px]">
            <span className="text-[12px] text-[#8e8e8e] font-normal">Average watch time</span>
            <EditableValue
              path="summary.averageWatchTime"
              title="Average watch time"
              type="time"
              value={data.summary.averageWatchTime}
              className="text-[19px] font-bold text-[#ffffff] tracking-tight"
            >
              {data.summary.averageWatchTime}
            </EditableValue>
          </div>

          {/* Follows */}
          <div className="bg-[#121212] border border-[#202020] rounded-xl p-3 flex flex-col justify-between min-h-[76px]">
            <span className="text-[12px] text-[#8e8e8e] font-normal">Follows</span>
            <EditableValue
              path="summary.follows"
              title="Follows"
              type="number"
              value={data.summary.follows}
              className="text-[19px] font-bold text-[#ffffff] tracking-tight tabular-numbers"
            >
              {formatNumber(data.summary.follows)}
            </EditableValue>
          </div>
        </div>
      </section>

      {/* 2. Views Over Time Section */}
      <section className="flex flex-col gap-1 border-t border-[#181818] pt-4">
        <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
          <h2>Views over time</h2>
          <InfoCircleIcon className="w-3.5 h-3.5" />
        </div>
        <ViewsLineChart />
      </section>

      {/* 3. What Impacts Your Views Section */}
      <section className="flex flex-col gap-2 border-t border-[#181818] pt-4">
        <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
          <h2>What impacts your views</h2>
          <InfoCircleIcon className="w-3.5 h-3.5" />
        </div>
        <p className="text-[12px] text-[#8e8e8e] -mt-1 font-normal">
          Rates are listed in order of importance to reach.
        </p>

        {/* Impact List Rows */}
        <div className="flex flex-col divide-y divide-[#181818] mt-2">
          {data.impactFactors.map((item, idx) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              {/* Left: Icon & Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#181818] flex items-center justify-center">
                  {getImpactIcon(item.iconType)}
                </div>
                <EditableValue
                  path={`impactFactors.${idx}.name`}
                  title="Impact metric name"
                  type="text"
                  value={item.name}
                  className="text-[14px] font-medium text-[#f5f5f5]"
                >
                  {item.name}
                </EditableValue>
              </div>

              {/* Right: Percentage & Status Tag */}
              <div className="flex flex-col items-end">
                <EditableValue
                  path={`impactFactors.${idx}.rate`}
                  title={`${item.name} percentage`}
                  type="percentage"
                  value={item.rate}
                  className="text-[14px] font-semibold text-[#f5f5f5] tabular-numbers"
                >
                  {item.rate.toFixed(1)}%
                </EditableValue>
                <EditableValue
                  path={`impactFactors.${idx}.status`}
                  title={`${item.name} status indicator`}
                  type="status_tag"
                  value={item.status}
                  className="text-[11px] text-[#8e8e8e] font-normal"
                >
                  {item.status}
                </EditableValue>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How long people watched your reel */}
      <section className="flex flex-col gap-3 border-t border-[#181818] pt-4">
        <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
          <h2>How long people watched your reel</h2>
          <InfoCircleIcon className="w-3.5 h-3.5" />
        </div>

        {/* Center Thumbnail with Play indicator */}
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

        {/* Retention Drop Curve */}
        <div className="relative flex items-stretch mt-1">
          {/* Y-Axis (100%, 50%, 0%) */}
          <div className="flex flex-col justify-between items-end pr-2 text-[10px] text-[#8e8e8e] font-medium w-9 pb-5 tabular-numbers">
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
          </div>

          <div className="relative flex-1">
            <svg
              viewBox={`0 0 ${retSvgWidth} ${retSvgHeight}`}
              className="w-full h-[90px] overflow-visible"
              onMouseLeave={() => setRetentionHover(null)}
            >
              {/* Guidelines */}
              <line
                x1={retPadLeft}
                y1={retPadTop}
                x2={retSvgWidth - retPadRight}
                y2={retPadTop}
                stroke="#262626"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1={retPadLeft}
                y1={retPadTop + retHeight / 2}
                x2={retSvgWidth - retPadRight}
                y2={retPadTop + retHeight / 2}
                stroke="#262626"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1={retPadLeft}
                y1={retPadTop + retHeight}
                x2={retSvgWidth - retPadRight}
                y2={retPadTop + retHeight}
                stroke="#262626"
                strokeWidth="1"
              />

              {/* Retention Pink Curve */}
              <path
                d={retPathData}
                fill="none"
                stroke="#d9287a"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Scrubber Nodes */}
              {retCoords.map((c, i) => (
                <circle
                  key={i}
                  cx={c.x}
                  cy={c.y}
                  r="10"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setRetentionHover({ time: c.pt.time, percentage: c.pt.percentage, x: c.x })}
                  onTouchStart={() => setRetentionHover({ time: c.pt.time, percentage: c.pt.percentage, x: c.x })}
                />
              ))}

              {/* Render highlighted point if 58% at 0:03 like in video screenshot */}
              {retCoords[3] && (
                <>
                  <circle cx={retCoords[3].x} cy={retCoords[3].y} r="4" fill="#d9287a" />
                  <circle cx={retCoords[3].x} cy={retCoords[3].y} r="2" fill="#ffffff" />
                </>
              )}
            </svg>

            {/* Retention Floating Tooltip */}
            {(retentionHover || retCoords[3]) && (
              <div
                className="absolute -top-3 bg-[#1e1e1e] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow border border-[#333333] -translate-x-1/2 pointer-events-none z-10 whitespace-nowrap"
                style={{
                  left: `${((retentionHover ? retentionHover.x : retCoords[3].x) / retSvgWidth) * 100}%`,
                }}
              >
                {retentionHover ? `${retentionHover.percentage}%` : '58%'}
                <span className="block text-[9px] text-gray-400">
                  {retentionHover ? retentionHover.time : '0:03'}
                </span>
              </div>
            )}

            {/* X-Axis time boundaries (0:00 to 0:25) */}
            <div className="flex justify-between items-center text-[10px] text-[#8e8e8e] pt-1 px-1">
              <span>0:00</span>
              <EditableValue
                path="watchTimeRetention.videoDuration"
                title="Video duration"
                type="text"
                value={data.watchTimeRetention.videoDuration}
                className="text-[10px] text-[#8e8e8e]"
              >
                {data.watchTimeRetention.videoDuration}
              </EditableValue>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Top Sources of Views Section */}
      <section className="flex flex-col gap-3 border-t border-[#181818] pt-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[16px] font-semibold text-[#ffffff]">
            <h2>Top sources of views</h2>
            <InfoCircleIcon className="w-3.5 h-3.5" />
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={() => addSourceItem('New Source', 5.0)}
              className="text-pink-400 hover:text-pink-300 text-[12px] font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Source
            </button>
          )}
        </div>

        {/* Source Progress Bars */}
        <div className="flex flex-col gap-3.5 mt-1">
          {data.topSources.map((source, idx) => (
            <div key={source.id} className="flex flex-col gap-1.5 group/source">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <EditableValue
                    path={`topSources.${idx}.name`}
                    title="Source name"
                    type="text"
                    value={source.name}
                    className="font-medium text-[#f5f5f5]"
                  >
                    {source.name}
                  </EditableValue>
                  {isEditMode && data.topSources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSourceItem(source.id)}
                      className="text-gray-500 hover:text-red-400 p-0.5"
                      title="Delete source"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <EditableValue
                  path={`topSources.${idx}.percentage`}
                  title={`${source.name} percentage`}
                  type="percentage"
                  value={source.percentage}
                  className="font-medium text-[#f5f5f5] tabular-numbers"
                >
                  {source.percentage.toFixed(1)}%
                </EditableValue>
              </div>

              {/* Progress Bar (Pink) */}
              <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d9287a] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, source.percentage))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
