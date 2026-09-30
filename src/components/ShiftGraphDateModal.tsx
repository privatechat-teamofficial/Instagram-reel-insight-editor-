import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import {
  parseInstagramDate,
  formatToInputDate,
  shiftTimelineByDays,
  shiftTimelineToStartDate,
  shiftProgressToPointIndex,
} from '../utils/dateShifter';
import { Calendar, Rewind, FastForward, Check, X, Clock, Sparkles } from 'lucide-react';

interface ShiftGraphDateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShiftGraphDateModal: React.FC<ShiftGraphDateModalProps> = ({ isOpen, onClose }) => {
  const { data, setData } = useInsights();

  const currentDates = data.viewsChart.dates;
  const currentPoints = data.viewsChart.points;

  // Selected new start date
  const parsedStartDate = currentDates[0] ? parseInstagramDate(currentDates[0]) : new Date();
  const [selectedDateInput, setSelectedDateInput] = useState<string>(
    formatToInputDate(parsedStartDate)
  );

  // Active sub-mode: 'calendar' (shift date window) or 'progress' (rewind progress curve)
  const [mode, setMode] = useState<'calendar' | 'progress'>('calendar');

  // For progress rewinding
  const activeCutoffIndex = currentPoints.findIndex((p) => p.hasData === false);
  const currentActiveIndex = activeCutoffIndex === -1 ? currentPoints.length - 1 : Math.max(0, activeCutoffIndex - 1);
  const [progressCutoff, setProgressCutoff] = useState<number>(currentActiveIndex);
  const [autoScaleViews, setAutoScaleViews] = useState<boolean>(true);

  if (!isOpen) return null;

  // Quick shift handler by N days
  const handleShiftByDays = (days: number) => {
    const { dates: newDates, points: newPoints } = shiftTimelineByDays(
      currentDates,
      currentPoints,
      days
    );

    setData((prev) => ({
      ...prev,
      viewsChart: {
        ...prev.viewsChart,
        dates: newDates,
        points: newPoints,
      },
    }));

    if (newDates[0]) {
      setSelectedDateInput(formatToInputDate(parseInstagramDate(newDates[0])));
    }
  };

  // Specific custom start date handler
  const handleApplyCustomDate = () => {
    if (!selectedDateInput) return;
    const targetDate = new Date(`${selectedDateInput}T12:00:00`);
    if (isNaN(targetDate.getTime())) return;

    const { dates: newDates, points: newPoints } = shiftTimelineToStartDate(
      currentDates,
      currentPoints,
      targetDate
    );

    setData((prev) => ({
      ...prev,
      viewsChart: {
        ...prev.viewsChart,
        dates: newDates,
        points: newPoints,
      },
    }));
    onClose();
  };

  // Progress rewind handler
  const handleApplyProgressRewind = () => {
    const newPoints = shiftProgressToPointIndex(currentPoints, progressCutoff);
    const targetPoint = currentPoints[progressCutoff];

    setData((prev) => {
      let updatedSummary = prev.summary;
      if (autoScaleViews && targetPoint) {
        const targetViews = Math.max(10, Math.round(targetPoint.all * 1.05));
        updatedSummary = {
          ...prev.summary,
          views: targetViews,
          viewers: Math.round(targetViews * 0.45),
        };
      }

      return {
        ...prev,
        summary: updatedSummary,
        viewsChart: {
          ...prev.viewsChart,
          points: newPoints,
        },
      };
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#16191d] border border-[#2b313a] rounded-2xl p-5 shadow-2xl flex flex-col gap-4.5 text-white max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#242a32]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FE36FF]/15 flex items-center justify-center text-[#FE36FF]">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-white leading-tight">Shift Reel Graph Date</h3>
              <p className="text-[11px] text-[#8e959b]">Shift timeline or rewind progress across all reel graphs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#1c2024]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#0f1114] p-1 rounded-xl border border-[#20252c]">
          <button
            type="button"
            onClick={() => setMode('calendar')}
            className={`py-2 px-3 text-[12px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'calendar'
                ? 'bg-[#282d35] text-white shadow-sm'
                : 'text-[#8e959b] hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Shift Dates Back</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('progress')}
            className={`py-2 px-3 text-[12px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'progress'
                ? 'bg-[#282d35] text-white shadow-sm'
                : 'text-[#8e959b] hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Rewind Curve Date</span>
          </button>
        </div>

        {/* MODE 1: SHIFT CALENDAR DATES BACK */}
        {mode === 'calendar' && (
          <div className="flex flex-col gap-4">
            {/* Current Range Badge */}
            <div className="bg-[#1c2026] p-3 rounded-xl border border-[#29303a] flex flex-col gap-1">
              <span className="text-[11px] text-[#8e959b]">Current Graph Date Range:</span>
              <div className="flex items-center gap-2 text-[14px] font-semibold text-white">
                <span>{currentDates[0] || 'Start'}</span>
                <span className="text-[#8e959b]">→</span>
                <span>{currentDates[Math.floor(currentDates.length / 2)] || 'Mid'}</span>
                <span className="text-[#8e959b]">→</span>
                <span className="text-[#FE36FF]">{currentDates[currentDates.length - 1] || 'End'}</span>
              </div>
            </div>

            {/* Quick Shift Back Buttons */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-[#8e959b]">Quick Shift Timeline:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleShiftByDays(-1)}
                  className="py-2 px-2 bg-[#1c2026] hover:bg-[#252b33] border border-[#2a303a] rounded-lg text-[12px] text-white flex items-center justify-center gap-1 transition-colors"
                >
                  <Rewind className="w-3 h-3 text-[#FE36FF]" />
                  <span>-1 Day</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftByDays(-3)}
                  className="py-2 px-2 bg-[#1c2026] hover:bg-[#252b33] border border-[#2a303a] rounded-lg text-[12px] text-white flex items-center justify-center gap-1 transition-colors"
                >
                  <Rewind className="w-3 h-3 text-[#FE36FF]" />
                  <span>-3 Days</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftByDays(-7)}
                  className="py-2 px-2 bg-[#1c2026] hover:bg-[#252b33] border border-[#2a303a] rounded-lg text-[12px] text-white flex items-center justify-center gap-1 transition-colors font-medium"
                >
                  <Rewind className="w-3 h-3 text-[#FE36FF]" />
                  <span>-1 Week</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftByDays(-14)}
                  className="py-2 px-2 bg-[#1c2026] hover:bg-[#252b33] border border-[#2a303a] rounded-lg text-[12px] text-white flex items-center justify-center gap-1 transition-colors"
                >
                  <Rewind className="w-3 h-3 text-[#FE36FF]" />
                  <span>-2 Weeks</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftByDays(-30)}
                  className="py-2 px-2 bg-[#1c2026] hover:bg-[#252b33] border border-[#2a303a] rounded-lg text-[12px] text-white flex items-center justify-center gap-1 transition-colors"
                >
                  <Rewind className="w-3 h-3 text-[#FE36FF]" />
                  <span>-1 Month</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftByDays(1)}
                  className="py-2 px-2 bg-[#1c2026] hover:bg-[#252b33] border border-[#2a303a] rounded-lg text-[12px] text-white flex items-center justify-center gap-1 transition-colors"
                >
                  <FastForward className="w-3 h-3 text-[#3897f0]" />
                  <span>+1 Day</span>
                </button>
              </div>
            </div>

            {/* Custom Exact Start Date Input */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-[12px] font-semibold text-[#8e959b]">
                Or Choose Exact Publish Date:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDateInput}
                  onChange={(e) => setSelectedDateInput(e.target.value)}
                  className="flex-1 bg-[#14171b] border border-[#2b323c] rounded-xl px-3.5 py-2 text-[13px] text-white outline-none focus:border-[#FE36FF]"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomDate}
                  className="px-4 py-2 bg-[#FE36FF] hover:bg-[#d82ce0] text-white text-[12px] font-semibold rounded-xl transition-colors shrink-0 shadow-sm"
                >
                  Set Date
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: REWIND REEL CURVE PROGRESS */}
        {mode === 'progress' && (
          <div className="flex flex-col gap-4">
            <p className="text-[11.5px] text-[#8e959b] leading-relaxed">
              Shift the reel curve back to a past date to display how views looked at earlier points in time.
            </p>

            {/* Scrubber / Step Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#8e959b]">Progress reached up to:</span>
                <span className="font-semibold text-[#FE36FF] bg-[#FE36FF]/15 px-2 py-0.5 rounded-md">
                  {currentPoints[progressCutoff]?.label || `Point ${progressCutoff + 1}`}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max={currentPoints.length - 1}
                value={progressCutoff}
                onChange={(e) => setProgressCutoff(Number(e.target.value))}
                className="w-full accent-[#FE36FF] cursor-pointer"
              />

              <div className="flex justify-between text-[10.5px] text-[#8e959b] px-0.5">
                <span>Start ({currentDates[0] || 'Day 1'})</span>
                <span>Mid ({currentDates[1] || 'Day 2'})</span>
                <span>End ({currentDates[2] || 'Day 3'})</span>
              </div>
            </div>

            {/* Quick Rewind Presets */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProgressCutoff(Math.floor(currentPoints.length * 0.25))}
                className="py-1.5 px-2 bg-[#1c2026] hover:bg-[#252b33] border border-[#2a303a] rounded-lg text-[11.5px] text-white transition-colors"
              >
                Day 1 Only
              </button>
              <button
                type="button"
                onClick={() => setProgressCutoff(Math.floor(currentPoints.length * 0.58))}
                className="py-1.5 px-2 bg-[#1c2026] hover:bg-[#252b33] border border-[#2a303a] rounded-lg text-[11.5px] text-white transition-colors"
              >
                Day 2 (Current)
              </button>
              <button
                type="button"
                onClick={() => setProgressCutoff(currentPoints.length - 1)}
                className="py-1.5 px-2 bg-[#1c2026] hover:bg-[#252b33] border border-[#2a303a] rounded-lg text-[11.5px] text-white transition-colors"
              >
                Full (Day 3)
              </button>
            </div>

            {/* Toggle sync summary views */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={autoScaleViews}
                onChange={(e) => setAutoScaleViews(e.target.checked)}
                className="rounded accent-[#FE36FF] w-4 h-4 cursor-pointer"
              />
              <span className="text-[12px] text-gray-300">
                Update total Summary Views to match this date
              </span>
            </label>

            <button
              type="button"
              onClick={handleApplyProgressRewind}
              className="mt-2 w-full py-2.5 bg-[#FE36FF] hover:bg-[#d82ce0] text-white text-[13px] font-semibold rounded-xl transition-colors shadow-sm"
            >
              Apply Rewound Date
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-[#242a32] flex items-center justify-between text-[11px] text-[#8e959b]">
          <span>Applies to Views over time and reel graphs</span>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:underline font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
