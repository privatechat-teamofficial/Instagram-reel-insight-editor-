import React, { useRef } from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { HeartIcon, CommentIcon, RepostIcon, ShareIcon, BookmarkIcon } from './InstagramIcons';
import { Play } from 'lucide-react';
import { DEFAULT_PODCAST_THUMBNAIL } from '../assets/defaultReelThumbnail';

export const ReelMediaHeader: React.FC = () => {
  const { data, isEditMode, setIsMediaModalOpen } = useInsights();
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatCount = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="flex flex-col items-center pt-1 pb-2.5 px-3 select-none shrink-0 bg-[#0d0f12]">
      {/* Reel Preview: ~132 × 235px (9:16) matching Instagram reference scale */}
      <div
        onClick={() => isEditMode && setIsMediaModalOpen(true)}
        className={`relative w-[132px] h-[235px] aspect-[9/16] rounded-[10px] overflow-hidden bg-[#030405] mb-3.5 shadow-md transition-all duration-150 shrink-0 ${
          isEditMode ? 'cursor-pointer ring-2 ring-[#ec008c]' : ''
        }`}
        title={isEditMode ? 'Click to change media' : undefined}
      >
        {data.mediaType === 'video' ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={data.mediaUrl}
              className="w-full h-full object-cover"
              playsInline
              muted
              loop
              autoPlay
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/15 pointer-events-none">
              <Play className="w-6 h-6 text-white/90 fill-white/70 drop-shadow" />
            </div>
          </div>
        ) : (
          <img
            src={data.mediaUrl || DEFAULT_PODCAST_THUMBNAIL}
            alt="Reel Preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_PODCAST_THUMBNAIL;
            }}
          />
        )}
      </div>

      {/* 5 Metric Icons & Counts: Like, Comment, Repost, Share, Save (expanded across Overview to Audience) */}
      <div className="w-full grid grid-cols-5 text-center px-2 mt-0.5 mb-1.5">
        {/* Likes */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-0.5">
          <HeartIcon className="w-[19px] h-[19px] text-white" />
          <EditableValue
            path="topMetrics.likes"
            title="Likes count"
            type="number"
            value={data.topMetrics.likes}
            className="text-[13px] font-normal text-white tabular-numbers leading-tight mt-0.5"
          >
            {formatCount(data.topMetrics.likes)}
          </EditableValue>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-0.5">
          <CommentIcon className="w-[19px] h-[19px] text-white" />
          <EditableValue
            path="topMetrics.comments"
            title="Comments count"
            type="number"
            value={data.topMetrics.comments}
            className="text-[13px] font-normal text-white tabular-numbers leading-tight mt-0.5"
          >
            {formatCount(data.topMetrics.comments)}
          </EditableValue>
        </div>

        {/* Reposts */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-0.5">
          <RepostIcon className="w-[19px] h-[19px] text-white" />
          <EditableValue
            path="topMetrics.reposts"
            title="Reposts count"
            type="number"
            value={data.topMetrics.reposts}
            className="text-[13px] font-normal text-white tabular-numbers leading-tight mt-0.5"
          >
            {formatCount(data.topMetrics.reposts)}
          </EditableValue>
        </div>

        {/* Shares */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-0.5">
          <ShareIcon className="w-[19px] h-[19px] text-white" />
          <EditableValue
            path="topMetrics.shares"
            title="Shares count"
            type="number"
            value={data.topMetrics.shares}
            className="text-[13px] font-normal text-white tabular-numbers leading-tight mt-0.5"
          >
            {formatCount(data.topMetrics.shares)}
          </EditableValue>
        </div>

        {/* Saves */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-0.5">
          <BookmarkIcon className="w-[19px] h-[19px] text-white" />
          <EditableValue
            path="topMetrics.saves"
            title="Saves count"
            type="number"
            value={data.topMetrics.saves}
            className="text-[13px] font-normal text-white tabular-numbers leading-tight mt-0.5"
          >
            {formatCount(data.topMetrics.saves)}
          </EditableValue>
        </div>
      </div>
    </div>
  );
};
