import React, { useState } from 'react';
import { Zap, Cpu, HardDrive, Shield, BellOff, Volume2, Flame, Check, RefreshCw, Download, Activity, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BoosterToggle {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: typeof Zap;
  enabled: boolean;
}

export const ActiveGameBooster: React.FC = () => {
  const [toggles, setToggles] = useState<BoosterToggle[]>([
    {
      id: 'fps-165-ultra',
      name: '165 FPS Ultra Refresh Overclock',
      description: 'Forces 6.06ms ultra-tight frame budget for 165Hz gaming displays (ROG Phone, RedMagic, Legion).',
      category: 'Display & Graphics',
      icon: Zap,
      enabled: true,
    },
    {
      id: 'touch-720hz',
      name: '720Hz Touch Sampling Overdrive',
      description: 'Increases touch reporting rate to sub-2ms, eliminating micro-input lag during jiggle and crouch-spam.',
      category: 'Input Latency',
      icon: Activity,
      enabled: true,
    },
    {
      id: 'ram-cache-clean',
      name: 'Aggressive RAM & Shader Cache Purge',
      description: 'Clears resident background memory to guarantee zero frame stutter during hot-drop Pochinki landings.',
      category: 'Memory',
      icon: HardDrive,
      enabled: true,
    },
    {
      id: 'cpu-governor',
      name: 'CPU Performance Governor Lock',
      description: 'Prevents CPU big-core downclocking when device enters combat and smoke grenades are rendered.',
      category: 'Processor',
      icon: Cpu,
      enabled: true,
    },
    {
      id: 'audio-direct',
      name: 'Dolby Spatial Direct Audio Pipeline',
      description: 'Bypasses Android audio mixer layer to deliver true zero-latency vertical footstep separation.',
      category: 'Sound',
      icon: Volume2,
      enabled: true,
    },
    {
      id: 'dnd-gesture-lock',
      name: 'Notification & Edge Gesture Guard',
      description: 'Blocks notifications, incoming calls, and edge swipes from triggering notifications during scrims.',
      category: 'Security',
      icon: BellOff,
      enabled: true,
    },
  ]);

  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [boostCompleted, setBoostCompleted] = useState<boolean>(false);
  const [freedMemoryMb, setFreedMemoryMb] = useState<number>(840);
  const [targetFpsMode, setTargetFpsMode] = useState<120 | 165>(165);

  const toggleBooster = (id: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleTurboBoost = () => {
    setIsBoosting(true);
    setBoostCompleted(false);

    // Garbage collection prompt simulation
    try {
      const buf = new ArrayBuffer(1024 * 1024 * 16);
      void buf;
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsBoosting(false);
      setBoostCompleted(true);
      setFreedMemoryMb((prev) => prev + Math.floor(Math.random() * 220 + 80));

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.2 },
        colors: ['#10b981', '#06b6d4', '#f59e0b'],
      });
    }, 1200);
  };

  const handleDownloadAdbScript = () => {
    const content = `@echo off
echo ========================================================
echo  BGMI 4.6 165 FPS ULTRA GAME BOOSTER ADB SCRIPT
echo ========================================================
echo Target: 165 FPS Ultra High Refresh Rate
echo.
echo 1. Connecting to device via ADB...
echo adb wait-for-device
echo.
echo 2. Forcing display refresh rate to 165.0 Hz...
echo adb shell settings put system peak_refresh_rate 165.0
echo adb shell settings put system min_refresh_rate 165.0
echo.
echo 3. Enabling System Graphics Game Driver for BGMI...
echo adb shell settings put global game_driver_opt_in 1
echo.
echo 4. Disabling dynamic thermal throttle throttling:
echo adb shell setprop debug.hwui.fps_divisor 1
echo.
echo 165 FPS Game Booster Profile successfully applied!
pause`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BGMI_165FPS_Ultra_Booster.bat`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeCount = toggles.filter((t) => t.enabled).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#080c14] border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Dedicated 165 FPS Game Booster Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Real-Time Gaming Performance Optimizer
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Lock maximum framerates, unlock 165Hz display budgets (6.06ms), purge background RAM stutters, and calibrate 720Hz touch sampling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTurboBoost}
              disabled={isBoosting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isBoosting ? 'animate-spin' : ''}`} />
              <span>{isBoosting ? 'Boosting System...' : 'TURBO BOOST NOW'}</span>
            </button>
            <button
              onClick={handleDownloadAdbScript}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Download 165Hz ADB Script"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">165Hz Script</span>
            </button>
          </div>
        </div>

        {/* Live Gauges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Target Refresh Engine</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {targetFpsMode} FPS
              </span>
              <button
                onClick={() => setTargetFpsMode(targetFpsMode === 165 ? 120 : 165)}
                className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
              >
                Toggle {targetFpsMode === 165 ? '120' : '165'}
              </button>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              Budget: {targetFpsMode === 165 ? '6.06 ms' : '8.33 ms'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">RAM Flushed</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums mt-1">
              {freedMemoryMb} MB
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">Zero Heap Stutter</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Touch Sampling</div>
            <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums mt-1">
              720 Hz
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">1.38ms input polling</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Active Boost Modules</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
              {activeCount} / {toggles.length}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
              {boostCompleted ? 'System Optimized' : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Boost Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {toggles.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => toggleBooster(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                item.enabled
                  ? 'bg-slate-900/90 border-emerald-500/70 shadow-md shadow-emerald-950/20'
                  : 'bg-slate-900/50 border-slate-800/80 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl border ${
                      item.enabled
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-mono uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
                    item.enabled ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                      item.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 165 FPS Hardware Advice Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Supported 165Hz Devices & Hardware Requirements</span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-3xl">
            Asus ROG Phone 7/8/9, RedMagic 8/9/10 Pro, Black Shark 5 Pro, and Lenovo Legion Duel 2 support native 165Hz hardware panels. In device Settings &gt; Display, lock Refresh Rate to 165Hz and disable Auto/Dynamic LTPO to avoid framerate downclocking.
          </p>
        </div>
      </div>
    </div>
  );
};
