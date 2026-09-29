import React from 'react';
import { ArrowLeft, MoreVertical, Sparkles } from 'lucide-react';
import { useInsights } from '../context/InsightsContext';
import { TrendLineIcon } from './InstagramIcons';

export const Header: React.FC = () => {
  const { isEditMode, toggleEditMode, setIsChartModalOpen, setIsPresetsModalOpen } = useInsights();

  return (
    <div className="sticky top-0 z-30 bg-[#000000] border-b border-[#181818]/60 select-none">
      {/* Optional Android Status Bar look for hyper-realism */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[11px] text-[#a0a0a0] font-medium tracking-tight">
        <span>9:49</span>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-[10px]">5G</span>
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3C7.5 3 3.75 4.8 1 7.7L12 21 23 7.7C20.25 4.8 16.5 3 12 3z" />
          </svg>
          <span className="text-[10px]">38%</span>
          <div className="w-4 h-2 border border-[#a0a0a0] rounded-xs p-0.5 flex items-center">
            <div className="w-[40%] h-full bg-[#a0a0a0]" />
          </div>
        </div>
      </div>

      {/* Main Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 min-h-[48px]">
        {/* Left: Back Arrow */}
        <button
          type="button"
          aria-label="Back"
          className="p-1 -ml-1 text-[#ffffff] hover:text-gray-300 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center: Title with click-to-edit trigger */}
        <div
          onClick={toggleEditMode}
          role="button"
          tabIndex={0}
          title="Tap here to toggle Edit Mode"
          className="flex items-center gap-1.5 cursor-pointer group px-2 py-1 rounded-md transition-all duration-200 active:scale-98"
        >
          <h1 className="text-[17px] font-semibold text-[#ffffff] tracking-tight group-hover:text-pink-400 transition-colors">
            Reel Insights
          </h1>

          {/* Edit Mode indicator badge */}
          {isEditMode ? (
            <span className="flex items-center gap-1 bg-pink-600/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm animate-subtle-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              EDITING
            </span>
          ) : (
            <span className="opacity-0 group-hover:opacity-60 text-[10px] text-gray-400 transition-opacity">
              (tap to edit)
            </span>
          )}
        </div>

        {/* Right: Analytics Icon & 3-dot Menu */}
        <div className="flex items-center gap-3 text-[#ffffff]">
          <button
            type="button"
            onClick={() => setIsChartModalOpen(true)}
            aria-label="View Chart Settings"
            className="p-1 hover:text-pink-400 active:scale-95 transition-colors"
            title="Edit Views Chart"
          >
            <TrendLineIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsPresetsModalOpen(true)}
            aria-label="Presets and Options"
            className="p-1 -mr-1 hover:text-pink-400 active:scale-95 transition-colors"
            title="Presets & Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
