import React, { useState } from 'react';
import { Gauge, Zap, Shield, Flame, Sliders, Check, Copy, AlertTriangle } from 'lucide-react';
import suzukiImg from '../assets/images/bgmi_suzuki_superbike_1791186179014.jpg';

interface VehicleStat {
  name: string;
  topSpeed: number; // km/h
  acceleration: number; // 0-100 in sec
  durabilityHp: number;
  hitboxAdvantage: string;
  seats: number;
}

const VEHICLES: VehicleStat[] = [
  {
    name: 'Suzuki Hayabusa GSX1300R',
    topSpeed: 168,
    acceleration: 2.6,
    durabilityHp: 1050,
    hitboxAdvantage: '-12% Narrower Silhouette',
    seats: 2,
  },
  {
    name: 'Standard Motorcycle',
    topSpeed: 148,
    acceleration: 3.4,
    durabilityHp: 1000,
    hitboxAdvantage: 'Standard Box',
    seats: 2,
  },
  {
    name: 'Cyber Hovercraft (4.6 Theme)',
    topSpeed: 95,
    acceleration: 4.8,
    durabilityHp: 1650,
    hitboxAdvantage: 'Amphibious All-Terrain',
    seats: 4,
  },
  {
    name: 'Dacia 1300 Sedan',
    topSpeed: 135,
    acceleration: 4.2,
    durabilityHp: 1800,
    hitboxAdvantage: 'Protected Enclosure',
    seats: 4,
  },
  {
    name: 'Armored UAZ',
    topSpeed: 115,
    acceleration: 5.6,
    durabilityHp: 2400,
    hitboxAdvantage: 'High Armor Plating',
    seats: 4,
  },
];

export const SuzukiVehicleLab: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Suzuki Hayabusa GSX1300R');
  const [steerSensitivity, setSteerSensitivity] = useState<number>(115);
  const [gyroSteerFactor, setGyroSteerFactor] = useState<number>(75);
  const [pitchLeanStability, setPitchLeanStability] = useState<number>(90);
  const [copiedControls, setCopiedControls] = useState<boolean>(false);

  const activeV = VEHICLES.find((v) => v.name === selectedVehicle) || VEHICLES[0];

  const handleCopyConfig = () => {
    const text = `=== BGMI 4.6 SUZUKI SUPERBIKE VEHICLE SETTINGS ===
Vehicle: ${activeV.name}
Steering Sensitivity: ${steerSensitivity}%
Gyroscope Vehicle Lean Factor: ${gyroSteerFactor}%
Pitch / Mid-Air Air-Roll Stability: ${pitchLeanStability}%
Top Speed Calibration: ${activeV.topSpeed} km/h
Control Scheme: Layout 1 (Buttons + Gyro Air Pitch)
=================================================`;
    navigator.clipboard.writeText(text);
    setCopiedControls(true);
    setTimeout(() => setCopiedControls(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-[#080c14] p-6 sm:p-8 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Official 4.6 Collaboration Vehicle</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Suzuki Hayabusa & Katana Superbike Lab
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              BGMI 4.6 introduces the high-velocity Suzuki superbike partnership. Experience unmatched 168 km/h straight-line speed, aerodynamic downforce, and 12% narrower collision profile for dodging bridge campers.
            </p>

            {/* Quick Specs Pill-free Row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400">Top Speed</div>
                <div className="text-lg font-bold font-mono text-emerald-400">168 km/h</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400">0-100 Sprint</div>
                <div className="text-lg font-bold font-mono text-cyan-400">2.6 sec</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400">Hitbox Size</div>
                <div className="text-lg font-bold font-mono text-amber-300">-12% Narrow</div>
              </div>
            </div>
          </div>

          {/* Generated Image Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-950 aspect-16/10 group">
              <img
                src={suzukiImg}
                alt="Suzuki high performance superbike in BGMI"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.classList.add(
                      'flex',
                      'items-center',
                      'justify-center',
                      'bg-slate-900'
                    );
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-xs font-mono text-slate-200">
                  <span className="text-amber-400 font-bold">SUZUKI GSX1300R</span> · 1340cc In-Line 4 Audio Engine
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix & Interactive Handling Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vehicle Comparison Table (Col 7) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">4.6 Vehicle Telemetry Matrix</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Live Benchmarked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium font-mono">
                  <th className="py-2.5 px-3">Vehicle Model</th>
                  <th className="py-2.5 px-2 text-right">Top Speed</th>
                  <th className="py-2.5 px-2 text-right">0-100 Sprint</th>
                  <th className="py-2.5 px-2 text-right">Armor HP</th>
                  <th className="py-2.5 px-3">Tactical Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {VEHICLES.map((v) => (
                  <tr
                    key={v.name}
                    onClick={() => setSelectedVehicle(v.name)}
                    className={`cursor-pointer transition-colors ${
                      selectedVehicle === v.name
                        ? 'bg-emerald-950/30 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3 flex items-center gap-2 font-sans font-semibold">
                      {v.name.includes('Suzuki') && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      )}
                      <span>{v.name}</span>
                    </td>
                    <td className="py-3 px-2 text-right text-emerald-400 tabular-nums">
                      {v.topSpeed} km/h
                    </td>
                    <td className="py-3 px-2 text-right text-cyan-400 tabular-nums">
                      {v.acceleration}s
                    </td>
                    <td className="py-3 px-2 text-right text-slate-300 tabular-nums">
                      {v.durabilityHp}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                      {v.hitboxAdvantage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Pro Tip: The Suzuki Hayabusa can cross the military base bridge at 168 km/h. To avoid spike traps, execute an air-pitch jump 30 meters before barricades by tapping the nose-up button.
            </p>
          </div>
        </div>

        {/* Vehicle Handling & Sensitivity Tuner (Col 5) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Superbike Handling Tuner</h3>
              </div>
              <button
                onClick={handleCopyConfig}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
              >
                {copiedControls ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedControls ? 'Copied' : 'Copy Setup'}</span>
              </button>
            </div>

            {/* Slider 1: Steering Sensitivity */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">High-Speed Steering Sensitivity</span>
                <span className="font-mono text-emerald-400 font-bold">{steerSensitivity}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="150"
                value={steerSensitivity}
                onChange={(e) => setSteerSensitivity(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Prevents oversteer spins when swerving past enemy gunfire.</p>
            </div>

            {/* Slider 2: Gyro Vehicle Lean */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Gyroscope Bike Tilt Angle</span>
                <span className="font-mono text-cyan-400 font-bold">{gyroSteerFactor}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                value={gyroSteerFactor}
                onChange={(e) => setGyroSteerFactor(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Enables deep moto-GP style body lean into hairpin turns.</p>
            </div>

            {/* Slider 3: Air Roll Pitch */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Airborne Jump Pitch Balance</span>
                <span className="font-mono text-amber-400 font-bold">{pitchLeanStability}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={pitchLeanStability}
                onChange={(e) => setPitchLeanStability(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Auto-levels motorcycle pitch in mid-air to land cleanly on two wheels.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Recommended Control Layout in BGMI: <strong>Vehicle Controls &gt; Layout 1 (Single Button Gas / Reverse + Dedicated Lean Buttons)</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
