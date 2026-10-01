import React, { useState, useRef, useEffect } from 'react';
import { useInsights } from '../context/InsightsContext';
import { SAMPLE_MEDIA } from '../data/defaultData';
import { X, Upload, Check, Video, Image as ImageIcon } from 'lucide-react';

export const MediaUploaderModal: React.FC = () => {
  const { isMediaModalOpen, setIsMediaModalOpen, data, setData } = useInsights();
  const [selectedUrl, setSelectedUrl] = useState(data.mediaUrl);
  const [selectedType, setSelectedType] = useState<'image' | 'video'>(data.mediaType);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or active media changes
  useEffect(() => {
    if (isMediaModalOpen) {
      setSelectedUrl(data.mediaUrl);
      setSelectedType(data.mediaType);
      setCustomUrl('');
    }
  }, [isMediaModalOpen, data.mediaUrl, data.mediaType]);

  if (!isMediaModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);
    setSelectedUrl(url);
    setSelectedType(isVid ? 'video' : 'image');
  };

  const handleApply = () => {
    const finalUrl = customUrl.trim() || selectedUrl;
    setData((prev) => ({
      ...prev,
      mediaUrl: finalUrl,
      mediaType: selectedType,
    }));
    setIsMediaModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-400" />
            <h3 className="text-[17px] font-semibold text-white">Reel Media Preview</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#262626]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Button */}
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 border-2 border-dashed border-[#383838] hover:border-pink-500 rounded-xl bg-[#121212] flex flex-col items-center justify-center gap-2 text-center group transition-colors"
          >
            <Upload className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-[14px] font-medium text-white">Upload image or video from your device</span>
              <span className="text-[11px] text-gray-400">Supports MP4, MOV, PNG, JPG, WebP</span>
            </div>
          </button>

          {/* Sample Presets */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[12px] font-semibold text-gray-300">Or pick a sample template:</span>
            <div className="grid grid-cols-5 gap-2">
              {SAMPLE_MEDIA.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedUrl(item.url);
                    setSelectedType(item.type);
                  }}
                  className={`relative aspect-[9/16] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedUrl === item.url ? 'border-pink-500 scale-102 ring-2 ring-pink-500/40' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  {selectedUrl === item.url && (
                    <div className="absolute top-1 right-1 bg-pink-600 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Direct URL input */}
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-[11px] text-gray-400">Or paste media image URL:</label>
            <input
              type="text"
              placeholder="https://..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333333] rounded-xl px-3 py-2 text-[13px] text-white focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#262626]">
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(false)}
            className="px-4 py-2 text-[13px] font-medium text-gray-400 hover:text-white rounded-xl bg-[#262626]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-[13px] font-semibold text-white rounded-xl bg-pink-600 hover:bg-pink-500 shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Set Reel Media
          </button>
        </div>
      </div>
    </div>
  );
};
