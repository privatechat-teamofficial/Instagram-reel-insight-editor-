/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { InsightsProvider, useInsights } from './context/InsightsContext';
import { Header } from './components/Header';
import { ReelMediaHeader } from './components/ReelMediaHeader';
import { TabsNavigation } from './components/TabsNavigation';
import { OverviewTab } from './components/OverviewTab';
import { EngagementTab } from './components/EngagementTab';
import { AudienceTab } from './components/AudienceTab';
import { EditModal } from './components/EditModal';
import { MediaUploaderModal } from './components/MediaUploaderModal';
import { ChartEditorModal } from './components/ChartEditorModal';
import { PresetsModal } from './components/PresetsModal';
import { ExportModal } from './components/ExportModal';
import { ShiftGraphDateModal } from './components/ShiftGraphDateModal';
import { TypicalGraphModal } from './components/TypicalGraphModal';
import {
  Download,
  Sparkles,
  Camera,
  RotateCcw,
  Sliders,
  Calendar,
  TrendingUp,
} from 'lucide-react';

const ReelInsightsScreen: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    activeTab,
    isEditMode,
    toggleEditMode,
    setIsExportModalOpen,
    setIsPresetsModalOpen,
    setIsMediaModalOpen,
    setIsChartModalOpen,
    isDateShiftModalOpen,
    setIsDateShiftModalOpen,
    setIsTypicalModalOpen,
    resetToDefaults,
  } = useInsights();

  return (
    <div className="w-full h-full min-h-screen min-h-[100dvh] h-[100dvh] bg-[#0d0f12] flex flex-col p-0 m-0 select-none relative font-acumin overflow-hidden">
      {/* Reel Insights Screen Content Container */}
      <div
        id="reel-insights-preview-container"
        ref={scrollContainerRef}
        className="w-full h-full bg-[#0d0f12] text-white flex flex-col overflow-y-auto overscroll-y-contain overflow-x-hidden selection:bg-[#ec008c]/20 font-acumin"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Header: Back arrow · Reel insights · Insights trend · Options (Fixed & never stretches) */}
        <Header />

        {/* Stable Content Layer */}
        <div className="flex-1 flex flex-col w-full">
          {/* Reel Video/Image Preview & Top 5 Metrics (Likes, Comments, Reposts, Shares, Saves) */}
          <ReelMediaHeader />

          {/* Horizontal Tabs: Overview | Engagement | Audience */}
          <TabsNavigation />

          {/* Active Tab Content - kept mounted to prevent DOM unmount flicker and tablet layout collapse */}
          <div className="flex-1 w-full bg-[#0d0f12]">
            <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
              <OverviewTab />
            </div>
            <div className={activeTab === 'engagement' ? 'block' : 'hidden'}>
              <EngagementTab />
            </div>
            <div className={activeTab === 'audience' ? 'block' : 'hidden'}>
              <AudienceTab />
            </div>
          </div>

          {/* Bottom spacer for comfortable scrolling above Android gesture navigation bar */}
          <div
            className="w-full h-12 lg:h-6 shrink-0 bg-[#0d0f12]"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          />
        </div>
      </div>

      {/* Floating Bottom Quick Bar on Mobile & Desktop (only shown in editing mode, keeping clean view in preview mode) */}
      {isEditMode && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-40 flex lg:hidden items-center gap-2 bg-[#161a1f]/95 backdrop-blur-md border border-[#2b313a] px-3.5 py-1.5 rounded-full shadow-2xl animate-in fade-in duration-200"
          style={{
            bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <button
            type="button"
            onClick={toggleEditMode}
            className="px-3 py-1 text-[11px] font-medium rounded-full bg-[#ec008c] text-white shadow-sm"
          >
            Done
          </button>
          <span className="text-gray-600">·</span>
          <button
            type="button"
            onClick={() => setIsPresetsModalOpen(true)}
            className="text-gray-300 text-[11px] font-medium px-1"
          >
            Presets
          </button>
          <span className="text-gray-600">·</span>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="text-[#ec008c] text-[11px] font-semibold flex items-center gap-1 px-1"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      )}

      {/* Modals & Dialogs */}
      <EditModal />
      <MediaUploaderModal />
      <ChartEditorModal />
      <PresetsModal />
      <ExportModal />
      <ShiftGraphDateModal
        isOpen={isDateShiftModalOpen}
        onClose={() => setIsDateShiftModalOpen(false)}
      />
      <TypicalGraphModal />
    </div>
  );
};

export default function App() {
  return (
    <InsightsProvider>
      <ReelInsightsScreen />
    </InsightsProvider>
  );
}
