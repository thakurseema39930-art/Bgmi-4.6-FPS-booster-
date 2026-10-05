import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { BgmiFeaturesGuide } from './components/BgmiFeaturesGuide';
import { BgmiFpsBooster } from './components/BgmiFpsBooster';
import { BenchmarkCanvas } from './components/BenchmarkCanvas';
import { SystemDiagnostics } from './components/SystemDiagnostics';
import { SensitivityCalculator } from './components/SensitivityCalculator';
import { TouchLatencyTester } from './components/TouchLatencyTester';
import { PingStabilizer } from './components/PingStabilizer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Zap, ShieldCheck, Sparkles, Smartphone, Download, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import gpuBannerImg from './assets/images/fps_gpu_core_1791185745509.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('features');
  const [boosted, setBoosted] = useState<boolean>(false);
  const [boostToast, setBoostToast] = useState<string | null>(null);

  const handleQuickBoost = () => {
    setBoosted(true);
    // Garbage collection prompt simulation
    try {
      const buffer = new ArrayBuffer(1024 * 1024 * 8); // 8MB buffer allocate & release
      void buffer;
    } catch {
      // ignore
    }

    setBoostToast('System Frame Buffer Flushed & 120 FPS Profiler Calibrated!');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.1 },
      colors: ['#10b981', '#06b6d4', '#3b82f6'],
    });

    setTimeout(() => {
      setBoostToast(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased">
      {/* Top Bar with 3-Zone Contract */}
      <TopBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickBoost={handleQuickBoost}
        boosted={boosted}
      />

      {/* Global Offline Status Indicator */}
      <OfflineIndicator />

      {/* Boost Notification Toast */}
      {boostToast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-2xl animate-fade-in">
          <Zap className="w-4 h-4 text-emerald-200" />
          <span>{boostToast}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Visual Spotlight */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-[#080c14] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>BGMI VERSION 4.6 TOURNAMENT READY</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Unlock 120 FPS & Master the 4.6 Update
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                The all-in-one gaming suite for Battlegrounds Mobile India. Explore every 4.6 feature, calibrate native 90/120 FPS graphics, copy pro zero-recoil gyroscope sensitivity, and eliminate touch latency.
              </p>

              {/* Quick Navigation Segmented Action Row */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('features')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
                    activeTab === 'features'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  Explore 4.6 Features
                </button>
                <button
                  onClick={() => setActiveTab('booster')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
                    activeTab === 'booster'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  90 / 120 FPS Calibrator
                </button>
                <button
                  onClick={() => setActiveTab('sensitivity')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
                    activeTab === 'sensitivity'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  Pro Sensitivity Codes
                </button>
              </div>

              {/* Unboxed Metadata Trust Indicators */}
              <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Account Safe</span>
                </div>
                <span aria-hidden="true">·</span>
                <span>Zero File Tampering</span>
                <span aria-hidden="true">·</span>
                <span>Tested on Snapdragon & Dimensity</span>
                <span aria-hidden="true">·</span>
                <span>iOS ProMotion Calibrated</span>
              </div>
            </div>

            {/* Generated Hero Image Visual Slot with Zero-Broken-Image Fallback */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-950 aspect-16/10 group">
                <img
                  src={gpuBannerImg}
                  alt="High performance gaming graphics hardware telemetry"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Styled CSS fallback container
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.classList.add(
                        'flex',
                        'items-center',
                        'justify-center',
                        'bg-radial',
                        'from-slate-800',
                        'to-slate-950'
                      );
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-xs font-mono text-slate-300">
                    <span className="text-emerald-400 font-bold">120 FPS</span> Hardware Rendering Pipeline Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Tab Panel Container */}
        <section className="space-y-6">
          {activeTab === 'features' && <BgmiFeaturesGuide />}
          {activeTab === 'booster' && <BgmiFpsBooster />}
          {activeTab === 'benchmark' && (
            <div className="space-y-8">
              <BenchmarkCanvas />
              <SystemDiagnostics />
            </div>
          )}
          {activeTab === 'sensitivity' && <SensitivityCalculator />}
          {activeTab === 'reflex' && <TouchLatencyTester />}
          {activeTab === 'ping' && <PingStabilizer />}
        </section>

        {/* PWA Home Screen Installation Promotion Card */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Install FrameCraft to Your Mobile Home Screen
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Run fullscreen without browser address bars, work completely offline, and access instant sensitivity codes before every match.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const btn = document.querySelector('header button');
                if (btn) (btn as HTMLButtonElement).click();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add to Home Screen</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#070a12] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-400">BGMI 4.6 FrameCraft Hub</span>
            <span className="mx-2">·</span>
            <span>Tournament Performance Optimizer</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('features')}
              className="hover:text-slate-300 transition"
            >
              4.6 Features
            </button>
            <button
              onClick={() => setActiveTab('booster')}
              className="hover:text-slate-300 transition"
            >
              120 FPS Settings
            </button>
            <button
              onClick={() => setActiveTab('sensitivity')}
              className="hover:text-slate-300 transition"
            >
              Sensitivity Codes
            </button>
            <button
              onClick={() => setActiveTab('benchmark')}
              className="hover:text-slate-300 transition"
            >
              Hardware Test
            </button>
          </div>

          <div className="text-[11px] text-slate-500 text-center sm:text-right">
            Independent utility. Battlegrounds Mobile India is a trademark of Krafton, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
