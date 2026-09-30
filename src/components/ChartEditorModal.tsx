import React, { useState, useRef } from 'react';
import { useInsights } from '../context/InsightsContext';
import { ChartDataPoint } from '../types/insights';
import { analyzeGraphImage, fileToBase64, GraphAnalysisResult } from '../utils/graphImageAnalyzer';
import {
  X,
  Plus,
  Trash2,
  Check,
  TrendingUp,
  Upload,
  Sparkles,
  Loader2,
  Layers,
  Wand2,
  Sliders,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const ChartEditorModal: React.FC = () => {
  const { isChartModalOpen, setIsChartModalOpen, data, setData } = useInsights();
  const [points, setPoints] = useState<ChartDataPoint[]>(data.viewsChart.points);
  const [dates, setDates] = useState<string[]>(data.viewsChart.dates);
  const [yMax, setYMax] = useState<number>(data.viewsChart.yMax);
  const [autoUpdateSummary, setAutoUpdateSummary] = useState<boolean>(true);

  // Image analysis & tracing overlay states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<GraphAnalysisResult | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(40); // 0 to 100%
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      all: points[points.length - 1]?.all ? Math.round(points[points.length - 1].all * 1.05) : 1000,
      followers: 0,
      nonFollowers: points[points.length - 1]?.nonFollowers ? Math.round(points[points.length - 1].nonFollowers * 1.05) : 1000,
    };
    setPoints((prev) => [...prev, newPt]);
  };

  const handleRemovePoint = (index: number) => {
    if (points.length <= 2) return;
    setPoints((prev) => prev.filter((_, i) => i !== index));
  };

  // Quick Preset Trajectories
  const applyPreset = (presetType: 'screenshot_plateau' | 'reference' | 'viral' | 'steady' | 'flat') => {
    if (presetType === 'screenshot_plateau') {
      // 1:1 exact matching trajectory from Screenshot_20260930-113835.png
      setYMax(2000);
      setDates(['29 Sept', '30 Sept', '1 Oct']);
      setPoints([
        { id: '1', label: '29 Sept', all: 0, followers: 0, nonFollowers: 0, typical: 0, hasData: true },
        { id: '2', label: '29 Sept', all: 180, followers: 0, nonFollowers: 180, typical: 120, hasData: true },
        { id: '3', label: '29 Sept', all: 320, followers: 0, nonFollowers: 320, typical: 140, hasData: true },
        { id: '4', label: '29 Sept', all: 850, followers: 0, nonFollowers: 850, typical: 160, hasData: true },
        { id: '5', label: '29 Sept', all: 1550, followers: 0, nonFollowers: 1550, typical: 180, hasData: true },
        { id: '6', label: '29 Sept', all: 2000, followers: 0, nonFollowers: 2000, typical: 200, hasData: true },
        { id: '7', label: '30 Sept', all: 2000, followers: 0, nonFollowers: 2000, typical: 230, hasData: true },
        { id: '8', label: '30 Sept', all: 2000, followers: 0, nonFollowers: 2000, typical: 260, hasData: true },
        { id: '9', label: '30 Sept', all: 2000, followers: 0, nonFollowers: 2000, typical: 300, hasData: true },
        { id: '10', label: '30 Sept', all: 2000, followers: 0, nonFollowers: 2000, typical: 320, hasData: true },
        { id: '11', label: '30 Sept', all: 2000, followers: 0, nonFollowers: 2000, typical: 340, hasData: true },
        { id: '12', label: '30 Sept', all: 2000, followers: 0, nonFollowers: 2000, typical: 350, hasData: false },
        { id: '13', label: '1 Oct', all: 2000, followers: 0, nonFollowers: 2000, typical: 360, hasData: false },
        { id: '14', label: '1 Oct', all: 2000, followers: 0, nonFollowers: 2000, typical: 370, hasData: false },
        { id: '15', label: '1 Oct', all: 2000, followers: 0, nonFollowers: 2000, typical: 380, hasData: false },
        { id: '16', label: '1 Oct', all: 2000, followers: 0, nonFollowers: 2000, typical: 390, hasData: false },
        { id: '17', label: '1 Oct', all: 2000, followers: 0, nonFollowers: 2000, typical: 400, hasData: false },
        { id: '18', label: '1 Oct', all: 2000, followers: 0, nonFollowers: 2000, typical: 400, hasData: false },
      ]);
    } else if (presetType === 'reference') {
      // 1:1 exact matching trajectory from 12-29 Sept reference
      setYMax(4000);
      setDates(['12 Sept', '21 Sept', '29 Sept']);
      setPoints([
        { id: '1', label: '12 Sept', all: 180, followers: 0, nonFollowers: 180, typical: 40, hasData: true },
        { id: '2', label: '13 Sept', all: 360, followers: 0, nonFollowers: 360, typical: 60, hasData: true },
        { id: '3', label: '13 Sept', all: 480, followers: 0, nonFollowers: 480, typical: 80, hasData: true },
        { id: '4', label: '14 Sept', all: 430, followers: 0, nonFollowers: 430, typical: 100, hasData: true },
        { id: '5', label: '14 Sept', all: 450, followers: 0, nonFollowers: 450, typical: 120, hasData: true },
        { id: '6', label: '15 Sept', all: 1400, followers: 0, nonFollowers: 1400, typical: 150, hasData: true },
        { id: '7', label: '15 Sept', all: 2400, followers: 0, nonFollowers: 2400, typical: 180, hasData: true },
        { id: '8', label: '16 Sept', all: 3180, followers: 0, nonFollowers: 3180, typical: 200, hasData: true },
        { id: '9', label: '17 Sept', all: 3160, followers: 0, nonFollowers: 3160, typical: 220, hasData: true },
        { id: '10', label: '18 Sept', all: 3140, followers: 0, nonFollowers: 3140, typical: 230, hasData: true },
        { id: '11', label: '19 Sept', all: 3150, followers: 0, nonFollowers: 3150, typical: 240, hasData: true },
        { id: '12', label: '20 Sept', all: 3350, followers: 0, nonFollowers: 3350, typical: 250, hasData: true },
        { id: '13', label: '21 Sept', all: 3550, followers: 0, nonFollowers: 3550, typical: 260, hasData: true },
        { id: '14', label: '22 Sept', all: 3680, followers: 0, nonFollowers: 3680, typical: 270, hasData: true },
        { id: '15', label: '23 Sept', all: 3750, followers: 0, nonFollowers: 3750, typical: 280, hasData: true },
        { id: '16', label: '25 Sept', all: 3800, followers: 0, nonFollowers: 3800, typical: 290, hasData: true },
        { id: '17', label: '27 Sept', all: 3830, followers: 0, nonFollowers: 3830, typical: 300, hasData: true },
        { id: '18', label: '29 Sept', all: 3850, followers: 0, nonFollowers: 3850, typical: 310, hasData: true },
      ]);
    } else if (presetType === 'viral') {
      setYMax(50000);
      setDates(['1 Oct', '15 Oct', '30 Oct']);
      setPoints([
        { id: '1', label: '1 Oct', all: 500, followers: 0, nonFollowers: 500, typical: 100, hasData: true },
        { id: '2', label: '5 Oct', all: 1200, followers: 0, nonFollowers: 1200, typical: 300, hasData: true },
        { id: '3', label: '10 Oct', all: 4500, followers: 0, nonFollowers: 4500, typical: 600, hasData: true },
        { id: '4', label: '12 Oct', all: 18000, followers: 0, nonFollowers: 18000, typical: 900, hasData: true },
        { id: '5', label: '15 Oct', all: 38000, followers: 0, nonFollowers: 38000, typical: 1200, hasData: true },
        { id: '6', label: '20 Oct', all: 46000, followers: 0, nonFollowers: 46000, typical: 1500, hasData: true },
        { id: '7', label: '30 Oct', all: 49500, followers: 0, nonFollowers: 49500, typical: 1800, hasData: true },
      ]);
    } else if (presetType === 'steady') {
      setYMax(10000);
      setDates(['1 Jun', '15 Jun', '30 Jun']);
      setPoints([
        { id: '1', label: '1 Jun', all: 1000, followers: 0, nonFollowers: 1000, typical: 200, hasData: true },
        { id: '2', label: '8 Jun', all: 3200, followers: 0, nonFollowers: 3200, typical: 500, hasData: true },
        { id: '3', label: '15 Jun', all: 5600, followers: 0, nonFollowers: 5600, typical: 800, hasData: true },
        { id: '4', label: '22 Jun', all: 7800, followers: 0, nonFollowers: 7800, typical: 1100, hasData: true },
        { id: '5', label: '30 Jun', all: 9600, followers: 0, nonFollowers: 9600, typical: 1400, hasData: true },
      ]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const previewUrl = await fileToBase64(file);
      setUploadedImagePreview(previewUrl);

      const result = await analyzeGraphImage(file, (msg) => {
        setAnalysisStatus(msg);
      });

      setAnalysisResult(result);
      setYMax(result.yMax);
      setDates(result.dates);
      setPoints(result.points);

      // Auto update summary if requested
      if (autoUpdateSummary && result.summary) {
        setData((prev) => ({
          ...prev,
          summary: {
            ...prev.summary,
            views: result.summary?.views ?? prev.summary.views,
            viewers: result.summary?.viewers ?? prev.summary.viewers,
            averageWatchTime: result.summary?.averageWatchTime ?? prev.summary.averageWatchTime,
            follows: result.summary?.follows ?? prev.summary.follows,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to parse graph image:', err);
      alert('Could not trace image. Try another screenshot or pick a preset.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAllDetectedMetrics = () => {
    if (!analysisResult) return;
    setData((prev) => ({
      ...prev,
      summary: {
        ...prev.summary,
        views: analysisResult.summary?.views ?? prev.summary.views,
        viewers: analysisResult.summary?.viewers ?? prev.summary.viewers,
        averageWatchTime: analysisResult.summary?.averageWatchTime ?? prev.summary.averageWatchTime,
        follows: analysisResult.summary?.follows ?? prev.summary.follows,
      },
      topMetrics: {
        ...prev.topMetrics,
        likes: analysisResult.topMetrics?.likes ?? prev.topMetrics.likes,
        comments: analysisResult.topMetrics?.comments ?? prev.topMetrics.comments,
        reposts: analysisResult.topMetrics?.reposts ?? prev.topMetrics.reposts,
        shares: analysisResult.topMetrics?.shares ?? prev.topMetrics.shares,
        saves: analysisResult.topMetrics?.saves ?? prev.topMetrics.saves,
      },
    }));
  };

  const handleSave = () => {
    const lastPoint = points[points.length - 1];
    setData((prev) => ({
      ...prev,
      viewsChart: {
        ...prev.viewsChart,
        points,
        dates,
        yMax: Number(yMax) || 4000,
      },
      summary: autoUpdateSummary && lastPoint
        ? {
            ...prev.summary,
            views: Math.max(prev.summary.views, Math.round(lastPoint.all * 1.15)),
          }
        : prev.summary,
    }));
    setIsChartModalOpen(false);
  };

  // Preview coordinates for live SVG
  const svgW = 340;
  const svgH = 110;
  const pad = 10;
  const maxVal = Math.max(...points.map((p) => p.all), ...points.map((p) => p.typical || 0), yMax || 1);

  // Filter active points for "This reel"
  const activePoints = points.map((p, idx) => ({ ...p, origIdx: idx })).filter((p) => p.hasData !== false);

  const pathD = activePoints.reduce((acc, curr, idx) => {
    const x = pad + (curr.origIdx / (points.length - 1 || 1)) * (svgW - pad * 2);
    const y = pad + (svgH - pad * 2) - (curr.all / maxVal) * (svgH - pad * 2);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const typicalPathD = points.reduce((acc, curr, idx) => {
    const x = pad + (idx / (points.length - 1 || 1)) * (svgW - pad * 2);
    const typ = curr.typical ?? Math.round(curr.all * 0.12);
    const y = pad + (svgH - pad * 2) - (typ / maxVal) * (svgH - pad * 2);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#14171a] border border-[#262c33] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#ec008c]" />
            <div>
              <h3 className="text-[16px] font-bold text-white leading-tight">Views Graph & Image Precision Editor</h3>
              <p className="text-[11px] text-[#8e959b]">Upload graph screenshot to auto-trace or fine-tune coordinates</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsChartModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#1c2024]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. UPLOAD IMAGE & AUTO-RENDER FEATURE */}
        <div className="bg-[#1c2024] p-3.5 rounded-xl border border-[#2b313a] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ec008c]" />
              Auto-Extract Graph From Image
            </span>
            <span className="text-[10px] text-[#ec008c] font-medium bg-[#ec008c]/15 px-2 py-0.5 rounded-full">
              AI + Pixel Color Tracer
            </span>
          </div>

          <p className="text-[11px] text-[#8e959b] leading-relaxed">
            Upload any screenshot of an Instagram Reel Insights graph. The system scans the magenta curve, axis numbers, and dates to reproduce the exact graph shape.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:flex-1 py-3 px-4 bg-[#252a30] hover:bg-[#2e343d] border border-dashed border-[#3d4550] hover:border-[#ec008c] rounded-xl flex items-center justify-center gap-2 text-[12.5px] font-medium text-white transition-all group"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#ec008c] animate-spin" />
                  <span>{analysisStatus || 'Scanning screenshot...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#ec008c] group-hover:scale-110 transition-transform" />
                  <span>Upload Screenshot & Auto-Trace Curve</span>
                </>
              )}
            </button>

            {uploadedImagePreview && (
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#3d4550] shrink-0 bg-black">
                <img src={uploadedImagePreview} alt="Uploaded Graph" className="w-full h-full object-cover" />
                <div className="absolute top-0.5 right-0.5 bg-green-500 rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* If screenshot metrics were detected */}
          {analysisResult?.summary && (
            <div className="bg-[#14171a] p-2.5 rounded-lg border border-[#2e353e] flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
              <div className="text-[11px]">
                <span className="text-white font-semibold">Detected Metrics: </span>
                <span className="text-[#8e959b]">
                  Views: {analysisResult.summary.views?.toLocaleString()} · Viewers: {analysisResult.summary.viewers?.toLocaleString()} · Watch Time: {analysisResult.summary.averageWatchTime}
                </span>
              </div>
              <button
                type="button"
                onClick={handleApplyAllDetectedMetrics}
                className="px-2.5 py-1 bg-[#252a30] hover:bg-[#ec008c] text-white text-[10.5px] font-medium rounded-md transition-colors shrink-0"
              >
                Apply All Metrics
              </button>
            </div>
          )}

          {/* Quick Shape Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10.5px] text-[#8e959b]">Quick Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('screenshot_plateau')}
              className="px-2.5 py-1 text-[10.5px] font-bold bg-[#ec008c] hover:bg-[#d80070] text-white rounded-md transition-colors shadow-sm flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Screenshot Match (29 Sept - 1 Oct, 3,043 Views)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('reference')}
              className="px-2.5 py-1 text-[10.5px] font-semibold bg-[#2a2f35] hover:bg-[#343a42] text-pink-400 rounded-md transition-colors border border-pink-500/20"
            >
              12-29 Sept Full Span
            </button>
            <button
              type="button"
              onClick={() => applyPreset('viral')}
              className="px-2.5 py-1 text-[10.5px] font-medium bg-[#22262c] hover:bg-[#2b3138] text-gray-300 rounded-md transition-colors"
            >
              Viral Spike (50K)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('steady')}
              className="px-2.5 py-1 text-[10.5px] font-medium bg-[#22262c] hover:bg-[#2b3138] text-gray-300 rounded-md transition-colors"
            >
              Steady Linear (10K)
            </button>
          </div>
        </div>

        {/* 2. REAL-TIME INTERACTIVE SVG CANVAS WITH IMAGE OVERLAY TRACING */}
        <div className="bg-[#0d0f12] p-3.5 rounded-xl border border-[#21262d] flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-[#8e959b]">
            <span className="font-semibold text-white">Live Curve Visualizer ({points.length} points)</span>
            <span className="font-mono text-white/90">Peak: {yMax.toLocaleString()}</span>
          </div>

          {/* Canvas with optional uploaded screenshot background overlay */}
          <div className="relative w-full h-[120px] rounded-lg overflow-hidden bg-[#090b0d] border border-[#1e2227] flex items-center justify-center">
            {uploadedImagePreview && (
              <img
                src={uploadedImagePreview}
                alt="Tracing Overlay"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-150"
                style={{ opacity: overlayOpacity / 100 }}
              />
            )}

            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full relative z-10 overflow-visible p-2">
              {/* Grid lines */}
              <line x1={pad} y1={pad} x2={svgW - pad} y2={pad} stroke="#20242a" strokeWidth="1" />
              <line x1={pad} y1={svgH / 2} x2={svgW - pad} y2={svgH / 2} stroke="#20242a" strokeWidth="1" />
              <line x1={pad} y1={svgH - pad} x2={svgW - pad} y2={svgH - pad} stroke="#20242a" strokeWidth="1" />

              {/* Typical Baseline Dashed line */}
              <path
                d={typicalPathD}
                fill="none"
                stroke="#5c6370"
                strokeWidth="2.0"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Exact Magenta line (active points only) */}
              <path
                d={pathD}
                fill="none"
                stroke="#FE36FF"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive nodes along curve */}
              {points.map((pt, idx) => {
                const x = pad + (idx / (points.length - 1 || 1)) * (svgW - pad * 2);
                const hasData = pt.hasData !== false;
                const y = pad + (svgH - pad * 2) - (pt.all / maxVal) * (svgH - pad * 2);
                const isSelected = selectedPointIndex === idx;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={isSelected ? 5 : hasData ? 2.8 : 2}
                    fill={isSelected ? '#ffffff' : hasData ? '#FE36FF' : '#5c6370'}
                    stroke={isSelected ? '#FE36FF' : 'none'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all hover:scale-150"
                    onClick={() => setSelectedPointIndex(idx)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Quick Slider for Selected Node */}
          {selectedPointIndex !== null && points[selectedPointIndex] && (
            <div className="bg-[#1c2024] p-2.5 rounded-lg border border-[#2e353e] flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-semibold text-white">Node #{selectedPointIndex + 1} ({points[selectedPointIndex].label}):</span>
                <span className="text-[#FE36FF] font-mono">{points[selectedPointIndex].all.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={yMax}
                step={50}
                value={points[selectedPointIndex].all}
                onChange={(e) => handlePointChange(selectedPointIndex, 'all', Number(e.target.value))}
                className="flex-1 accent-[#FE36FF] h-1.5 bg-[#2a2f36] rounded-full cursor-pointer"
              />
              <button
                type="button"
                onClick={() =>
                  handlePointChange(selectedPointIndex, 'hasData', !(points[selectedPointIndex].hasData !== false))
                }
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  points[selectedPointIndex].hasData !== false
                    ? 'bg-[#FE36FF]/20 text-[#FE36FF] border border-[#FE36FF]/40'
                    : 'bg-[#2a2f36] text-gray-400'
                }`}
              >
                {points[selectedPointIndex].hasData !== false ? 'Active Line' : 'Line Stops Here'}
              </button>
            </div>
          )}

          {/* Overlay Opacity Controls if Image was uploaded */}
          {uploadedImagePreview && (
            <div className="flex items-center gap-3 pt-1 text-[11px] text-[#8e959b]">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#ec008c]" />
                Image Overlay Opacity:
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="flex-1 accent-[#ec008c] h-1.5 bg-[#252a30] rounded-full"
              />
              <span className="font-mono w-8 text-right text-white">{overlayOpacity}%</span>
            </div>
          )}
        </div>

        {/* 3. Y-AXIS SCALE & DATE BOUNDARIES */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8e959b]">Y-Axis Peak (Max View Scale)</label>
            <input
              type="number"
              value={yMax}
              onChange={(e) => setYMax(Number(e.target.value))}
              className="bg-[#0d0f12] border border-[#2d333b] rounded-xl px-3 py-1.5 text-[13.5px] text-white focus:outline-none focus:border-[#ec008c] tabular-numbers"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8e959b]">Date Markers (Start - Mid - End)</label>
            <div className="flex gap-1.5">
              {dates.map((d, i) => (
                <input
                  key={i}
                  type="text"
                  value={d}
                  onChange={(e) => handleDateChange(i, e.target.value)}
                  className="w-1/3 bg-[#0d0f12] border border-[#2d333b] rounded-lg px-2 py-1.5 text-[11px] text-white text-center focus:outline-none focus:border-[#ec008c]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4. GRANULAR DATA POINTS LIST */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-gray-200">
              Trajectory Nodes ({points.length} points)
            </label>
            <button
              type="button"
              onClick={handleAddPoint}
              className="text-[#ec008c] hover:opacity-80 text-[11px] font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Node
            </button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
            {points.map((pt, idx) => (
              <div
                key={pt.id || idx}
                onClick={() => setSelectedPointIndex(idx)}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                  selectedPointIndex === idx
                    ? 'bg-[#252b33] border-[#ec008c]'
                    : 'bg-[#1c2024] border-[#282f37]'
                }`}
              >
                <div className="w-5 text-[10.5px] text-[#8e959b] font-mono text-center">#{idx + 1}</div>

                <div className="flex-1 grid grid-cols-4 gap-1.5 items-center">
                  <div>
                    <span className="block text-[8.5px] text-[#8e959b]">Label</span>
                    <input
                      type="text"
                      value={pt.label}
                      onChange={(e) => handlePointChange(idx, 'label', e.target.value)}
                      className="w-full bg-[#090b0d] border border-[#2d333b] rounded px-2 py-0.5 text-[11px] text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-[8.5px] text-[#FE36FF]">This Reel</span>
                    <input
                      type="number"
                      value={pt.all}
                      onChange={(e) => handlePointChange(idx, 'all', Number(e.target.value))}
                      className="w-full bg-[#090b0d] border border-[#2d333b] rounded px-2 py-0.5 text-[11px] text-white tabular-numbers"
                    />
                  </div>
                  <div>
                    <span className="block text-[8.5px] text-[#8e959b]">Typical</span>
                    <input
                      type="number"
                      value={pt.typical ?? Math.round(pt.all * 0.12)}
                      onChange={(e) => handlePointChange(idx, 'typical', Number(e.target.value))}
                      className="w-full bg-[#090b0d] border border-[#2d333b] rounded px-2 py-0.5 text-[11px] text-[#8e959b] tabular-numbers"
                    />
                  </div>
                  <div>
                    <span className="block text-[8.5px] text-[#8e959b]">Status</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePointChange(idx, 'hasData', !(pt.hasData !== false));
                      }}
                      className={`w-full py-0.5 rounded text-[10px] font-medium border text-center ${
                        pt.hasData !== false
                          ? 'bg-[#FE36FF]/15 text-[#FE36FF] border-[#FE36FF]/30'
                          : 'bg-[#14171a] text-[#8e959b] border-[#2d333b]'
                      }`}
                    >
                      {pt.hasData !== false ? 'Active' : 'Future'}
                    </button>
                  </div>
                </div>

                {points.length > 2 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePoint(idx);
                    }}
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
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#21262d]">
          <button
            type="button"
            onClick={() => setIsChartModalOpen(false)}
            className="px-4 py-2 text-[12.5px] font-medium text-gray-400 hover:text-white rounded-xl bg-[#1c2024]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-[12.5px] font-semibold text-white rounded-xl bg-[#ec008c] hover:bg-[#d80070] shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply to Reel Insights
          </button>
        </div>
      </div>
    </div>
  );
};
