import React, { useState, useRef, useEffect } from 'react';
import { useInsights } from '../context/InsightsContext';
import { SAMPLE_MEDIA } from '../data/defaultData';
import { X, Upload, Check, Video, Image as ImageIcon } from 'lucide-react';

export const MediaUploaderModal: React.FC = () => {
  const {
    isMediaModalOpen,
    setIsMediaModalOpen,
    mediaUploadTarget,
    setMediaUploadTarget,
    data,
    setData,
  } = useInsights();

  const [applyToAll, setApplyToAll] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(data.mediaUrl);
  const [selectedType, setSelectedType] = useState<'image' | 'video'>(data.mediaType);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or target changes
  useEffect(() => {
    if (isMediaModalOpen) {
      if (mediaUploadTarget === 'retention') {
        setSelectedUrl(data.retentionMediaUrl || data.mediaUrl);
        setSelectedType(data.retentionMediaType || data.mediaType);
      } else if (mediaUploadTarget === 'engagement') {
        setSelectedUrl(data.engagementMediaUrl || data.mediaUrl);
        setSelectedType(data.engagementMediaType || data.mediaType);
      } else {
        setSelectedUrl(data.mediaUrl);
        setSelectedType(data.mediaType);
      }
      setCustomUrl('');
    }
  }, [isMediaModalOpen, mediaUploadTarget, data]);

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

    setData((prev) => {
      if (applyToAll) {
        return {
          ...prev,
          mediaUrl: finalUrl,
          mediaType: selectedType,
          retentionMediaUrl: finalUrl,
          retentionMediaType: selectedType,
          engagementMediaUrl: finalUrl,
          engagementMediaType: selectedType,
        };
      }

      if (mediaUploadTarget === 'retention') {
        return {
          ...prev,
          retentionMediaUrl: finalUrl,
          retentionMediaType: selectedType,
        };
      }

      if (mediaUploadTarget === 'engagement') {
        return {
          ...prev,
          engagementMediaUrl: finalUrl,
          engagementMediaType: selectedType,
        };
      }

      // Default: main top reel preview
      return {
        ...prev,
        mediaUrl: finalUrl,
        mediaType: selectedType,
      };
    });

    setIsMediaModalOpen(false);
  };

  const getTargetTitle = () => {
    if (mediaUploadTarget === 'retention') return 'Watched Retention Thumbnail (Overview)';
    if (mediaUploadTarget === 'engagement') return 'Liked Section Thumbnail (Engagement)';
    return 'Main Top Reel Media';
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
            <h3 className="text-[17px] font-semibold text-white">Thumbnail & Media Uploader</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#262626]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Selector Tabs */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-gray-400">Target Thumbnail:</span>
          <div className="grid grid-cols-3 gap-1.5 bg-[#121212] p-1 rounded-xl border border-[#262626]">
            <button
              type="button"
              onClick={() => {
                setMediaUploadTarget('main');
                setSelectedUrl(data.mediaUrl);
                setSelectedType(data.mediaType);
              }}
              className={`py-1.5 px-2 rounded-lg text-[11.5px] font-medium transition-all text-center ${
                mediaUploadTarget === 'main'
                  ? 'bg-pink-600 text-white shadow-sm font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Main Reel
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaUploadTarget('retention');
                setSelectedUrl(data.retentionMediaUrl || data.mediaUrl);
                setSelectedType(data.retentionMediaType || data.mediaType);
              }}
              className={`py-1.5 px-2 rounded-lg text-[11.5px] font-medium transition-all text-center ${
                mediaUploadTarget === 'retention'
                  ? 'bg-pink-600 text-white shadow-sm font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Watched (Overview)
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaUploadTarget('engagement');
                setSelectedUrl(data.engagementMediaUrl || data.mediaUrl);
                setSelectedType(data.engagementMediaType || data.mediaType);
              }}
              className={`py-1.5 px-2 rounded-lg text-[11.5px] font-medium transition-all text-center ${
                mediaUploadTarget === 'engagement'
                  ? 'bg-pink-600 text-white shadow-sm font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Liked (Engagement)
            </button>
          </div>
          <span className="text-[11px] text-pink-400 font-medium mt-0.5">
            Editing: {getTargetTitle()}
          </span>
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
            className="w-full py-3.5 border-2 border-dashed border-[#383838] hover:border-pink-500 rounded-xl bg-[#121212] flex flex-col items-center justify-center gap-2 text-center group transition-colors"
          >
            <Upload className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-[13.5px] font-medium text-white">Upload image or video from your device</span>
              <span className="text-[11px] text-gray-400">Supports MP4, MOV, PNG, JPG, WebP</span>
            </div>
          </button>

          {/* Sample Presets */}
          <div className="flex flex-col gap-2 pt-0.5">
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
          <div className="flex flex-col gap-1.5 pt-0.5">
            <label className="text-[11px] text-gray-400">Or paste media image URL:</label>
            <input
              type="text"
              placeholder="https://..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333333] rounded-xl px-3 py-2 text-[13px] text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Apply to all checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="w-4 h-4 rounded text-pink-600 focus:ring-0 focus:ring-offset-0 bg-[#0d0d0d] border-[#383838]"
            />
            <span className="text-[12px] text-gray-300">
              Apply this thumbnail to all sections (Main, Watched, Liked)
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262626]">
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
            Save Thumbnail
          </button>
        </div>
      </div>
    </div>
  );
};
