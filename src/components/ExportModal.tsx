import React, { useState } from 'react';
import { useInsights } from '../context/InsightsContext';
import { toPng } from 'html-to-image';
import { X, Download, Copy, Check, Sparkles, Loader2 } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, setIsEditMode } = useInsights();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isExportModalOpen) return null;

  const captureScreenshot = async () => {
    const node = document.getElementById('reel-insights-preview-container');
    if (!node) return;

    try {
      setIsCapturing(true);
      // Ensure edit mode is false during capture for pure visual
      setIsEditMode(false);

      // Brief delay for DOM to clear any active hover/edit states
      await new Promise((r) => setTimeout(r, 120));

      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#0d0f12',
      });

      setCapturedImageUrl(dataUrl);
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Could not generate image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = () => {
    if (!capturedImageUrl) return;
    const link = document.createElement('a');
    link.download = `reel-insights-${Date.now()}.png`;
    link.href = capturedImageUrl;
    link.click();
  };

  const handleCopy = async () => {
    if (!capturedImageUrl) return;
    try {
      const res = await fetch(capturedImageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Clipboard write failed:', e);
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h3 className="text-[17px] font-semibold text-white">Export Clean Screenshot</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-[#262626]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action / Preview Area */}
        <div className="flex flex-col items-center gap-4 py-2">
          {!capturedImageUrl ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <p className="text-[13px] text-gray-300 max-w-sm">
                Generates a clean, pixel-perfect high-resolution Instagram Reel Insights screenshot without any edit controls or outlines.
              </p>
              <button
                type="button"
                disabled={isCapturing}
                onClick={captureScreenshot}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-[14px] font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all"
              >
                {isCapturing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rendering Screenshot...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Screenshot Now
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Image preview frame */}
              <div className="max-h-[380px] w-auto overflow-auto rounded-xl border border-[#333333] shadow-lg bg-black">
                <img src={capturedImageUrl} alt="Rendered Preview" className="h-[360px] w-auto object-contain" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2.5 bg-[#262626] hover:bg-[#333333] text-white text-[13px] font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Image'}
                </button>

                <button
                  type="button"
                  onClick={captureScreenshot}
                  className="px-3 py-2.5 bg-[#262626] hover:bg-[#333333] text-gray-300 text-[12px] font-medium rounded-xl"
                  title="Re-render"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-[11px] text-gray-400">
          <span>Aspect Ratio: Native Mobile Viewport (1080×2400 @ 2x)</span>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
