import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import { ChartDataPoint } from '../types/insights';
import {
  X,
  Check,
  TrendingUp,
  Sparkles,
  Sliders,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const TypicalGraphModal: React.FC = () => {
  const { isTypicalModalOpen, setIsTypicalModalOpen, data, setData } = useInsights();

  // Local state initialized with current viewsChart data
  const [points, setPoints] = useState<ChartDataPoint[]>(data.viewsChart.points);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(points.length - 1);
  const [targetPeakViews, setTargetPeakViews] = useState<number>(() => {
    const lastTypical = points[points.length - 1]?.typical;
    if (lastTypical !== undefined) return lastTypical;
    return 400;
  });
  const [curveShape, setCurveShape] = useState<'smooth' | 'linear' | 'early_rise'>('smooth');

  if (!isTypicalModalOpen) return null;

  const currentDates = data.viewsChart.dates;
  const yMax = data.viewsChart.yMax || 2000;

  // Handler for individual node typical change
  const handleTypicalChange = (index: number, val: number) => {
    setPoints((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], typical: Math.max(0, val) };
      return copy;
    });
  };

  // Generate smooth typical curve across all points to reach peakViews
  const applyGeneratedTypicalCurve = (peak: number, shape: 'smooth' | 'linear' | 'early_rise') => {
    setPoints((prev) =>
      prev.map((pt, idx) => {
        if (idx === 0) {
          return { ...pt, typical: 0 };
        }
        const t = idx / (prev.length - 1 || 1);
        let factor = t;

        if (shape === 'smooth') {
          // Smooth S-curve (sigmoid-like easeInOutQuad)
          factor = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        } else if (shape === 'early_rise') {
          // Quick logarithmic rise then flat
          factor = Math.pow(t, 0.45);
        } else {
          // Linear
          factor = t;
        }

        const typicalVal = Math.round(peak * factor);
        return {
          ...pt,
          typical: typicalVal,
        };
      })
    );
  };

  // Preset Handlers
  const handleApplyPreset = (preset: 'screenshot' | 'low' | 'average' | 'high' | 'proportional') => {
    if (preset === 'screenshot') {
      setTargetPeakViews(400);
      applyGeneratedTypicalCurve(400, 'smooth');
    } else if (preset === 'low') {
      setTargetPeakViews(150);
      applyGeneratedTypicalCurve(150, 'smooth');
    } else if (preset === 'average') {
      setTargetPeakViews(600);
      applyGeneratedTypicalCurve(600, 'smooth');
    } else if (preset === 'high') {
      setTargetPeakViews(1200);
      applyGeneratedTypicalCurve(1200, 'smooth');
    } else if (preset === 'proportional') {
      // 15% of this reel's views at each point
      setPoints((prev) =>
        prev.map((pt, idx) => {
          if (idx === 0) return { ...pt, typical: 0 };
          return {
            ...pt,
            typical: Math.round((pt.all || 100) * 0.15),
          };
        })
      );
      const last = points[points.length - 1];
      if (last) setTargetPeakViews(Math.round(last.all * 0.15));
    }
  };

  // Save changes
  const handleSave = () => {
    setData((prev) => ({
      ...prev,
      viewsChart: {
        ...prev.viewsChart,
        points,
      },
    }));
    setIsTypicalModalOpen(false);
  };

  // Close without saving
  const handleCancel = () => {
    setIsTypicalModalOpen(false);
  };

  // SVG preview calculations
  const svgWidth = 320;
  const svgHeight = 90;
  const pad = 10;
  const chartW = svgWidth - pad * 2;
  const chartH = svgHeight - pad * 2;

  const maxVal = Math.max(...points.map((p) => p.all), ...points.map((p) => p.typical || 0), yMax);

  // Typical path coordinates (gray dashed line)
  const typicalCoords = points.map((p, i) => {
    const t = i / (points.length - 1 || 1);
    const x = pad + t * chartW;
    const typVal = i === 0 ? 0 : p.typical ?? Math.round(p.all * 0.12);
    const y = pad + chartH - (typVal / (maxVal || 1)) * chartH;
    return { x, y, val: typVal, pt: p };
  });

  const typicalPath = typicalCoords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Reel path coordinates (magenta line in background)
  const reelCoords = points.map((p, i) => {
    const t = i / (points.length - 1 || 1);
    const x = pad + t * chartW;
    const y = pad + chartH - (p.all / (maxVal || 1)) * chartH;
    return { x, y, val: p.all, hasData: p.hasData !== false };
  });

  const activeReelCoords = reelCoords.filter((c, idx) => idx === 0 || c.hasData);
  const reelPath = activeReelCoords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const selectedTypicalVal = typicalCoords[selectedNodeIdx]?.val ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#16191d] border border-[#2b313a] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#242a32]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#5c6370]/20 flex items-center justify-center text-[#8e959b]">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-white leading-tight">Edit Typical Video Graph</h3>
              <p className="text-[11px] text-[#8e959b]">
                Customize the gray dashed baseline (&quot;Your typical reel&quot;)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#1c2024]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Live Visualizer */}
        <div className="bg-[#0e1114] p-3 rounded-xl border border-[#21262d] flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5c6370]" />
              Typical Reel Curve Preview
            </span>
            <div className="flex items-center gap-3 text-[#8e959b] text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-[#FE36FF]" /> This Reel
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 border-t border-dashed border-[#5c6370]" /> Typical Baseline
              </span>
            </div>
          </div>

          {/* SVG Chart Preview */}
          <div className="relative w-full h-[95px] rounded-lg bg-[#07090b] border border-[#1a1e23] flex items-center justify-center overflow-hidden">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" className="w-full h-full p-2">
              {/* Grid Lines */}
              <line x1={pad} y1={pad} x2={svgWidth - pad} y2={pad} stroke="#1a1e24" strokeWidth="1" />
              <line x1={pad} y1={pad + chartH / 2} x2={svgWidth - pad} y2={pad + chartH / 2} stroke="#1a1e24" strokeWidth="1" />
              <line x1={pad} y1={pad + chartH} x2={svgWidth - pad} y2={pad + chartH} stroke="#1a1e24" strokeWidth="1" />

              {/* Background Reference: This Reel (Solid pink with reduced opacity) */}
              <path
                d={reelPath}
                fill="none"
                stroke="#FE36FF"
                strokeWidth="2.2"
                strokeOpacity="0.45"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Your Typical Reel (Dashed Gray Highlighted Line) */}
              <path
                d={typicalPath}
                fill="none"
                stroke="#8e959b"
                strokeWidth="2.8"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Nodes for Typical Curve */}
              {typicalCoords.map((c, idx) => {
                const isSelected = selectedNodeIdx === idx;
                return (
                  <g key={idx} className="cursor-pointer" onClick={() => setSelectedNodeIdx(idx)}>
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isSelected ? 6 : 3.5}
                      fill={isSelected ? '#ffffff' : '#5c6370'}
                      stroke={isSelected ? '#8e959b' : '#16191d'}
                      strokeWidth="1.5"
                      className="transition-all hover:scale-125"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Node Quick Slider */}
          {selectedNodeIdx !== null && points[selectedNodeIdx] && (
            <div className="bg-[#181c21] p-2 rounded-lg border border-[#282f38] flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-semibold text-white">Node #{selectedNodeIdx + 1} ({points[selectedNodeIdx].label}):</span>
                <span className="text-white font-mono font-bold">{selectedTypicalVal.toLocaleString()} views</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(1000, targetPeakViews * 2)}
                step={10}
                value={selectedTypicalVal}
                onChange={(e) => handleTypicalChange(selectedNodeIdx, Number(e.target.value))}
                className="flex-1 accent-[#8e959b] h-1.5 bg-[#252b33] rounded-full cursor-pointer"
              />
              <input
                type="number"
                value={selectedTypicalVal}
                onChange={(e) => handleTypicalChange(selectedNodeIdx, Number(e.target.value))}
                className="w-16 bg-[#090b0d] border border-[#2d333b] rounded px-1.5 py-0.5 text-[11px] text-white font-mono text-right"
              />
            </div>
          )}
        </div>

        {/* 2. Curve Generator (Peak Views + Shape) */}
        <div className="bg-[#13161a] p-3 rounded-xl border border-[#232932] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Generate Typical Curve
            </span>
            <span className="text-[10px] text-[#8e959b]">Interpolates smoothly from 0 to peak</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
            <div>
              <label className="block text-[10px] text-[#8e959b] mb-1">Target Peak Views</label>
              <input
                type="number"
                min="0"
                step="50"
                value={targetPeakViews}
                onChange={(e) => setTargetPeakViews(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#0a0c0e] border border-[#2b313b] rounded-lg px-2.5 py-1.5 text-[12px] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#8e959b] mb-1">Trajectory Style</label>
              <select
                value={curveShape}
                onChange={(e) => setCurveShape(e.target.value as any)}
                className="w-full bg-[#0a0c0e] border border-[#2b313b] rounded-lg px-2 py-1.5 text-[11px] text-white"
              >
                <option value="smooth">Smooth S-Curve (Realistic)</option>
                <option value="linear">Linear Steady Rise</option>
                <option value="early_rise">Early Rise &amp; Plateau</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => applyGeneratedTypicalCurve(targetPeakViews, curveShape)}
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply Curve
            </button>
          </div>
        </div>

        {/* 3. Quick Presets */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-[#8e959b] font-medium">Quick Typical Presets:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyPreset('screenshot')}
              className="px-2.5 py-1.5 bg-[#1a1e23] hover:bg-[#252b32] text-white text-[11px] rounded-lg border border-[#282f38] text-left transition-colors flex flex-col"
            >
              <span className="font-semibold text-blue-400">Screenshot (400 views)</span>
              <span className="text-[9.5px] text-[#8e959b]">Instagram baseline match</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset('average')}
              className="px-2.5 py-1.5 bg-[#1a1e23] hover:bg-[#252b32] text-white text-[11px] rounded-lg border border-[#282f38] text-left transition-colors flex flex-col"
            >
              <span className="font-semibold text-white">Average (600 views)</span>
              <span className="text-[9.5px] text-[#8e959b]">Balanced steady climb</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset('high')}
              className="px-2.5 py-1.5 bg-[#1a1e23] hover:bg-[#252b32] text-white text-[11px] rounded-lg border border-[#282f38] text-left transition-colors flex flex-col"
            >
              <span className="font-semibold text-white">High (1,200 views)</span>
              <span className="text-[9.5px] text-[#8e959b]">High performer standard</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset('low')}
              className="px-2.5 py-1.5 bg-[#1a1e23] hover:bg-[#252b32] text-white text-[11px] rounded-lg border border-[#282f38] text-left transition-colors flex flex-col"
            >
              <span className="font-semibold text-white">Modest (150 views)</span>
              <span className="text-[9.5px] text-[#8e959b]">Slow initial trajectory</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset('proportional')}
              className="px-2.5 py-1.5 bg-[#1a1e23] hover:bg-[#252b32] text-white text-[11px] rounded-lg border border-[#282f38] text-left transition-colors flex flex-col col-span-2 sm:col-span-1"
            >
              <span className="font-semibold text-pink-400">15% of Current Reel</span>
              <span className="text-[9.5px] text-[#8e959b]">Follows reel trajectory</span>
            </button>
          </div>
        </div>

        {/* 4. Granular Node Points Table */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-white">Granular Points ({points.length} nodes)</span>
            <span className="text-[10px] text-[#8e959b]">Date span: {currentDates.join(' → ')}</span>
          </div>

          <div className="max-h-36 overflow-y-auto rounded-lg border border-[#21262d] bg-[#0c0e11] divide-y divide-[#1c2026]">
            {points.map((pt, idx) => {
              const typVal = pt.typical ?? Math.round(pt.all * 0.12);
              const isSelected = selectedNodeIdx === idx;
              return (
                <div
                  key={pt.id || idx}
                  onClick={() => setSelectedNodeIdx(idx)}
                  className={`flex items-center justify-between px-3 py-1.5 text-[11px] cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#1b2027]' : 'hover:bg-[#121519]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#8e959b] font-mono text-[10px] w-5">#{idx + 1}</span>
                    <span className="text-white font-medium">{pt.label}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#8e959b]">
                      Reel: <span className="text-[#FE36FF] font-mono">{pt.all.toLocaleString()}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#8e959b]">Typical:</span>
                      <input
                        type="number"
                        min="0"
                        value={typVal}
                        onChange={(e) => handleTypicalChange(idx, Number(e.target.value))}
                        className="w-16 bg-[#161a1f] border border-[#2b313b] rounded px-1.5 py-0.5 text-right font-mono text-[11px] text-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-[#242a32] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl text-[12px] font-medium text-gray-300 hover:text-white bg-[#1a1e23] hover:bg-[#252b32] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-[12px] font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply Typical Graph
          </button>
        </div>
      </div>
    </div>
  );
};
