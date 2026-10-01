import React from 'react';
import { useInsights } from '../context/InsightsContext';
import {
  Sparkles,
  Upload,
  Camera,
  RotateCcw,
  Download,
  Layers,
  Globe,
  Sliders,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export const SideControlPanel: React.FC = () => {
  const {
    isEditMode,
    toggleEditMode,
    activeTab,
    setActiveTab,
    audienceSubTab,
    setAudienceSubTab,
    setIsMediaModalOpen,
    setIsChartModalOpen,
    setIsPresetsModalOpen,
    setIsExportModalOpen,
    resetToDefaults,
    addCountryItem,
  } = useInsights();

  return (
    <aside className="w-80 bg-[#121212] border border-[#222222] rounded-2xl p-5 flex flex-col gap-5 text-white shadow-2xl shrink-0 hidden lg:flex">
      {/* Title & Brand */}
      <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
        <div className="flex flex-col">
          <span className="text-[10px] text-pink-400 font-semibold tracking-wider uppercase">Visual Mockup Studio</span>
          <h2 className="text-[17px] font-bold text-white tracking-tight">Reel Insights Editor</h2>
        </div>
        <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
          <Sliders className="w-4 h-4 text-pink-400" />
        </div>
      </div>

      {/* Edit Mode Master Switch */}
      <div
        onClick={toggleEditMode}
        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
          isEditMode
            ? 'bg-pink-950/40 border-pink-500/80 shadow-md shadow-pink-950/30'
            : 'bg-[#181818] border-[#2c2c2c] hover:border-[#3c3c3c]'
        }`}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-white">Edit Mode</span>
            {isEditMode && (
              <span className="text-[9px] bg-pink-600 text-white font-semibold px-1.5 py-0.5 rounded-full">
                ACTIVE
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-400">
            {isEditMode ? 'Tap any metric on phone to edit' : 'Tap header or click here to edit'}
          </span>
        </div>

        {/* Toggle Pill */}
        <div
          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
            isEditMode ? 'bg-pink-600 justify-end' : 'bg-[#333333] justify-start'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
        </div>
      </div>

      {/* Navigation Quick Jump */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Quick Navigation</span>
        <div className="grid grid-cols-3 gap-1 bg-[#181818] p-1 rounded-xl border border-[#262626]">
          {(['overview', 'engagement', 'audience'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 text-[11px] font-medium rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-pink-600 text-white font-semibold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Subtabs if in audience */}
        {activeTab === 'audience' && (
          <div className="flex items-center gap-1 mt-1">
            {(['country', 'age', 'gender'] as const).map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setAudienceSubTab(sub)}
                className={`flex-1 py-1 text-[10px] font-medium rounded-md capitalize border transition-all ${
                  audienceSubTab === sub
                    ? 'bg-[#2a2a2a] border-pink-500/60 text-white'
                    : 'bg-[#181818] border-transparent text-gray-400'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action shortcuts */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Mockup Tools</span>

        <button
          type="button"
          onClick={() => setIsMediaModalOpen(true)}
          className="w-full py-2.5 px-3 bg-[#181818] hover:bg-[#242424] border border-[#2b2b2b] rounded-xl flex items-center justify-between text-[12px] font-medium text-white transition-all group"
        >
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-pink-400" />
            <span>Upload Reel Media</span>
          </div>
          <Upload className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
        </button>

        <button
          type="button"
          onClick={() => setIsPresetsModalOpen(true)}
          className="w-full py-2.5 px-3 bg-[#181818] hover:bg-[#242424] border border-[#2b2b2b] rounded-xl flex items-center justify-between text-[12px] font-medium text-white transition-all group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Analytics Presets (5.6K, 1.8M)</span>
          </div>
          <Layers className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
        </button>

        <button
          type="button"
          onClick={() => setIsChartModalOpen(true)}
          className="w-full py-2.5 px-3 bg-[#181818] hover:bg-[#242424] border border-[#2b2b2b] rounded-xl flex items-center justify-between text-[12px] font-medium text-white transition-all group"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <span>Edit Views Chart Curve</span>
          </div>
          <Sliders className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('audience');
            setAudienceSubTab('country');
            addCountryItem('United States', 6.5);
          }}
          className="w-full py-2.5 px-3 bg-[#181818] hover:bg-[#242424] border border-[#2b2b2b] rounded-xl flex items-center justify-between text-[12px] font-medium text-white transition-all group"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-pink-400" />
            <span>Add Custom Country</span>
          </div>
          <span className="text-[10px] text-pink-400 font-semibold">+ Add</span>
        </button>
      </div>

      {/* GitHub Actions CI/CD Info Card */}
      <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-3 flex flex-col gap-1.5 text-[11px]">
        <div className="flex items-center gap-1.5 text-pink-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>GitHub APK Release CI/CD</span>
        </div>
        <p className="text-gray-400 text-[10px] leading-relaxed">
          Workflow configured in <code className="text-gray-200">.github/workflows/build-and-release-apk.yml</code>. Pushing to GitHub builds & releases the APK in Releases assets automatically.
        </p>
      </div>

      {/* Primary Export CTA */}
      <div className="mt-auto pt-3 border-t border-[#222222] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all"
        >
          <Download className="w-4 h-4" />
          Export Clean Screenshot
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm('Reset to reference default metrics?')) {
              resetToDefaults();
            }
          }}
          className="text-center text-[11px] text-gray-400 hover:text-red-400 transition-colors py-1 flex items-center justify-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset to default reference
        </button>
      </div>
    </aside>
  );
};
