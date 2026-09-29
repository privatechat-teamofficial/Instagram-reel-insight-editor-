/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
import { SideControlPanel } from './components/SideControlPanel';
import {
  Download,
  Sparkles,
  Edit3,
  CheckCircle,
  HelpCircle,
  Smartphone,
} from 'lucide-react';

const ReelInsightsScreen: React.FC = () => {
  const {
    activeTab,
    isEditMode,
    toggleEditMode,
    setIsExportModalOpen,
    setIsPresetsModalOpen,
  } = useInsights();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-start lg:justify-center p-0 sm:p-4 md:p-6 lg:p-8 font-sans">
      {/* Top Banner for Desktop Mode */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-5xl mb-4 px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-600/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-white tracking-tight">Instagram Reel Insights Mockup Studio</h1>
            <p className="text-[11px] text-gray-400">
              Pixel-perfect replica of the Instagram Reel Insights screen. Tap the header or any number to edit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleEditMode}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
              isEditMode
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'bg-[#181818] text-gray-300 hover:text-white border border-[#2c2c2c]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditMode ? 'Edit Mode ON' : 'Turn Edit Mode ON'}
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-[12px] font-semibold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export Screenshot
          </button>
        </div>
      </div>

      {/* Main Workspace Layout (Phone Frame + Companion Sidebar on Desktop) */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 w-full max-w-5xl">
        {/* Smartphone Bezel / Viewport Container */}
        <div className="relative w-full max-w-[420px] bg-[#000000] sm:rounded-[36px] sm:border-[8px] sm:border-[#1e1e1e] sm:shadow-2xl sm:shadow-black/90 overflow-hidden flex flex-col h-[100dvh] sm:h-[840px]">
          {/* Hardware Notch / Dynamic Island on frame */}
          <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#141414] rounded-full z-40 pointer-events-none" />

          {/* Pure Reel Insights Capture Container */}
          <div
            id="reel-insights-preview-container"
            className="w-full h-full bg-[#000000] text-white flex flex-col overflow-y-auto overflow-x-hidden selection:bg-pink-500/20"
          >
            {/* 1. Header (with tap-to-edit) */}
            <Header />

            {/* 2. Reel Media & 5 Metric Icons */}
            <ReelMediaHeader />

            {/* 3. Horizontal Navigation Tabs */}
            <TabsNavigation />

            {/* 4. Active Tab Content */}
            <div className="flex-1 pb-16">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'engagement' && <EngagementTab />}
              {activeTab === 'audience' && <AudienceTab />}
            </div>
          </div>
        </div>

        {/* Desktop Side Control Panel */}
        <SideControlPanel />
      </div>

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex lg:hidden items-center gap-1.5 bg-[#181818]/95 backdrop-blur-md border border-[#333333] px-3 py-1.5 rounded-full shadow-2xl">
        <button
          type="button"
          onClick={toggleEditMode}
          className={`px-3 py-1 text-[11px] font-semibold rounded-full flex items-center gap-1 transition-all ${
            isEditMode ? 'bg-pink-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Edit3 className="w-3 h-3" />
          {isEditMode ? 'Editing ON' : 'Edit'}
        </button>

        <span className="text-gray-600">|</span>

        <button
          type="button"
          onClick={() => setIsPresetsModalOpen(true)}
          className="px-2 py-1 text-[11px] text-gray-300 font-medium"
        >
          Presets
        </button>

        <span className="text-gray-600">|</span>

        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="px-3 py-1 bg-pink-600 text-white text-[11px] font-semibold rounded-full flex items-center gap-1 shadow"
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      {/* Modals & Dialogs */}
      <EditModal />
      <MediaUploaderModal />
      <ChartEditorModal />
      <PresetsModal />
      <ExportModal />
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
