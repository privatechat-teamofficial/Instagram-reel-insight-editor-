import React, { useState, useEffect } from 'react';
import { useInsights } from '../context/InsightsContext';
import { POPULAR_COUNTRIES } from '../data/defaultData';
import { X, Check } from 'lucide-react';

export const EditModal: React.FC = () => {
  const { activeEditTarget, closeEditor, updateValueByPath } = useInsights();
  const [currentVal, setCurrentVal] = useState<any>('');

  useEffect(() => {
    if (activeEditTarget) {
      setCurrentVal(activeEditTarget.value);
    }
  }, [activeEditTarget]);

  if (!activeEditTarget) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let valToSave = currentVal;
    if (activeEditTarget.type === 'number') {
      valToSave = Number(currentVal) || 0;
    } else if (activeEditTarget.type === 'percentage') {
      valToSave = Math.min(100, Math.max(0, parseFloat(currentVal) || 0));
    }
    updateValueByPath(activeEditTarget.path, valToSave);
    closeEditor();
  };

  const handleLiveChange = (newVal: any) => {
    setCurrentVal(newVal);
    // Instant live preview
    let valToSave = newVal;
    if (activeEditTarget.type === 'number') {
      valToSave = Number(newVal) || 0;
    } else if (activeEditTarget.type === 'percentage') {
      valToSave = Math.min(100, Math.max(0, parseFloat(newVal) || 0));
    }
    updateValueByPath(activeEditTarget.path, valToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#181818] border-t sm:border border-[#2e2e2e] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <div className="flex flex-col">
            <span className="text-[11px] text-pink-400 font-semibold uppercase tracking-wider">
              Editing Value
            </span>
            <h3 className="text-[16px] font-semibold text-white">{activeEditTarget.title}</h3>
          </div>
          <button
            type="button"
            onClick={closeEditor}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#262626]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form Body */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* NUMBER INPUT */}
          {activeEditTarget.type === 'number' && (
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-gray-400">Enter count / quantity</label>
              <input
                type="number"
                value={currentVal}
                onChange={(e) => handleLiveChange(e.target.value)}
                autoFocus
                className="w-full bg-[#0d0d0d] border border-[#333333] rounded-xl px-4 py-2.5 text-[18px] font-semibold text-white focus:outline-none focus:border-pink-500 tabular-numbers"
              />
              {/* Quick Increment Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[+10, +100, +1000, +10000, +50000].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => handleLiveChange(Number(currentVal || 0) + delta)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-[#262626] hover:bg-[#333333] text-gray-200 rounded-lg"
                  >
                    +{new Intl.NumberFormat('en-US').format(delta)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PERCENTAGE INPUT */}
          {activeEditTarget.type === 'percentage' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-[12px] text-gray-400">Percentage value</label>
                <span className="text-[16px] font-bold text-pink-400 tabular-numbers">
                  {Number(currentVal || 0).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={currentVal || 0}
                onChange={(e) => handleLiveChange(parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer h-2 bg-[#262626] rounded-lg"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={currentVal}
                  onChange={(e) => handleLiveChange(e.target.value)}
                  className="flex-1 bg-[#0d0d0d] border border-[#333333] rounded-xl px-4 py-2 text-[15px] font-medium text-white focus:outline-none focus:border-pink-500 tabular-numbers"
                />
                <span className="text-gray-400 font-semibold">%</span>
              </div>
            </div>
          )}

          {/* COUNTRY SELECT (MANDATORY REQUIREMENT) */}
          {activeEditTarget.type === 'country_select' && (
            <div className="flex flex-col gap-3">
              <label className="text-[12px] text-gray-400">Country name</label>
              <input
                type="text"
                value={currentVal}
                onChange={(e) => handleLiveChange(e.target.value)}
                autoFocus
                placeholder="e.g. United States, India, Germany"
                className="w-full bg-[#0d0d0d] border border-[#333333] rounded-xl px-4 py-2.5 text-[16px] font-medium text-white focus:outline-none focus:border-pink-500"
              />
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[11px] text-gray-400">Popular Quick Suggestions:</span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {POPULAR_COUNTRIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleLiveChange(c)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
                        currentVal === c
                          ? 'bg-pink-600 text-white font-semibold'
                          : 'bg-[#262626] hover:bg-[#333333] text-gray-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATUS TAG (Higher, Lower, Typical) */}
          {activeEditTarget.type === 'status_tag' && (
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-gray-400">Status benchmark indicator</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Higher', 'Lower', 'Typical'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleLiveChange(status)}
                    className={`py-2 text-[13px] font-semibold rounded-xl border transition-all ${
                      currentVal === status
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'bg-[#0d0d0d] border-[#2e2e2e] text-gray-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TIME INPUT */}
          {activeEditTarget.type === 'time' && (
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-gray-400">Duration / Watch time</label>
              <input
                type="text"
                value={currentVal}
                onChange={(e) => handleLiveChange(e.target.value)}
                autoFocus
                placeholder="e.g. 11s, 0:25, 1m 04s"
                className="w-full bg-[#0d0d0d] border border-[#333333] rounded-xl px-4 py-2.5 text-[16px] font-medium text-white focus:outline-none focus:border-pink-500"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['6s', '11s', '18s', '24s', '35s', '1m 12s'].map((timePreset) => (
                  <button
                    key={timePreset}
                    type="button"
                    onClick={() => handleLiveChange(timePreset)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-[#262626] hover:bg-[#333333] text-gray-200 rounded-lg"
                  >
                    {timePreset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DATE & GENERAL TEXT */}
          {(activeEditTarget.type === 'text' || activeEditTarget.type === 'date') && (
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-gray-400">Enter text</label>
              <input
                type="text"
                value={currentVal}
                onChange={(e) => handleLiveChange(e.target.value)}
                autoFocus
                className="w-full bg-[#0d0d0d] border border-[#333333] rounded-xl px-4 py-2.5 text-[16px] font-medium text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262626]">
            <button
              type="button"
              onClick={closeEditor}
              className="px-4 py-2 text-[13px] font-medium text-gray-400 hover:text-white rounded-xl bg-[#262626]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[13px] font-semibold text-white rounded-xl bg-pink-600 hover:bg-pink-500 flex items-center gap-1.5 shadow-lg shadow-pink-600/20"
            >
              <Check className="w-4 h-4" />
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
