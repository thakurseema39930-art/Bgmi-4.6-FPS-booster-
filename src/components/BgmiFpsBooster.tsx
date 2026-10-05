import React, { useState } from 'react';
import { Smartphone, Zap, Sliders, CheckCircle2, ShieldAlert, Copy, Check, Download, AlertCircle } from 'lucide-react';

interface DeviceTierConfig {
  id: string;
  name: string;
  chipsets: string;
  targetFps: '60 FPS (Extreme)' | '90 FPS (Ultra Extreme)' | '120 FPS (Native Flagship)';
  inGameGraphics: string;
  style: string;
  antiAliasing: string;
  shadows: string;
  autoAdjust: string;
  brightness: string;
  audioQuality: string;
  thermalTip: string;
  devOptions: string[];
}

const DEVICE_TIERS: DeviceTierConfig[] = [
  {
    id: 'budget-60',
    name: 'Budget / Entry Tier (Snapdragon 680/695, Helio G99)',
    chipsets: 'Snapdragon 680, 695, Helio G88/G96/G99, Exynos 1280, Unisoc T616',
    targetFps: '60 FPS (Extreme)',
    inGameGraphics: 'Smooth',
    style: 'Colorful (Higher Contrast)',
    antiAliasing: 'Disabled (Close)',
    shadows: 'Disabled',
    autoAdjust: 'Disabled (Crucial to avoid sudden 30 FPS drops)',
    brightness: '120%',
    audioQuality: 'High (Do not use Ultra to save CPU overhead)',
    thermalTip: 'Remove heavy back-cover case and avoid gaming while charging below 30% battery.',
    devOptions: [
      'Enable "Disable HW Overlays" (Forces GPU compositing)',
      'Set Window & Transition animation scales to 0.5x',
      'Set Background Process Limit to "At most 2 processes"',
      'Turn OFF "Force 4x MSAA" (drains GPU bandwidth)',
    ],
  },
  {
    id: 'midrange-90',
    name: 'Mid-Range Performance (Snapdragon 778G / 870, Dimensity 8200)',
    chipsets: 'Snapdragon 778G, 7+ Gen 2, 870, 888, Dimensity 8100, 8200, 7200',
    targetFps: '90 FPS (Ultra Extreme)',
    inGameGraphics: 'Smooth',
    style: 'Colorful or Soft',
    antiAliasing: 'Disabled (Close)',
    shadows: 'Disabled',
    autoAdjust: 'Disabled',
    brightness: '130%',
    audioQuality: 'Ultra (With spatial download pack)',
    thermalTip: 'Use a portable phone cooler or clip-on fan during hot summer sessions to avoid 90Hz -> 60Hz thermal drop.',
    devOptions: [
      'Set Game Driver Preference -> Select BGMI -> System Graphics Driver',
      'Lock display refresh rate to fixed 90Hz or 120Hz (prevent LTPO variable downclocking)',
      'Clear BGMI cache before tournament or long rank push sessions',
    ],
  },
  {
    id: 'flagship-120',
    name: 'Flagship Esports (Snapdragon 8 Gen 2/3/4, Dimensity 9300, iPhone 15/16 Pro)',
    chipsets: 'Snapdragon 8 Gen 2, 8 Gen 3, 8 Elite, Dimensity 9200/9300+, Apple A17 Pro/M2/M4',
    targetFps: '120 FPS (Native Flagship)',
    inGameGraphics: 'Smooth',
    style: 'Colorful',
    antiAliasing: 'Disabled (Prevents micro-stutters during Pochinki 4v4 drops)',
    shadows: 'Disabled',
    autoAdjust: 'Disabled',
    brightness: '135%',
    audioQuality: 'Ultra (Dolby Atmos Spatial Audio enabled in phone settings)',
    thermalTip: 'Enable Bypass Charging (Charge Separation) in Game Space to power the phone directly without heating battery cells.',
    devOptions: [
      'Enable Peak Performance mode in phone Game Space (Disable battery saver)',
      'Turn OFF Low Power Mode on iOS (Low Power Mode caps iPhone screens to 60Hz!)',
      'Enable Guided Access on iPhone to lock out accidental notification gesture stutters',
      'Lock Touch Sampling Rate to 240Hz / 360Hz in gaming control panel',
    ],
  },
];

export const BgmiFpsBooster: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>('midrange-90');
  const [copiedSettings, setCopiedSettings] = useState<boolean>(false);

  const activeTier = DEVICE_TIERS.find((t) => t.id === selectedTierId) || DEVICE_TIERS[1];

  const handleCopySettings = () => {
    const text = `=== BGMI 4.6 OPTIMAL FPS CONFIGURATION ===
Device Tier: ${activeTier.name}
Recommended Frame Rate: ${activeTier.targetFps}

IN-GAME SETTINGS:
• Graphics Quality: ${activeTier.inGameGraphics}
• Frame Rate: ${activeTier.targetFps}
• Style: ${activeTier.style}
• Anti-Aliasing: ${activeTier.antiAliasing}
• Shadows: ${activeTier.shadows}
• Auto-Adjust Graphics: ${activeTier.autoAdjust}
• Brightness: ${activeTier.brightness}
• Audio Quality: ${activeTier.audioQuality}

DEVICE DEVELOPER TWEAKS:
${activeTier.devOptions.map((o) => `• ${o}`).join('\n')}

THERMAL PREVENTION TIP:
${activeTier.thermalTip}
==========================================`;

    navigator.clipboard.writeText(text);
    setCopiedSettings(true);
    setTimeout(() => setCopiedSettings(false), 2000);
  };

  const handleDownloadBat = () => {
    const content = `@echo off
echo ========================================================
echo  BGMI 4.6 & Android Optimization Helper
echo ========================================================
echo Selected Target: ${activeTier.targetFps}
echo.
echo 1. Ensure BGMI graphics are set to: SMOOTH
echo 2. Ensure Frame Rate is set to: ${activeTier.targetFps}
echo 3. Disable Auto-Adjust Graphics in BGMI settings.
echo 4. Set Display Refresh Rate to high (120Hz).
echo.
echo Recommended ADB commands (Optional for rooted/power users):
echo adb shell settings put system peak_refresh_rate 120.0
echo adb shell settings put system min_refresh_rate 120.0
echo.
echo Optimization guide saved. Good luck in Erangel!
pause`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BGMI_4.6_${activeTier.id}_Optimizer_Guide.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Zero Recoil & Framerate Stability Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              BGMI 4.6 90 / 120 FPS Graphics Calibrator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              100% account-safe, tournament-compliant settings calibrator. Prevents mid-fight thermal throttling, reduces touch latency, and locks frame pacing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySettings}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
            >
              {copiedSettings ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSettings ? 'Copied Config' : 'Copy All Settings'}</span>
            </button>
            <button
              onClick={handleDownloadBat}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Guide</span>
            </button>
          </div>
        </div>

        {/* Device Tier Selector Tabs */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium mb-2">Select Your Hardware Tier:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {DEVICE_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTierId(tier.id)}
                className={`p-3 text-left rounded-xl border transition cursor-pointer ${
                  selectedTierId === tier.id
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{tier.name.split('(')[0]}</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    {tier.targetFps.split(' ')[0]} FPS
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {tier.chipsets}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Settings Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* In-Game Settings Matrix (Col 1 & 2) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Recommended In-Game Settings</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              Target: {activeTier.targetFps}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-slate-400">Graphics Quality</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                {activeTier.inGameGraphics}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Never use HD/HDR in rank matches (causes frame drops).</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-slate-400">Frame Rate Option</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5 font-mono">
                {activeTier.targetFps}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Select highest unlocked frame rate available.</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-slate-400">Color Style</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">
                {activeTier.style}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Highlights enemy players against grass and tree shades.</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-slate-400">Anti-Aliasing (MSAA)</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5 font-mono">
                {activeTier.antiAliasing}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Disabling frees 20% GPU power for stable frame pacing.</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-slate-400">Auto-Adjust Graphics</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                {activeTier.autoAdjust}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">If enabled, game forcibly cuts your FPS to 30 when heating.</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-slate-400">Screen Brightness</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">
                {activeTier.brightness}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Improves visibility in dark houses without burning eyes.</div>
            </div>
          </div>

          {/* Thermal Management Advisory */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Thermal Throttling Prevention Protocol</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeTier.thermalTip}
            </p>
          </div>
        </div>

        {/* Device Developer Options & System Tweaks (Col 3) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">OS & Developer Options</h3>
            </div>

            <div className="space-y-3 text-xs">
              {activeTier.devOptions.map((opt, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 leading-normal">{opt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ban-Safe Guarantee */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>100% Ban-Safe & Official Rules Compliant</span>
            </div>
            <p className="text-slate-500">
              FrameCraft uses zero file tampering, memory injections, or illegal APK mods. All optimizations use official in-game graphics calibration and operating system hardware settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
