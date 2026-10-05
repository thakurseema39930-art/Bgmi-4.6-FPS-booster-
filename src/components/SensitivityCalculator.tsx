import React, { useState } from 'react';
import { Crosshair, Copy, Check, Sparkles, Smartphone, RotateCcw } from 'lucide-react';

interface SensPreset {
  id: string;
  name: string;
  description: string;
  style: 'Full Gyro' | 'Non-Gyro' | 'Hybrid';
  code: string;
  camera: {
    tppNoScope: number;
    fppNoScope: number;
    redDot: number;
    scope2x: number;
    scope3x: number;
    scope4x: number;
    scope6x: number;
    scope8x: number;
  };
  ads: {
    tppNoScope: number;
    redDot: number;
    scope3x: number;
    scope4x: number;
    scope6x: number;
  };
  gyro: {
    tppNoScope: number;
    redDot: number;
    scope3x: number;
    scope4x: number;
    scope6x: number;
    scope8x: number;
  };
}

const PRESETS: SensPreset[] = [
  {
    id: 'pro-full-gyro',
    name: 'Pro Laser Recoil (Full Gyroscope 300-400%)',
    description: 'Esports tournament meta preset for M416 3x/6x laser spray and instant 180° gyro reflex transfers.',
    style: 'Full Gyro',
    code: '7238-4921-9034-8219-021',
    camera: {
      tppNoScope: 125,
      fppNoScope: 120,
      redDot: 55,
      scope2x: 40,
      scope3x: 30,
      scope4x: 22,
      scope6x: 14,
      scope8x: 10,
    },
    ads: {
      tppNoScope: 110,
      redDot: 60,
      scope3x: 35,
      scope4x: 25,
      scope6x: 18,
    },
    gyro: {
      tppNoScope: 380,
      redDot: 400,
      scope3x: 280,
      scope4x: 220,
      scope6x: 120,
      scope8x: 80,
    },
  },
  {
    id: 'non-gyro-master',
    name: 'Touch Drag Master (Non-Gyro Screen Pull)',
    description: 'Calibrated for players who prefer pure finger dragging without physical phone tilting.',
    style: 'Non-Gyro',
    code: '7192-3814-5502-1849-042',
    camera: {
      tppNoScope: 140,
      fppNoScope: 135,
      redDot: 70,
      scope2x: 52,
      scope3x: 40,
      scope4x: 32,
      scope6x: 20,
      scope8x: 14,
    },
    ads: {
      tppNoScope: 145,
      redDot: 78,
      scope3x: 48,
      scope4x: 38,
      scope6x: 24,
    },
    gyro: {
      tppNoScope: 0,
      redDot: 0,
      scope3x: 0,
      scope4x: 0,
      scope6x: 0,
      scope8x: 0,
    },
  },
  {
    id: 'hybrid-balanced',
    name: 'Hybrid Balanced (Touch Camera + Gyro Spray)',
    description: 'Uses touch for fast 360° situational awareness and gentle gyro tilt for mid/long-range micro-adjustments.',
    style: 'Hybrid',
    code: '7304-8192-6631-4091-033',
    camera: {
      tppNoScope: 130,
      fppNoScope: 125,
      redDot: 60,
      scope2x: 45,
      scope3x: 32,
      scope4x: 24,
      scope6x: 16,
      scope8x: 12,
    },
    ads: {
      tppNoScope: 120,
      redDot: 65,
      scope3x: 38,
      scope4x: 28,
      scope6x: 20,
    },
    gyro: {
      tppNoScope: 280,
      redDot: 300,
      scope3x: 220,
      scope4x: 180,
      scope6x: 95,
      scope8x: 65,
    },
  },
];

export const SensitivityCalculator: React.FC = () => {
  const [activePresetId, setActivePresetId] = useState<string>('pro-full-gyro');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [deviceMultiplier, setDeviceMultiplier] = useState<number>(1); // Screen size scale (Phone 1x, Tablet 0.85x)

  const activePreset = PRESETS.find((p) => p.id === activePresetId) || PRESETS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activePreset.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const scale = (val: number) => Math.round(val * deviceMultiplier);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Crosshair className="w-4 h-4" />
              <span>BGMI 4.6 Pro Sensitivity Matrix</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Zero Recoil Sensitivity & Gyroscope Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Calibrated for the 4.6 weapon rebalance. Transfer instant 6x sprayed down to 3x lasers with accurate gyro degrees per second.
            </p>
          </div>

          {/* Share Code Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-emerald-800/60">
            <div>
              <div className="text-[11px] text-slate-400 font-mono">BGMI SHARE CODE</div>
              <div className="text-sm font-bold font-mono text-emerald-400">
                {activePreset.code}
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Preset Selector & Device Scale */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setActivePresetId(preset.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition cursor-pointer ${
                  activePresetId === preset.id
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {preset.name.split('(')[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Device Factor:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setDeviceMultiplier(1)}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  deviceMultiplier === 1
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mobile Phone
              </button>
              <button
                onClick={() => setDeviceMultiplier(0.85)}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  deviceMultiplier === 0.85
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                iPad / Tablet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sensitivity Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Camera Sensitivity */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Camera Sensitivity</h3>
            <span className="text-[11px] text-slate-400">Screen Swiping</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">TPP No Scope</span>
              <span className="font-bold text-emerald-400">{scale(activePreset.camera.tppNoScope)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Red Dot / Holo</span>
              <span className="font-bold text-white">{scale(activePreset.camera.redDot)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">2x Scope</span>
              <span className="font-bold text-white">{scale(activePreset.camera.scope2x)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">3x Scope</span>
              <span className="font-bold text-cyan-400">{scale(activePreset.camera.scope3x)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">4x Scope</span>
              <span className="font-bold text-white">{scale(activePreset.camera.scope4x)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">6x Scope</span>
              <span className="font-bold text-cyan-400">{scale(activePreset.camera.scope6x)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">8x Sniper</span>
              <span className="font-bold text-slate-300">{scale(activePreset.camera.scope8x)}%</span>
            </div>
          </div>
        </div>

        {/* ADS Sensitivity (Firing) */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">ADS Sensitivity</h3>
            <span className="text-[11px] text-slate-400">Recoil Pull-Down</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">TPP No Scope</span>
              <span className="font-bold text-emerald-400">{scale(activePreset.ads.tppNoScope)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Red Dot / Holo</span>
              <span className="font-bold text-white">{scale(activePreset.ads.redDot)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">3x Scope (M416)</span>
              <span className="font-bold text-cyan-400">{scale(activePreset.ads.scope3x)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">4x Scope (DMR)</span>
              <span className="font-bold text-white">{scale(activePreset.ads.scope4x)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">6x Scope</span>
              <span className="font-bold text-cyan-400">{scale(activePreset.ads.scope6x)}%</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 mt-4">
            If your crosshair goes upward while spraying, increase ADS by +3%. If it drags into the floor, reduce by -3%.
          </div>
        </div>

        {/* Gyroscope Sensitivity */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Gyroscope Sensitivity</h3>
            <span className="text-[11px] text-slate-400">Phone Tilt Sensor</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">TPP No Scope</span>
              <span className="font-bold text-emerald-400">{scale(activePreset.gyro.tppNoScope)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">Red Dot / Holo</span>
              <span className="font-bold text-white">{scale(activePreset.gyro.redDot)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">3x Scope</span>
              <span className="font-bold text-cyan-400">{scale(activePreset.gyro.scope3x)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">4x Scope</span>
              <span className="font-bold text-white">{scale(activePreset.gyro.scope4x)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">6x Scope</span>
              <span className="font-bold text-cyan-400">{scale(activePreset.gyro.scope6x)}%</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-slate-400">8x Sniper</span>
              <span className="font-bold text-slate-300">{scale(activePreset.gyro.scope8x)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* How to Import in BGMI 4.6 Instructions */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
        <div className="font-semibold text-white mb-2">How to apply this code in BGMI 4.6:</div>
        <ol className="list-decimal list-inside space-y-1 text-slate-400">
          <li>Open BGMI and go to <strong>Settings</strong> &gt; <strong>Sensitivity</strong>.</li>
          <li>Tap the <strong>Cloud Layout Management</strong> icon at the bottom of the screen.</li>
          <li>Tap <strong>Search Method</strong> and paste the copied code: <code className="text-emerald-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded">{activePreset.code}</code></li>
          <li>Click <strong>Preview</strong> &gt; <strong>Use Layout</strong> &gt; <strong>Upload to Cloud</strong> to save.</li>
        </ol>
      </div>
    </div>
  );
};
