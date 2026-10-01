import React, { useState, useRef } from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { ViewsLineChart } from './ViewsLineChart';
import { DEFAULT_REEL_DATA } from '../data/defaultData';
import { ImpactFactor } from '../types/insights';
import {
  InfoCircleIcon,
  SkipRateIcon,
  ShareIcon,
  HeartIcon,
  BookmarkIcon,
  RepostIcon,
  CommentIcon,
} from './InstagramIcons';
import { Plus, Trash2, Play, Calendar } from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    data,
    setData,
    isEditMode,
    addSourceItem,
    removeSourceItem,
    setIsMediaModalOpen,
    setIsDateShiftModalOpen,
  } = useInsights();
  const [retentionHover, setRetentionHover] = useState<{ time: string; percentage: number; x: number } | null>(null);
  const retTouchTimerRef = useRef<number | null>(null);

  const handleRetTouch = (pointData: { time: string; percentage: number; x: number }) => {
    setRetentionHover(pointData);
    if (retTouchTimerRef.current) clearTimeout(retTouchTimerRef.current);
    retTouchTimerRef.current = window.setTimeout(() => {
      setRetentionHover(null);
    }, 2500);
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

  const impactList =
    data?.impactFactors && data.impactFactors.length > 0
      ? data.impactFactors
      : DEFAULT_REEL_DATA.impactFactors;

  const retentionData =
    data?.watchTimeRetention?.points && data.watchTimeRetention.points.length > 0
      ? data.watchTimeRetention
      : DEFAULT_REEL_DATA.watchTimeRetention;

  const sourcesList =
    data?.topSources && data.topSources.length > 0
      ? data.topSources
      : DEFAULT_REEL_DATA.topSources;

  const removeImpactItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      impactFactors: (prev.impactFactors || []).filter((item) => item.id !== id),
    }));
  };

  const addImpactItem = () => {
    setData((prev) => ({
      ...prev,
      impactFactors: [
        ...(prev.impactFactors || DEFAULT_REEL_DATA.impactFactors),
        {
          id: `impact-${Date.now()}`,
          name: 'Repost rate',
          rate: 1.2,
          status: 'Lower',
          iconType: 'repost',
        },
      ],
    }));
  };

  const cycleIcon = (idx: number) => {
    if (!isEditMode) return;
    const icons: Array<ImpactFactor['iconType']> = ['skip', 'share', 'like', 'save', 'repost', 'comment'];
    const current = impactList[idx]?.iconType || 'skip';
    const next = icons[(icons.indexOf(current) + 1) % icons.length];
    setData((prev) => {
      const list = [...(prev.impactFactors || DEFAULT_REEL_DATA.impactFactors)];
      list[idx] = { ...list[idx], iconType: next };
      return { ...prev, impactFactors: list };
    });
  };

  // All symbol heights and widths are identical to the like symbol (HeartIcon)
  const getImpactIcon = (iconType?: string) => {
    const symbolClass = 'w-[19px] h-[19px] text-white';
    switch (iconType) {
      case 'skip':
        return <SkipRateIcon className={symbolClass} />;
      case 'share':
        return <ShareIcon className={symbolClass} />;
      case 'like':
        return <HeartIcon className={symbolClass} />;
      case 'save':
        return <BookmarkIcon className={symbolClass} />;
      case 'repost':
        return <RepostIcon className={symbolClass} />;
      case 'comment':
        return <CommentIcon className={symbolClass} />;
      default:
        return <SkipRateIcon className={symbolClass} />;
    }
  };

  const formatPercent = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? '0.0%' : `${num.toFixed(1)}%`;
  };

  // Retention chart coordinates
  const retentionPoints = retentionData.points || [];
  const retSvgWidth = 320;
  const retSvgHeight = 114;
  const retPadLeft = 10;
  const retPadRight = 10;
  const retPadTop = 6;
  const retPadBottom = 12;
  const retWidth = retSvgWidth - retPadLeft - retPadRight;
  const retHeight = retSvgHeight - retPadTop - retPadBottom;

  const retCoords = retentionPoints.map((pt, i) => {
    const pct = Number(pt?.percentage) || 0;
    const x = retPadLeft + (i / (retentionPoints.length - 1 || 1)) * retWidth;
    const y = retPadTop + retHeight - (pct / 100) * retHeight;
    return { x, y, pt };
  });

  const retPathData = retCoords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="flex flex-col px-4 pt-6 pb-14 w-full text-white select-none bg-[#0d0f12]">
      {/* 1. Summary Section */}
      <section className="flex flex-col">
        <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
          <span className="leading-none">Summary</span>
          <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
        </div>

        {/* 2x2 Grid Cards: Roomier cards with #25292E background and rounded corners */}
        <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
          {/* Box 1: Views */}
          <div className="bg-[#25292E] rounded-[14px] px-3.5 py-3 min-h-[76px] flex flex-col justify-between shadow-sm">
            <span className="text-[13px] text-[#8e959b] font-normal leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              Views
            </span>
            <EditableValue
              path="summary.views"
              title="Views"
              type="number"
              value={data.summary.views}
              className="text-[20px] font-bold text-white tracking-tight tabular-numbers leading-tight mt-1"
            >
              {formatNumber(data.summary.views)}
            </EditableValue>
          </div>

          {/* Box 2: Viewers */}
          <div className="bg-[#25292E] rounded-[14px] px-3.5 py-3 min-h-[76px] flex flex-col justify-between shadow-sm">
            <span className="text-[13px] text-[#8e959b] font-normal leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              Viewers
            </span>
            <EditableValue
              path="summary.viewers"
              title="Viewers"
              type="number"
              value={data.summary.viewers}
              className="text-[20px] font-bold text-white tracking-tight tabular-numbers leading-tight mt-1"
            >
              {formatNumber(data.summary.viewers)}
            </EditableValue>
          </div>

          {/* Box 3: Average watch time */}
          <div className="bg-[#25292E] rounded-[14px] px-3.5 py-3 min-h-[76px] flex flex-col justify-between shadow-sm">
            <span className="text-[13px] text-[#8e959b] font-normal leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              Average watch time
            </span>
            <EditableValue
              path="summary.averageWatchTime"
              title="Average watch time"
              type="time"
              value={data.summary.averageWatchTime}
              className="text-[20px] font-bold text-white tracking-tight leading-tight mt-1"
            >
              {data.summary.averageWatchTime}
            </EditableValue>
          </div>

          {/* Box 4: Follows */}
          <div className="bg-[#25292E] rounded-[14px] px-3.5 py-3 min-h-[76px] flex flex-col justify-between shadow-sm">
            <span className="text-[13px] text-[#8e959b] font-normal leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              Follows
            </span>
            <EditableValue
              path="summary.follows"
              title="Follows"
              type="number"
              value={data.summary.follows}
              className="text-[20px] font-bold text-white tracking-tight tabular-numbers leading-tight mt-1"
            >
              {formatNumber(data.summary.follows)}
            </EditableValue>
          </div>
        </div>
      </section>

      {/* 2. Views Over Time Section */}
      <section className="flex flex-col mt-9">
        <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
          <span className="leading-none">Views over time</span>
          <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
        </div>
        <ViewsLineChart />
      </section>

      {/* 3. What Impacts Your Views Section */}
      <section className="flex flex-col mt-9">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
            <span className="leading-none">What impacts your views</span>
            <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
          </div>
          {isEditMode && (
            <button
              type="button"
              onClick={addImpactItem}
              className="text-[#ec008c] hover:opacity-80 text-[11px] font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add metric
            </button>
          )}
        </div>
        <p className="text-[12px] text-[#8e959b] font-normal mt-1">
          Rates are listed in order of importance to reach.
        </p>

        {/* Impact List Rows with no partition horizontal line and vertically aligned lighter circular badges */}
        <div className="flex flex-col mt-3.5">
          {impactList.map((item, idx) => {
            const statusStr = String(item?.status || 'Lower');
            const isGreen =
              statusStr.toLowerCase() === 'lower' || statusStr.toLowerCase() === 'higher';

            return (
              <div key={item?.id || idx} className="flex items-center justify-between py-2.5">
                {/* Left: Vertically aligned circular badge (matching screenshot shade #262c33) & Name */}
                <div className="flex items-center gap-3.5">
                  <div
                    onClick={() => cycleIcon(idx)}
                    className={`w-[38px] h-[38px] rounded-full bg-[#262c33] flex items-center justify-center shrink-0 ${
                      isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-pink-500/50' : ''
                    }`}
                    title={isEditMode ? 'Click to change symbol (Skip, Share, Like, Save, Repost, Comment)' : undefined}
                  >
                    {getImpactIcon(item?.iconType)}
                  </div>
                  <EditableValue
                    path={`impactFactors.${idx}.name`}
                    title="Impact metric name"
                    type="text"
                    value={item?.name || ''}
                    className="text-[14.5px] font-medium text-white"
                  >
                    {item?.name || ''}
                  </EditableValue>
                </div>

                {/* Right: Percentage & Status Tag */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <EditableValue
                      path={`impactFactors.${idx}.rate`}
                      title={`${item?.name || 'Metric'} percentage`}
                      type="percentage"
                      value={item?.rate ?? 0}
                      className="text-[14.5px] font-bold text-white tabular-numbers"
                    >
                      {formatPercent(item?.rate)}
                    </EditableValue>
                    <EditableValue
                      path={`impactFactors.${idx}.status`}
                      title={`${item?.name || 'Metric'} status indicator`}
                      type="status_tag"
                      value={item?.status || 'Lower'}
                      className={`text-[12px] font-medium mt-0.5 ${
                        isGreen ? 'text-[#24c360]' : 'text-[#8e959b]'
                      }`}
                    >
                      {item?.status || 'Lower'}
                    </EditableValue>
                  </div>

                  {isEditMode && impactList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImpactItem(item.id)}
                      className="text-gray-500 hover:text-red-400 p-1 -mr-1"
                      title="Delete impact factor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. How long people watched your reel */}
      <section className="flex flex-col mt-9">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
            <span className="leading-none">How long people watched your reel</span>
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

        {/* Center Thumbnail with Play indicator matching Instagram reference */}
        <div className="flex justify-center mt-4 mb-3">
          <div
            onClick={() => isEditMode && setIsMediaModalOpen(true)}
            className="relative w-[76px] h-[120px] rounded-[8px] overflow-hidden bg-[#000000] border border-[#222228] shadow cursor-pointer group"
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

        {/* Retention Drop Curve */}
        <div className="relative flex items-stretch mt-1">
          {/* Y-Axis (100%, 50%, 0%) */}
          <div className="flex flex-col justify-between items-end pr-2 text-[10px] text-[#8e959b] font-normal w-8 pb-5 tabular-numbers">
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
          </div>

          <div className="relative flex-1">
            <svg
              viewBox={`0 0 ${retSvgWidth} ${retSvgHeight}`}
              preserveAspectRatio="none"
              className="w-full h-[104px] overflow-visible"
              onMouseLeave={() => setRetentionHover(null)}
            >
              {/* Guidelines */}
              <line x1={retPadLeft} y1={retPadTop} x2={retSvgWidth - retPadRight} y2={retPadTop} stroke="#20242a" strokeWidth="1" />
              <line x1={retPadLeft} y1={retPadTop + retHeight / 2} x2={retSvgWidth - retPadRight} y2={retPadTop + retHeight / 2} stroke="#20242a" strokeWidth="1" />
              <line x1={retPadLeft} y1={retPadTop + retHeight} x2={retSvgWidth - retPadRight} y2={retPadTop + retHeight} stroke="#20242a" strokeWidth="1" />

              {/* Retention Pink Curve */}
              <path
                d={retPathData}
                fill="none"
                stroke="#FE36FF"
                strokeWidth="2.8"
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
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleRetTouch({ time: c.pt.time, percentage: c.pt.percentage, x: c.x });
                  }}
                />
              ))}

              {/* Highlight node - only displayed when touched / hovered */}
              {retentionHover && (
                <>
                  <circle
                    cx={retentionHover.x}
                    cy={retPadTop + retHeight - (retentionHover.percentage / 100) * retHeight}
                    r="4"
                    fill="#FE36FF"
                  />
                  <circle
                    cx={retentionHover.x}
                    cy={retPadTop + retHeight - (retentionHover.percentage / 100) * retHeight}
                    r="2"
                    fill="#ffffff"
                  />
                </>
              )}
            </svg>

            {/* Retention Floating Tooltip - only displayed when touched / hovered */}
            {retentionHover && (
              <div
                className="absolute -top-3.5 bg-[#1c2024] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow border border-[#2d333b] pointer-events-none z-10 whitespace-nowrap transition-transform duration-150"
                style={{
                  left: `${(retentionHover.x / retSvgWidth) * 100}%`,
                  transform:
                    retentionHover.x > retSvgWidth * 0.75
                      ? 'translate(-85%, 0)'
                      : retentionHover.x < retSvgWidth * 0.25
                      ? 'translate(-15%, 0)'
                      : 'translate(-50%, 0)',
                }}
              >
                {retentionHover.percentage}%
                <span className="block text-[8.5px] text-[#8e959b] font-normal">
                  {retentionHover.time}
                </span>
              </div>
            )}

            {/* X-Axis time boundaries (0:00 to 0:25) */}
            <div className="flex justify-between items-center text-[10.5px] text-[#8e959b] pt-1 px-1">
              <span>0:00</span>
              <EditableValue
                path="watchTimeRetention.videoDuration"
                title="Video duration"
                type="text"
                value={data.watchTimeRetention.videoDuration}
                className="text-[10.5px] text-[#8e959b]"
              >
                {data.watchTimeRetention.videoDuration}
              </EditableValue>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Top Sources of Views Section */}
      <section className="flex flex-col mt-9">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[16px] font-bold text-white tracking-tight leading-none">
            <span className="leading-none">Top sources of views</span>
            <InfoCircleIcon className="w-[13.5px] h-[13.5px] text-white" />
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={() => addSourceItem('New Source', 5.0)}
              className="text-[#ec008c] hover:opacity-80 text-[11px] font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add source
            </button>
          )}
        </div>

        {/* Source Progress Bars */}
        <div className="flex flex-col gap-5 mt-4">
          {sourcesList.map((source, idx) => (
            <div key={source.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[15px]">
                <div className="flex items-center gap-2">
                  <EditableValue
                    path={`topSources.${idx}.name`}
                    title="Source name"
                    type="text"
                    value={source.name}
                    className="font-normal text-white"
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
                  title={`${source?.name || 'Source'} percentage`}
                  type="percentage"
                  value={source?.percentage ?? 0}
                  className="font-normal text-white tabular-numbers"
                >
                  {formatPercent(source?.percentage)}
                </EditableValue>
              </div>

              {/* Progress Bar (Pink #FE36FF on track #20252e) */}
              <div className="w-full h-[6.5px] bg-[#20252e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FE36FF] rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, Number(source?.percentage) || 0))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
