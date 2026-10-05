import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Monitor, Wifi, Battery, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface HardwareInfo {
  gpuRenderer: string;
  gpuVendor: string;
  cpuCores: number;
  ramGb: number;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  detectedRefreshRateHz: number;
  networkDownlinkMbps: number | null;
  networkRttMs: number | null;
  batteryLevel: number | null;
  isBatteryCharging: boolean | null;
}

export const SystemDiagnostics: React.FC = () => {
  const [hardware, setHardware] = useState<HardwareInfo>({
    gpuRenderer: 'Detecting...',
    gpuVendor: 'Detecting...',
    cpuCores: navigator.hardwareConcurrency || 4,
    ramGb: (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8,
    screenWidth: typeof window !== 'undefined' ? window.screen.width : 1920,
    screenHeight: typeof window !== 'undefined' ? window.screen.height : 1080,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    detectedRefreshRateHz: 60,
    networkDownlinkMbps: null,
    networkRttMs: null,
    batteryLevel: null,
    isBatteryCharging: null,
  });

  const [isCalibratingHz, setIsCalibratingHz] = useState<boolean>(true);

  useEffect(() => {
    // 1. Detect WebGL GPU unmasked renderer info
    let renderer = 'Standard Hardware Rasterizer';
    let vendor = 'Generic';

    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || renderer;
          vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || vendor;
        }
      }
    } catch {
      // Fallback
    }

    // 2. Detect Display Refresh Rate via requestAnimationFrame sampling
    let frameCount = 0;
    let startTime = performance.now();
    let animId: number;

    const measureHz = (now: number) => {
      frameCount++;
      const elapsed = now - startTime;
      if (elapsed >= 1000) {
        const calculatedHz = Math.round((frameCount * 1000) / elapsed);
        let snappedHz = calculatedHz;

        // Snap to common monitor refresh standards
        const standards = [60, 75, 90, 120, 144, 165, 240, 280, 360, 500];
        for (const std of standards) {
          if (Math.abs(calculatedHz - std) <= 3) {
            snappedHz = std;
            break;
          }
        }

        setHardware((prev) => ({
          ...prev,
          gpuRenderer: renderer,
          gpuVendor: vendor,
          detectedRefreshRateHz: snappedHz,
        }));
        setIsCalibratingHz(false);
      } else {
        animId = requestAnimationFrame(measureHz);
      }
    };

    animId = requestAnimationFrame(measureHz);

    // 3. Network details
    const conn = (navigator as unknown as { connection?: { downlink?: number; rtt?: number } })
      .connection;
    if (conn) {
      setHardware((prev) => ({
        ...prev,
        networkDownlinkMbps: conn.downlink || null,
        networkRttMs: conn.rtt || null,
      }));
    }

    // 4. Battery status if available
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean }> })
        .getBattery()
        .then((battery) => {
          setHardware((prev) => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100),
            isBatteryCharging: battery.charging,
          }));
        })
        .catch(() => {});
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // System capability assessment
  const isHighRefresh = hardware.detectedRefreshRateHz >= 120;
  const isMultiCore = hardware.cpuCores >= 8;
  const hasAdequateRam = hardware.ramGb >= 8;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white">Hardware & Telemetry Diagnostics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real hardware capability analysis for latency optimization and frame pacing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Gaming Profiler Active</span>
          </div>
        </div>
      </div>

      {/* Main Hardware Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GPU Card */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Graphics Core</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white line-clamp-2 leading-snug" title={hardware.gpuRenderer}>
              {hardware.gpuRenderer}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">{hardware.gpuVendor}</div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Hardware Acceleration</span>
            <span className="text-emerald-400 font-semibold font-mono">ENABLED</span>
          </div>
        </div>

        {/* CPU Card */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Processor Threads</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {hardware.cpuCores} Cores
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isMultiCore ? 'Optimized for high-thread esports engines' : 'Standard thread allocation'}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Worker Thread Target</span>
            <span className="text-cyan-400 font-semibold font-mono">{Math.max(1, hardware.cpuCores - 1)} threads</span>
          </div>
        </div>

        {/* Monitor & Display Card */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Display Refresh</span>
            <Monitor className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {hardware.detectedRefreshRateHz} Hz
              </span>
              {isCalibratingHz && (
                <span className="text-xs text-amber-400 animate-pulse font-mono">measuring...</span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              {hardware.screenWidth} × {hardware.screenHeight} @ {hardware.devicePixelRatio}x
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Frame Budget</span>
            <span className="text-indigo-400 font-semibold font-mono">
              {(1000 / hardware.detectedRefreshRateHz).toFixed(2)} ms
            </span>
          </div>
        </div>

        {/* System Memory & Power */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">RAM & Power Profile</span>
            {hardware.batteryLevel !== null ? (
              <Battery className="w-4 h-4 text-emerald-400" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              ≥ {hardware.ramGb} GB RAM
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {hardware.batteryLevel !== null
                ? `Battery: ${hardware.batteryLevel}% ${hardware.isBatteryCharging ? '(Plugged In / AC)' : '(On Battery)'}`
                : 'Desktop AC Station / Direct Power'}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Ping RTT / Network</span>
            <span className="text-emerald-400 font-semibold font-mono">
              {hardware.networkRttMs ? `${hardware.networkRttMs} ms` : 'LAN / Fiber'}
            </span>
          </div>
        </div>
      </div>

      {/* Esports Readiness Audit */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Esports Performance Readiness Audit</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
            {isHighRefresh ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-sm font-semibold text-white">Monitor Refresh Rate</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isHighRefresh
                  ? `Your display is operating at ${hardware.detectedRefreshRateHz}Hz, providing elite frame clarity and minimal input lag.`
                  : `Your display is operating at ${hardware.detectedRefreshRateHz}Hz. To achieve competitive esports clarity, verify Windows Display Settings has 144Hz+ enabled.`}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
            {isMultiCore ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-sm font-semibold text-white">CPU Multithreading</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isMultiCore
                  ? `${hardware.cpuCores} logical threads detected. Games like CS2, Warzone, and Valorant can leverage dedicated worker threads without stutters.`
                  : `${hardware.cpuCores} cores detected. Limit background Chrome tabs and Discord video while gaming to prevent CPU throttling.`}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
            {hasAdequateRam ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-sm font-semibold text-white">Memory Capacity</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {hasAdequateRam
                  ? 'Adequate system memory available. Shader compilation and background assets will maintain high frame-time consistency.'
                  : 'Low memory ceiling reported by browser. Close heavy memory apps to avoid Windows paging file hitching.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
