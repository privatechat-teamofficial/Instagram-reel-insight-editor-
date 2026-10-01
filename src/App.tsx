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
    <div className="min-h-screen min-h-[100dvh] h-[100dvh] w-full bg-[#0d0f12] flex items-center justify-center p-0 select-none relative font-acumin overflow-hidden">
      {/* Central Viewport Wrapper */}
      <div className="relative flex items-center justify-center lg:gap-6 h-full w-full">
        {/* Full-screen app layout occupying 100% of the screen on mobile/devices */}
        <div className="relative w-full lg:max-w-[440px] h-[100dvh] min-h-[100dvh] bg-[#0d0f12] overflow-hidden flex flex-col">
          {/* Reel Insights Screen Content Container */}
          <div
            id="reel-insights-preview-container"
            ref={scrollContainerRef}
            className="w-full h-full bg-[#0d0f12] text-white flex flex-col overflow-y-auto overscroll-y-contain overflow-x-hidden selection:bg-[#ec008c]/20 font-acumin"
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

              {/* Desktop-only simulated home bar; on real Android devices the OS navigation bar handles this */}
              <div className="hidden lg:flex w-full pb-2 pt-1 justify-center shrink-0 bg-[#0d0f12] pointer-events-none">
                <div className="w-32 h-[3px] bg-white/70 rounded-full" />
              </div>

              {/* Bottom spacer for comfortable scrolling above Android gesture navigation bar */}
              <div
                className="w-full h-12 lg:h-4 shrink-0 bg-[#0d0f12]"
                style={{
                  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Minimal Desktop Studio Control Rail (non-intrusive) */}
        <div className="hidden lg:flex flex-col gap-3 w-64 bg-[#111418] p-4 rounded-2xl border border-[#21262d] shadow-2xl text-white">
          <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
            <span className="text-[12.5px] font-semibold text-white tracking-tight">Studio Controls</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                isEditMode ? 'bg-[#ec008c] text-white' : 'bg-[#1e2329] text-gray-400'
              }`}
            >
              {isEditMode ? 'Editing ON' : 'Preview'}
            </span>
          </div>

          {/* Edit Mode Toggle */}
          <button
            type="button"
            onClick={toggleEditMode}
            className={`w-full py-2 px-3 rounded-xl text-[12px] font-medium flex items-center justify-between transition-all ${
              isEditMode
                ? 'bg-[#ec008c] text-white shadow-md shadow-[#ec008c]/20'
                : 'bg-[#1a1e23] hover:bg-[#252b32] text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}</span>
            </div>
            <span className="text-[10px] text-white/70">{isEditMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Quick Actions */}
          <button
            type="button"
            onClick={() => setIsDateShiftModalOpen(true)}
            className="w-full py-2 px-3 bg-[#1a1e23] hover:bg-[#252b32] text-gray-200 rounded-xl text-[12px] font-medium flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#FE36FF]" />
              <span>Shift Graph Date</span>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-white">Rewind</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTypicalModalOpen(true)}
            className="w-full py-2 px-3 bg-[#1a1e23] hover:bg-[#252b32] text-gray-200 rounded-xl text-[12px] font-medium flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Typical Graph</span>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-white">Baseline</span>
          </button>

          <button
            type="button"
            onClick={() => setIsChartModalOpen(true)}
            className="w-full py-2 px-3 bg-[#1a1e23] hover:bg-[#252b32] text-gray-200 rounded-xl text-[12px] font-medium flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ec008c]" />
              <span>Auto-Render Graph</span>
            </div>
            <span className="text-[10px] text-[#ec008c] font-semibold">AI</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="w-full py-2 px-3 bg-[#1a1e23] hover:bg-[#252b32] text-gray-200 rounded-xl text-[12px] font-medium flex items-center gap-2 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-[#ec008c]" />
            <span>Upload Reel Media</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPresetsModalOpen(true)}
            className="w-full py-2 px-3 bg-[#1a1e23] hover:bg-[#252b32] text-gray-200 rounded-xl text-[12px] font-medium flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ec008c]" />
            <span>Presets & Backups</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="w-full py-2.5 px-3 bg-[#ec008c] hover:bg-[#d80070] text-white rounded-xl text-[12px] font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#ec008c]/20 transition-all mt-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Screenshot</span>
          </button>

          <div className="pt-2 border-t border-[#21262d] flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all values to reference defaults?')) resetToDefaults();
              }}
              className="text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <span className="text-gray-500">Tap title to edit</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Bar on Mobile (only shown in editing mode, keeping clean view in preview mode) */}
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
