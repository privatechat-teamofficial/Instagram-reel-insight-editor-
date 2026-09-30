import React from 'react';
import { useInsights } from '../context/InsightsContext';
import { TabType } from '../types/insights';

export const TabsNavigation: React.FC = () => {
  const { activeTab, setActiveTab, setAudienceSubTab } = useInsights();

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'audience', label: 'Audience' },
  ];

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="relative w-full border-b border-[#1c2025] bg-[#0d0f12] select-none shrink-0">
      <div className="grid grid-cols-3 w-full relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (activeTab !== tab.id) {
                  setActiveTab(tab.id);
                  if (tab.id === 'audience') {
                    setAudienceSubTab('age');
                  }
                  const container = document.getElementById('reel-insights-preview-container');
                  if (container) {
                    container.scrollTop = 0;
                  }
                }
              }}
              className={`pt-2.5 pb-1.5 flex items-center justify-center z-10 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none select-none ${
                isActive ? 'text-white font-medium' : 'text-[#8a9199] hover:text-[#d0d4d9]'
              }`}
            >
              <span className="text-[15.5px] tracking-[0.015em] font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Smoothly sliding horizontal strip indicator */}
        <div
          className="absolute -bottom-[1px] top-0 left-0 w-1/3 flex items-end justify-center pointer-events-none transition-transform duration-200 ease-out z-0 will-change-transform"
          style={{
            transform: `translateX(${safeIndex * 100}%)`,
          }}
        >
          <div className="w-[84px] h-[2px] bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};
