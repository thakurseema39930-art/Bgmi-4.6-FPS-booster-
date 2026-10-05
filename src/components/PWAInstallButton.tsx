import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  // If already running as an installed PWA
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-lg">
        <Check className="w-3.5 h-3.5" />
        <span>Installed PWA</span>
      </div>
    );
  }

  // Chromium / Android / Desktop prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm shadow-emerald-900/40 cursor-pointer whitespace-nowrap"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-semibold">Install on iOS / Safari</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-mono text-xs shrink-0">1</div>
                  <p>Tap the <span className="font-semibold text-white">Share</span> icon in Safari's bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-mono text-xs shrink-0">2</div>
                  <p>Scroll down the share sheet and tap <span className="font-semibold text-white">Add to Home Screen</span>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-mono text-xs shrink-0">3</div>
                  <p>Launch <span className="font-semibold text-white">FrameCraft</span> directly from your home screen for zero-latency fullscreen mode.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser manual installation helper button
  return (
    <>
      <button
        onClick={() => setShowManualModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        title="Install as desktop or mobile app"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>

      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold">Install FrameCraft App</h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <p>
                FrameCraft is a Progressive Web App (PWA) designed to run as a dedicated, hardware-accelerated desktop utility or mobile app.
              </p>
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
                <div className="font-semibold text-emerald-400">Desktop (Chrome / Edge / Brave):</div>
                <p>Click the <strong>Install</strong> or <strong>App available</strong> icon in your browser address bar (top-right next to bookmarks).</p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
                <div className="font-semibold text-emerald-400">Mobile / Tablet:</div>
                <p>Open browser options (⋮ or Share) and select <strong>Add to Home Screen</strong> / <strong>Install App</strong>.</p>
              </div>
            </div>
            <button
              onClick={() => setShowManualModal(false)}
              className="mt-5 w-full rounded-lg bg-slate-800 hover:bg-slate-700 py-2 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
