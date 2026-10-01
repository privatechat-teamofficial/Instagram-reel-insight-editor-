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
  const [overscrollY, setOverscrollY] = useState(0);
  const [isOverscrolling, setIsOverscrolling] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; scrollTop: number; time: number } | null>(null);

  const TABS: TabType[] = ['overview', 'engagement', 'audience'];

  useEffect(() => {
    // Hide native status bar if running inside Capacitor
    import('@capacitor/status-bar')
      .then(({ StatusBar }) => {
        StatusBar.hide().catch(() => {});
      })
      .catch(() => {});
  }, []);

  const {
    activeTab,
    setActiveTab,
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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const container = scrollContainerRef.current;
    if (!container) return;
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollTop: container.scrollTop,
      time: Date.now(),
    };
    setIsOverscrolling(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Check if at scroll boundaries (top or bottom) for elastic stretch
    const isAtTop = container.scrollTop <= 0 && deltaY > 0;
    const isAtBottom =
      container.scrollTop + container.clientHeight >= container.scrollHeight - 2 && deltaY < 0;

    if (isAtTop || isAtBottom) {
      // Apply rubber-band damping (max ~26px stretch)
      const damp = Math.sign(deltaY) * Math.min(26, Math.pow(Math.abs(deltaY), 0.72) * 1.15);
      setOverscrollY(damp);
    } else {
      if (overscrollY !== 0) setOverscrollY(0);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Check for horizontal swipe gesture to change section (Overview <-> Engagement <-> Audience)
      if (
        Math.abs(deltaX) > 45 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.25 &&
        deltaTime < 600
      ) {
        const currentIndex = TABS.indexOf(activeTab);
        if (deltaX < 0 && currentIndex < TABS.length - 1) {
          // Swipe left -> next section
          setActiveTab(TABS[currentIndex + 1]);
        } else if (deltaX > 0 && currentIndex > 0) {
          // Swipe right -> previous section
          setActiveTab(TABS[currentIndex - 1]);
        }
      }
    }

    touchStartRef.current = null;
    setIsOverscrolling(false);
    setOverscrollY(0);
  };

  return (
    <div className="w-full h-full min-h-screen min-h-[100dvh] h-[100dvh] bg-[#0c1014] flex flex-col p-0 m-0 select-none relative font-acumin overflow-hidden">
      {/* Header: Back arrow · Reel insights · Insights trend · Options (100% FIRM, never moves or scrolls) */}
      <Header />

      {/* Reel Insights Screen Scrollable Container */}
      <div
        id="reel-insights-preview-container"
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-full flex-1 bg-[#0c1014] text-white flex flex-col overflow-y-auto overscroll-none overflow-x-hidden selection:bg-[#ec008c]/20 font-acumin"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overscrollBehavior: 'none',
        }}
      >
        {/* Stable Content Layer with elastic overscroll stretch */}
        <div
          className="flex-1 flex flex-col w-full bg-[#0c1014] will-change-transform"
          style={{
            transform: overscrollY !== 0 ? `translateY(${overscrollY}px)` : undefined,
            transition: isOverscrolling ? 'none' : 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {/* Reel Video/Image Preview & Top 5 Metrics (Likes, Comments, Reposts, Shares, Saves) */}
          <ReelMediaHeader />

          {/* Horizontal Tabs: Overview | Engagement | Audience */}
          <TabsNavigation />

          {/* Active Tab Content - kept mounted to prevent DOM unmount flicker and tablet layout collapse */}
          <div className="flex-1 w-full bg-[#0c1014]">
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
            className="w-full h-12 lg:h-6 shrink-0 bg-[#0c1014]"
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
