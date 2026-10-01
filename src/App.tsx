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
  const [overscrollTopStretch, setOverscrollTopStretch] = useState(0);
  const [overscrollBottomOffset, setOverscrollBottomOffset] = useState(0);
  const [isOverscrolling, setIsOverscrolling] = useState(false);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    scrollTop: number;
    time: number;
  } | null>(null);
  const gestureTypeRef = useRef<'undetermined' | 'horizontal' | 'vertical'>('undetermined');
  const scrollVelocityRef = useRef<{ lastTop: number; lastTime: number; velocity: number }>({
    lastTop: 0,
    lastTime: Date.now(),
    velocity: 0,
  });
  const momentumTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const now = Date.now();
    const currentTop = container.scrollTop;
    const dt = Math.max(1, now - scrollVelocityRef.current.lastTime);
    const dy = currentTop - scrollVelocityRef.current.lastTop;
    const velocity = dy / dt; // positive = scrolling down to bottom, negative = scrolling up to top

    scrollVelocityRef.current = {
      lastTop: currentTop,
      lastTime: now,
      velocity,
    };

    // When scrolling with slide/fling and hitting screen bottom
    const isAtBottom = currentTop + container.clientHeight >= container.scrollHeight - 3;
    const isAtTop = currentTop <= 0;

    if (isAtBottom && velocity > 0.2) {
      // Momentum hit bottom -> show bottom bounce stretch
      setIsOverscrolling(true);
      const bottomPull = Math.min(8.5, Math.pow(velocity * 10, 0.7) * 0.9);
      setOverscrollBottomOffset(bottomPull);
      if (momentumTimeoutRef.current) clearTimeout(momentumTimeoutRef.current);
      momentumTimeoutRef.current = setTimeout(() => {
        setIsOverscrolling(false);
        setOverscrollBottomOffset(0);
      }, 160);
    } else if (isAtTop && velocity < -0.2) {
      // Momentum hit top -> show top elastic stretch
      setIsOverscrolling(true);
      const stretch = Math.min(0.022, Math.pow(Math.abs(velocity) * 10, 0.6) * 0.002);
      setOverscrollTopStretch(stretch);
      if (momentumTimeoutRef.current) clearTimeout(momentumTimeoutRef.current);
      momentumTimeoutRef.current = setTimeout(() => {
        setIsOverscrolling(false);
        setOverscrollTopStretch(0);
      }, 160);
    }
  };

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
    gestureTypeRef.current = 'undetermined';
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Lock gesture direction once minimal movement occurs to cleanly separate horizontal swipe vs vertical stretch
    if (gestureTypeRef.current === 'undetermined') {
      if (absX >= 7 || absY >= 7) {
        if (absX > absY * 0.85) {
          gestureTypeRef.current = 'horizontal';
          if (overscrollTopStretch !== 0) setOverscrollTopStretch(0);
          if (overscrollBottomOffset !== 0) setOverscrollBottomOffset(0);
          setIsOverscrolling(false);
        } else {
          gestureTypeRef.current = 'vertical';
        }
      }
    }

    // When swiping horizontally, do NOT trigger any vertical stretch
    if (gestureTypeRef.current === 'horizontal') {
      if (overscrollTopStretch !== 0) setOverscrollTopStretch(0);
      if (overscrollBottomOffset !== 0) setOverscrollBottomOffset(0);
      return;
    }

    // When vertical: apply subtle stretch whenever sliding reaches top or bottom boundary
    if (gestureTypeRef.current === 'vertical') {
      const currentScrollTop = container.scrollTop;
      const isAtTopBoundary = currentScrollTop <= 0 && deltaY > 0;
      const isAtBottomBoundary =
        currentScrollTop + container.clientHeight >= container.scrollHeight - 3 && deltaY < 0;

      if (isAtTopBoundary) {
        setIsOverscrolling(true);
        const pullDist = Math.max(0, deltaY);
        // Very subtle non-linear stretch (max ~2.2% stretch, pinned at top)
        const stretch = Math.min(0.022, Math.pow(pullDist, 0.6) * 0.0009);
        setOverscrollTopStretch(stretch);
        setOverscrollBottomOffset(0);
      } else if (isAtBottomBoundary) {
        setIsOverscrolling(true);
        const pullDist = Math.max(0, -deltaY);
        // Gentle, stable pull up (max ~8px, avoids scrollHeight mutation jitter)
        const pull = Math.min(8, Math.pow(pullDist, 0.65) * 0.42);
        setOverscrollBottomOffset(pull);
        setOverscrollTopStretch(0);
      } else {
        if (!momentumTimeoutRef.current) {
          if (overscrollTopStretch !== 0) setOverscrollTopStretch(0);
          if (overscrollBottomOffset !== 0) setOverscrollBottomOffset(0);
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Handle horizontal swipe to switch section tabs cleanly
      const isHorizontalSwipe =
        gestureTypeRef.current === 'horizontal' ||
        (Math.abs(deltaX) > 32 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1 && deltaTime < 700);

      if (isHorizontalSwipe) {
        const currentIndex = TABS.indexOf(activeTab);
        if (deltaX < -32 && currentIndex < TABS.length - 1) {
          // Swipe left -> next section (Overview -> Engagement -> Audience)
          setActiveTab(TABS[currentIndex + 1]);
        } else if (deltaX > 32 && currentIndex > 0) {
          // Swipe right -> previous section
          setActiveTab(TABS[currentIndex - 1]);
        }
      }
    }

    touchStartRef.current = null;
    gestureTypeRef.current = 'undetermined';
    setIsOverscrolling(false);
    setOverscrollTopStretch(0);
    setOverscrollBottomOffset(0);
  };

  return (
    <div className="w-full h-full min-h-screen min-h-[100dvh] h-[100dvh] bg-[#0c1014] flex flex-col p-0 m-0 select-none relative font-acumin overflow-hidden">
      {/* Header: Back arrow · Reel insights · Insights trend · Options (100% FIRM, never moves or scrolls) */}
      <Header />

      {/* Reel Insights Screen Scrollable Container */}
      <div
        id="reel-insights-preview-container"
        ref={scrollContainerRef}
        onScroll={handleScroll}
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
        {/* Stable Content Layer with authentic subtle stretch */}
        <div
          className="flex-1 flex flex-col w-full bg-[#0c1014] will-change-transform"
          style={{
            transformOrigin: 'top center',
            transform:
              overscrollTopStretch > 0
                ? `scaleY(${1 + overscrollTopStretch})`
                : overscrollBottomOffset > 0
                ? `translateY(-${overscrollBottomOffset}px)`
                : undefined,
            transition: isOverscrolling ? 'none' : 'transform 260ms cubic-bezier(0.2, 0.9, 0.3, 1)',
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
