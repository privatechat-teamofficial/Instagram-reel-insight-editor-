import React, { useRef } from 'react';
import { useInsights } from '../context/InsightsContext';
import { EditableValue } from './EditableValue';
import { HeartIcon, CommentIcon, RepostIcon, ShareIcon, BookmarkIcon } from './InstagramIcons';
import { Upload, Play } from 'lucide-react';

export const ReelMediaHeader: React.FC = () => {
  const { data, isEditMode, setIsMediaModalOpen } = useInsights();
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatCount = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="flex flex-col items-center pt-2 pb-4 px-4 select-none">
      {/* Centered Reel Media Preview */}
      <div className="relative group/media mb-4">
        <div
          onClick={() => isEditMode && setIsMediaModalOpen(true)}
          className={`relative w-[130px] h-[190px] rounded-lg overflow-hidden bg-[#181818] border border-[#262626] shadow-md transition-all duration-200 ${
            isEditMode ? 'cursor-pointer ring-2 ring-pink-500/50 hover:ring-pink-500 hover:scale-[1.02]' : ''
          }`}
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <Play className="w-8 h-8 text-white/90 fill-white/60 drop-shadow-md" />
              </div>
            </div>
          ) : (
            <img
              src={data.mediaUrl}
              alt="Reel Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback styled visual if image url fails
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
          )}

          {/* Edit overlay trigger in edit mode */}
          {isEditMode && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/media:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-center">
              <Upload className="w-5 h-5 text-white animate-bounce" />
              <span className="text-[11px] font-medium text-white leading-tight">Change Media</span>
            </div>
          )}
        </div>

        {/* Change media pill in edit mode */}
        {isEditMode && (
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 transition-all z-10 whitespace-nowrap"
          >
            <Upload className="w-3 h-3" />
            Upload Media
          </button>
        )}
      </div>

      {/* 5 Metric Icons Row */}
      <div className="w-full max-w-[360px] grid grid-cols-5 gap-1 text-center mt-1">
        {/* Likes */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-1">
          <HeartIcon className="w-[22px] h-[22px] text-[#ffffff]" />
          <EditableValue
            path="topMetrics.likes"
            title="Likes count"
            type="number"
            value={data.topMetrics.likes}
            className="text-[13px] font-medium text-[#ffffff] tabular-numbers"
          >
            {formatCount(data.topMetrics.likes)}
          </EditableValue>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-1">
          <CommentIcon className="w-[22px] h-[22px] text-[#ffffff]" />
          <EditableValue
            path="topMetrics.comments"
            title="Comments count"
            type="number"
            value={data.topMetrics.comments}
            className="text-[13px] font-medium text-[#ffffff] tabular-numbers"
          >
            {formatCount(data.topMetrics.comments)}
          </EditableValue>
        </div>

        {/* Reposts */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-1">
          <RepostIcon className="w-[22px] h-[22px] text-[#ffffff]" />
          <EditableValue
            path="topMetrics.reposts"
            title="Reposts count"
            type="number"
            value={data.topMetrics.reposts}
            className="text-[13px] font-medium text-[#ffffff] tabular-numbers"
          >
            {formatCount(data.topMetrics.reposts)}
          </EditableValue>
        </div>

        {/* Shares */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-1">
          <ShareIcon className="w-[22px] h-[22px] text-[#ffffff]" />
          <EditableValue
            path="topMetrics.shares"
            title="Shares count"
            type="number"
            value={data.topMetrics.shares}
            className="text-[13px] font-medium text-[#ffffff] tabular-numbers"
          >
            {formatCount(data.topMetrics.shares)}
          </EditableValue>
        </div>

        {/* Saves */}
        <div className="flex flex-col items-center justify-center gap-1.5 py-1">
          <BookmarkIcon className="w-[22px] h-[22px] text-[#ffffff]" />
          <EditableValue
            path="topMetrics.saves"
            title="Saves count"
            type="number"
            value={data.topMetrics.saves}
            className="text-[13px] font-medium text-[#ffffff] tabular-numbers"
          >
            {formatCount(data.topMetrics.saves)}
          </EditableValue>
        </div>
      </div>
    </div>
  );
};
