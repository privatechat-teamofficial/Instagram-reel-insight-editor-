import React, { useRef } from 'react';
import { useInsights } from '../context/InsightsContext';
import { PRESET_LIST } from '../data/defaultData';
import { X, Sparkles, Download, Upload, RotateCcw, Check } from 'lucide-react';

export const PresetsModal: React.FC = () => {
  const {
    isPresetsModalOpen,
    setIsPresetsModalOpen,
    loadPreset,
    resetToDefaults,
    exportProjectJson,
    importProjectJson,
  } = useInsights();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isPresetsModalOpen) return null;

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const success = importProjectJson(content);
        if (success) {
          setIsPresetsModalOpen(false);
        } else {
          alert('Could not parse project JSON file.');
        }
      }
    };
    reader.readAsText(file);
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
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h3 className="text-[17px] font-semibold text-white">Presets & Project Options</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsPresetsModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#262626]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[12px] font-semibold text-gray-300">Choose Analytics Preset:</span>
          <div className="grid grid-cols-1 gap-2.5">
            {PRESET_LIST.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  loadPreset(preset.data);
                  setIsPresetsModalOpen(false);
                }}
                className="bg-[#121212] hover:bg-[#202020] border border-[#2a2a2a] hover:border-pink-500/50 rounded-xl p-3 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-white group-hover:text-pink-400 transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[10px] bg-pink-600/30 text-pink-300 px-2 py-0.5 rounded-full font-medium">
                      {preset.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">{preset.description}</span>
                </div>
                <div className="p-1 text-gray-500 group-hover:text-pink-400">
                  <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save & Load Project File */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#262626]">
          <span className="text-[12px] font-semibold text-gray-300">Backup & Transfer:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={exportProjectJson}
              className="py-2.5 px-3 bg-[#121212] hover:bg-[#222222] border border-[#333333] rounded-xl flex items-center justify-center gap-2 text-[12px] font-medium text-white transition-colors"
            >
              <Download className="w-4 h-4 text-pink-400" />
              Export Project JSON
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 bg-[#121212] hover:bg-[#222222] border border-[#333333] rounded-xl flex items-center justify-center gap-2 text-[12px] font-medium text-white transition-colors"
            >
              <Upload className="w-4 h-4 text-pink-400" />
              Import Project JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Reset All Values */}
        <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all values to the original reference video metrics?')) {
                resetToDefaults();
                setIsPresetsModalOpen(false);
              }
            }}
            className="text-[12px] text-red-400 hover:text-red-300 font-medium flex items-center gap-1.5 p-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all values to reference defaults
          </button>

          <button
            type="button"
            onClick={() => setIsPresetsModalOpen(false)}
            className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[#262626] hover:bg-[#333333] rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
