import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import { HeaderBackIcon, HeaderInsightsIcon, ThreeDotsIcon } from './InstagramIcons';

export const Header: React.FC = () => {
  const { isEditMode, toggleEditMode, setIsChartModalOpen, setIsPresetsModalOpen, isLoading } = useInsights();
  const [showToast, setShowToast] = useState(false);

  const handleTitleClick = () => {
    toggleEditMode();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div
      className="w-full bg-[#0c1014] select-none shrink-0 px-4 pb-2 z-30 relative"
      style={{
        paddingTop: 'calc(0.5rem + env(safe-area-inset-top, 0px))',
      }}
    >
      {/* Header bar matching Instagram Reel insights screenshot:
          Left back arrow + Left-aligned bold "Reel insights" title
          Right analytics trend line + Vertical three dots menu
      */}
      <div className="flex items-center justify-between h-[48px]">
        {/* Left: Back arrow + Left-aligned "Reel insights" title */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Back"
            className="text-white hover:opacity-80 transition-opacity flex items-center justify-center shrink-0"
          >
            <HeaderBackIcon className="w-[23px] h-[23px]" />
          </button>

          <div
            onClick={handleTitleClick}
            role="button"
            tabIndex={0}
            title="Tap to toggle Edit Mode"
            className="flex items-center gap-1.5 cursor-pointer select-none"
          >
            <h1 className="text-[21px] font-bold text-white tracking-tight leading-none">
              Reel insights
            </h1>
            {isEditMode && (
              <span className="w-2 h-2 rounded-full bg-[#f00078] animate-pulse ml-0.5" title="Edit Mode Active" />
            )}
          </div>
        </div>

        {/* Right: Trend line icon & Three dots menu */}
        <div
          className={`flex items-center gap-4 text-white transition-opacity duration-300 ${
            isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={() => setIsChartModalOpen(true)}
            aria-label="Views Chart"
            className="hover:opacity-80 transition-opacity p-0.5 flex items-center justify-center"
            title="Edit Views Chart"
          >
            <HeaderInsightsIcon className="w-[23.5px] h-[23.5px]" />
          </button>
          <button
            type="button"
            onClick={() => setIsPresetsModalOpen(true)}
            aria-label="Options"
            className="hover:opacity-80 transition-opacity p-0.5 flex items-center justify-center"
            title="Options & Presets"
          >
            <ThreeDotsIcon className="w-[21px] h-[21px]" />
          </button>
        </div>
      </div>

      {/* Temporary toast notification when toggling edit mode */}
      {showToast && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-[#1c2024] text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full shadow-xl border border-[#2d333b] pointer-events-none z-50 animate-in fade-in duration-150"
          style={{
            top: 'calc(3.25rem + env(safe-area-inset-top, 0px))',
          }}
        >
          {isEditMode ? 'Edit Mode ON · Tap any value to edit' : 'Edit Mode OFF · Clean Preview'}
        </div>
      )}
    </div>
  );
};
