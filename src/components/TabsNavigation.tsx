import React from 'react';
import { useInsights } from '../context/InsightsContext';
import { TabType } from '../types/insights';

export const TabsNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useInsights();

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'audience', label: 'Audience' },
  ];

  return (
    <div className="w-full border-b border-[#262626] bg-[#000000] select-none">
      <div className="grid grid-cols-3 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-3.5 text-center text-[14px] font-medium transition-colors ${
                isActive ? 'text-[#ffffff] font-semibold' : 'text-[#8e8e8e] hover:text-[#cccccc]'
              }`}
            >
              <span>{tab.label}</span>
              {/* Instagram style white underline indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffffff] rounded-t-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
