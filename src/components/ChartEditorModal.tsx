import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import { ChartDataPoint } from '../types/insights';
import { X, Plus, Trash2, Check, TrendingUp } from 'lucide-react';

export const ChartEditorModal: React.FC = () => {
  const { isChartModalOpen, setIsChartModalOpen, data, setData } = useInsights();
  const [points, setPoints] = useState<ChartDataPoint[]>(data.viewsChart.points);
  const [dates, setDates] = useState<string[]>(data.viewsChart.dates);
  const [yMax, setYMax] = useState<number>(data.viewsChart.yMax);

  if (!isChartModalOpen) return null;

  const handlePointChange = (index: number, field: keyof ChartDataPoint, val: any) => {
    setPoints((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleDateChange = (index: number, val: string) => {
    setDates((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAddPoint = () => {
    const newPt: ChartDataPoint = {
      id: String(Date.now()),
      label: `Day ${points.length + 1}`,
      all: points[points.length - 1]?.all ? Math.round(points[points.length - 1].all * 1.1) : 1000,
      followers: 0,
      nonFollowers: points[points.length - 1]?.nonFollowers ? Math.round(points[points.length - 1].nonFollowers * 1.1) : 1000,
    };
    setPoints((prev) => [...prev, newPt]);
  };

  const handleRemovePoint = (index: number) => {
    if (points.length <= 2) return;
    setPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setData((prev) => ({
      ...prev,
      viewsChart: {
        ...prev.viewsChart,
        points,
        dates,
        yMax: Number(yMax) || 4000,
      },
    }));
    setIsChartModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-400" />
            <h3 className="text-[17px] font-semibold text-white">Views Over Time Chart Data</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsChartModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#262626]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Y-Axis Max & Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-400">Y-Axis Peak (Max View)</label>
            <input
              type="number"
              value={yMax}
              onChange={(e) => setYMax(Number(e.target.value))}
              className="bg-[#0d0d0d] border border-[#333333] rounded-xl px-3 py-1.5 text-[14px] text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-400">Date Range (Start - Mid - End)</label>
            <div className="flex gap-1">
              {dates.map((d, i) => (
                <input
                  key={i}
                  type="text"
                  value={d}
                  onChange={(e) => handleDateChange(i, e.target.value)}
                  className="w-1/3 bg-[#0d0d0d] border border-[#333333] rounded-lg px-2 py-1.5 text-[11px] text-white text-center focus:outline-none focus:border-pink-500"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Data points table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-gray-300">Curve Data Points ({points.length})</label>
            <button
              type="button"
              onClick={handleAddPoint}
              className="text-pink-400 hover:text-pink-300 text-[11px] font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Data Point
            </button>
          </div>

          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
            {points.map((pt, idx) => (
              <div
                key={pt.id || idx}
                className="flex items-center gap-2 bg-[#121212] p-2.5 rounded-xl border border-[#242424]"
              >
                <div className="w-6 text-[11px] text-gray-500 font-mono text-center">#{idx + 1}</div>

                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <span className="block text-[9px] text-gray-400">Label</span>
                    <input
                      type="text"
                      value={pt.label}
                      onChange={(e) => handlePointChange(idx, 'label', e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-[#333333] rounded px-2 py-1 text-[11px] text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-400">All Views</span>
                    <input
                      type="number"
                      value={pt.all}
                      onChange={(e) => handlePointChange(idx, 'all', Number(e.target.value))}
                      className="w-full bg-[#0d0d0d] border border-[#333333] rounded px-2 py-1 text-[11px] text-white tabular-numbers"
                    />
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-400">Followers</span>
                    <input
                      type="number"
                      value={pt.followers}
                      onChange={(e) => handlePointChange(idx, 'followers', Number(e.target.value))}
                      className="w-full bg-[#0d0d0d] border border-[#333333] rounded px-2 py-1 text-[11px] text-white tabular-numbers"
                    />
                  </div>
                </div>

                {points.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePoint(idx)}
                    className="p-1 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#262626]">
          <button
            type="button"
            onClick={() => setIsChartModalOpen(false)}
            className="px-4 py-2 text-[13px] font-medium text-gray-400 hover:text-white rounded-xl bg-[#262626]"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSave}
            className="px-5 py-2 text-[13px] font-semibold text-white rounded-xl bg-pink-600 hover:bg-pink-500 shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Update Chart
          </button>
        </div>
      </div>
    </div>
  );
};
