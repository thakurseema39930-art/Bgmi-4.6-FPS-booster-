import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Zap, Sliders, Award, Flame, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FrameStats {
  fps: number;
  avgFps: number;
  onePercentLow: number;
  zeroPointOneLow: number;
  frameTimeMs: number;
  frameTimeJitter: number;
  totalFrames: number;
}

interface BenchmarkResult {
  score: number;
  tier: string;
  ratingColor: string;
  avgFps: number;
  onePercentLow: number;
  minFps: number;
  maxFps: number;
  testedParticles: number;
  resolutionScale: number;
  stabilityScore: number;
}

export const BenchmarkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparklineRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation Parameters
  const [particleCount, setParticleCount] = useState<number>(6000);
  const [enableGlow, setEnableGlow] = useState<boolean>(true);
  const [enable3DGeometry, setEnable3DGeometry] = useState<boolean>(true);
  const [resolutionScale, setResolutionScale] = useState<number>(1);
  const [targetFpsCap, setTargetFpsCap] = useState<number>(0); // 0 = unthrottled

  // Benchmark State
  const [isRunningTimed, setIsRunningTimed] = useState<boolean>(false);
  const [timedSecondsLeft, setTimedSecondsLeft] = useState<number>(0);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);

  // Live Metrics
  const [stats, setStats] = useState<FrameStats>({
    fps: 0,
    avgFps: 0,
    onePercentLow: 0,
    zeroPointOneLow: 0,
    frameTimeMs: 0,
    frameTimeJitter: 0,
    totalFrames: 0,
  });

  // Internal animation state refs
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameTimesHistoryRef = useRef<number[]>([]);
  const timedRunRecordsRef = useRef<{ fps: number; frameTime: number }[]>([]);
  const timedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 3D Polyhedron vertices & particles
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; color: string; size: number }[]
  >([]);
  const angleRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  // Initialize particles
  const initParticles = useCallback((count: number, width: number, height: number) => {
    const colors = ['#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7'];
    const p: { x: number; y: number; vx: number; vy: number; color: string; size: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.5;
      p.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2 + 1,
      });
    }
    particlesRef.current = p;
  }, []);

  // Update canvas size and reinitialize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(300, Math.floor(rect.width * resolutionScale));
    const height = Math.max(200, Math.floor(rect.height * resolutionScale));

    canvas.width = width;
    canvas.height = height;
    initParticles(particleCount, width, height);
  }, [resolutionScale, particleCount, initParticles]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let framesCountInSec = 0;
    let secStartTime = performance.now();

    const render = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Throttle if targetFpsCap is active
      if (targetFpsCap > 0 && delta < 1000 / targetFpsCap - 1) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const frameTime = delta > 0 ? delta : 16.6;
      frameTimesHistoryRef.current.push(frameTime);
      if (frameTimesHistoryRef.current.length > 120) {
        frameTimesHistoryRef.current.shift();
      }

      if (isRunningTimed) {
        timedRunRecordsRef.current.push({
          fps: 1000 / frameTime,
          frameTime,
        });
      }

      // Compute statistics every 250ms
      framesCountInSec++;
      if (now - secStartTime >= 250) {
        const measuredFps = Math.round((framesCountInSec * 1000) / (now - secStartTime));
        framesCountInSec = 0;
        secStartTime = now;

        // Calculate 1% low and 0.1% low from rolling history
        const sorted = [...frameTimesHistoryRef.current].sort((a, b) => b - a);
        const p99Index = Math.max(0, Math.floor(sorted.length * 0.01));
        const p999Index = 0;
        const onePercentLow = Math.round(1000 / (sorted[p99Index] || frameTime));
        const zeroPointOneLow = Math.round(1000 / (sorted[p999Index] || frameTime));

        // Jitter: standard deviation of frame times
        const avgFt =
          frameTimesHistoryRef.current.reduce((a, b) => a + b, 0) /
          frameTimesHistoryRef.current.length;
        const variance =
          frameTimesHistoryRef.current.reduce((a, b) => a + Math.pow(b - avgFt, 2), 0) /
          frameTimesHistoryRef.current.length;
        const jitter = Math.sqrt(variance);

        setStats({
          fps: measuredFps,
          avgFps: Math.round(1000 / avgFt),
          onePercentLow,
          zeroPointOneLow,
          frameTimeMs: Number(avgFt.toFixed(2)),
          frameTimeJitter: Number(jitter.toFixed(2)),
          totalFrames: frameTimesHistoryRef.current.length,
        });

        // Draw rolling sparkline
        drawSparkline(frameTimesHistoryRef.current);
      }

      // Clear Canvas with subtle trail
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Render 3D Rotating Polyhedron in the center
      if (enable3DGeometry) {
        angleRef.current.x += 0.015;
        angleRef.current.y += 0.02;

        const radX = angleRef.current.x;
        const radY = angleRef.current.y;

        // Cube 3D vertices
        const size = Math.min(canvas.width, canvas.height) * 0.22;
        const baseNodes = [
          [-1, -1, -1],
          [1, -1, -1],
          [1, 1, -1],
          [-1, 1, -1],
          [-1, -1, 1],
          [1, -1, 1],
          [1, 1, 1],
          [-1, 1, 1],
        ];

        const projectedNodes = baseNodes.map(([x, y, z]) => {
          // Rotate around X
          let y1 = y * Math.cos(radX) - z * Math.sin(radX);
          let z1 = y * Math.sin(radX) + z * Math.cos(radX);
          // Rotate around Y
          let x2 = x * Math.cos(radY) + z1 * Math.sin(radY);
          let z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);

          // Perspective projection
          const fov = 400;
          const pZ = z2 * size + fov;
          const scale = fov / (pZ > 10 ? pZ : 10);
          return {
            x: centerX + x2 * size * scale,
            y: centerY + y1 * size * scale,
            z: z2,
          };
        });

        // Draw edges
        const edges = [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 4],
          [0, 4],
          [1, 5],
          [2, 6],
          [3, 7],
        ];

        ctx.strokeStyle = enableGlow ? '#10b981' : '#334155';
        ctx.lineWidth = 2;
        if (enableGlow) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#10b981';
        }

        ctx.beginPath();
        for (const [s, e] of edges) {
          ctx.moveTo(projectedNodes[s].x, projectedNodes[s].y);
          ctx.lineTo(projectedNodes[e].x, projectedNodes[e].y);
        }
        ctx.stroke();

        // Secondary internal core
        ctx.strokeStyle = '#06b6d4';
        if (enableGlow) ctx.shadowColor = '#06b6d4';
        ctx.beginPath();
        for (const [s, e] of edges) {
          const mx = (projectedNodes[s].x + centerX) / 2;
          const my = (projectedNodes[s].y + centerY) / 2;
          const ex = (projectedNodes[e].x + centerX) / 2;
          const ey = (projectedNodes[e].y + centerY) / 2;
          ctx.moveTo(mx, my);
          ctx.lineTo(ex, ey);
        }
        ctx.stroke();

        ctx.shadowBlur = 0;
      }

      // Render Particles & Physics
      const particles = particlesRef.current;
      const pLen = particles.length;

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // Orbit attraction to center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist > 30) {
          p.vx += (dx / dist) * 0.04;
          p.vy += (dy / dist) * 0.04;
        }

        // Damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [enable3DGeometry, enableGlow, targetFpsCap, isRunningTimed]);

  // Draw Rolling Frame Time Sparkline
  const drawSparkline = (frameTimes: number[]) => {
    const canvas = sparklineRef.current;
    if (!canvas || frameTimes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Target 60Hz (16.6ms) & 144Hz (6.94ms) guideline
    const msToY = (ms: number) => {
      // 0ms at bottom (height - 4), 33ms at top (4)
      const maxMs = 33.3;
      const normalized = Math.min(1, Math.max(0, ms / maxMs));
      return height - 4 - normalized * (height - 8);
    };

    // Reference lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // 16.6ms (60 FPS)
    ctx.beginPath();
    ctx.moveTo(0, msToY(16.6));
    ctx.lineTo(width, msToY(16.6));
    ctx.stroke();

    // 6.94ms (144 FPS)
    ctx.beginPath();
    ctx.moveTo(0, msToY(6.94));
    ctx.lineTo(width, msToY(6.94));
    ctx.stroke();

    // Line Plot of frame times
    ctx.beginPath();
    const step = width / (frameTimes.length - 1 || 1);
    frameTimes.forEach((ft, i) => {
      const x = i * step;
      const y = msToY(ft);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  // Timed Benchmark Execution (15s Run)
  const startTimedBenchmark = () => {
    if (isRunningTimed) return;
    setBenchmarkResult(null);
    timedRunRecordsRef.current = [];
    setIsRunningTimed(true);
    setTimedSecondsLeft(15);

    let seconds = 15;
    if (timedTimerRef.current) clearInterval(timedTimerRef.current);

    timedTimerRef.current = setInterval(() => {
      seconds -= 1;
      setTimedSecondsLeft(seconds);
      if (seconds <= 0) {
        if (timedTimerRef.current) clearInterval(timedTimerRef.current);
        finishTimedBenchmark();
      }
    }, 1000);
  };

  const finishTimedBenchmark = () => {
    setIsRunningTimed(false);
    const records = timedRunRecordsRef.current;
    if (records.length === 0) return;

    const fpsList = records.map((r) => r.fps);
    const ftList = records.map((r) => r.frameTime);

    const avgFps = Math.round(fpsList.reduce((a, b) => a + b, 0) / fpsList.length);
    const minFps = Math.round(Math.min(...fpsList));
    const maxFps = Math.round(Math.max(...fpsList));

    // 1% low
    const sortedFt = [...ftList].sort((a, b) => b - a);
    const p99 = Math.round(1000 / (sortedFt[Math.floor(sortedFt.length * 0.01)] || 16.6));

    // Stability score (100 - % variance)
    const avgFt = ftList.reduce((a, b) => a + b, 0) / ftList.length;
    const stdDev = Math.sqrt(
      ftList.reduce((a, b) => a + Math.pow(b - avgFt, 2), 0) / ftList.length
    );
    const stabilityScore = Math.max(0, Math.min(100, Math.round(100 - (stdDev / avgFt) * 100)));

    // Total Score
    const score = Math.round(avgFps * 0.6 + p99 * 0.3 + stabilityScore * 2);

    let tier = 'Standard 60Hz Competent';
    let ratingColor = 'text-blue-400';
    if (avgFps >= 220 && p99 >= 160) {
      tier = 'Esports God-Tier (240Hz+ Ready)';
      ratingColor = 'text-emerald-400';
    } else if (avgFps >= 135 && p99 >= 100) {
      tier = 'Competitive Tournament (144Hz Ready)';
      ratingColor = 'text-cyan-400';
    } else if (avgFps >= 75) {
      tier = 'Smooth High Refresh';
      ratingColor = 'text-emerald-300';
    } else if (avgFps < 45) {
      tier = 'System Throttling / Optimization Needed';
      ratingColor = 'text-amber-400';
    }

    setBenchmarkResult({
      score,
      tier,
      ratingColor,
      avgFps,
      onePercentLow: p99,
      minFps,
      maxFps,
      testedParticles: particleCount,
      resolutionScale,
      stabilityScore,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#3b82f6'],
    });
  };

  const setStressPreset = (count: number, glow: boolean, geo: boolean, scale: number) => {
    setParticleCount(count);
    setEnableGlow(glow);
    setEnable3DGeometry(geo);
    setResolutionScale(scale);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Hardware Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Live FPS</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {stats.fps}
            </span>
            <span className="text-xs text-slate-500 font-mono">fps</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Average FPS</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-cyan-400">
              {stats.avgFps}
            </span>
            <span className="text-xs text-slate-500 font-mono">1s roll</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">1% Low (P99)</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                stats.onePercentLow < 60 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {stats.onePercentLow}
            </span>
            <span className="text-xs text-slate-500 font-mono">stutter check</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Frame Time</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-100">
              {stats.frameTimeMs}
            </span>
            <span className="text-xs text-slate-500 font-mono">ms</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Frame Jitter</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                stats.frameTimeJitter > 4 ? 'text-amber-400' : 'text-slate-200'
              }`}
            >
              ±{stats.frameTimeJitter}
            </span>
            <span className="text-xs text-slate-500 font-mono">ms std</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pacing</span>
            <span className="text-[11px] font-mono text-slate-500">144Hz / 60Hz</span>
          </div>
          <div className="mt-1">
            <canvas
              ref={sparklineRef}
              width={160}
              height={32}
              className="w-full h-8 block rounded bg-slate-950/60"
            />
          </div>
        </div>
      </div>

      {/* Main Benchmark Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas Render Surface */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#080c14] shadow-2xl aspect-16/10">
            <canvas
              ref={canvasRef}
              className="w-full h-full block cursor-crosshair"
            />

            {/* In-Canvas HUD Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-xs font-mono text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>STRESS: {particleCount.toLocaleString()} PARTICLES</span>
              <span className="text-slate-600">|</span>
              <span>SCALE: {resolutionScale * 100}%</span>
            </div>

            {/* Timed Run Banner */}
            {isRunningTimed && (
              <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold shadow-lg animate-pulse">
                <Activity className="w-4 h-4" />
                <span>BENCHMARKING: {timedSecondsLeft}s REMAINING</span>
              </div>
            )}

            {/* Quick action bar at bottom of canvas */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">WebGL/2D Hardware Stress Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={startTimedBenchmark}
                  disabled={isRunningTimed}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunningTimed ? 'Running 15s Run...' : 'Run 15s Benchmark'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Quick Stress Presets:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStressPreset(2000, false, true, 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                Esports Lightweight (2k)
              </button>
              <button
                onClick={() => setStressPreset(6000, true, true, 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                Tournament Standard (6k)
              </button>
              <button
                onClick={() => setStressPreset(14000, true, true, 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                Heavy GPU Stress (14k)
              </button>
              <button
                onClick={() => setStressPreset(25000, true, true, 1.25)}
                className="px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/40 text-amber-300 transition-colors cursor-pointer"
              >
                Extreme Torture (25k)
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Fine Tuning Controls */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Load Parameters</span>
            </div>

            {/* Particle Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Particle Workload</span>
                <span className="font-mono text-emerald-400">{particleCount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="30000"
                step="1000"
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Resolution Scale */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Resolution Scale</span>
                <span className="font-mono text-cyan-400">{resolutionScale * 100}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0.75, 1.0, 1.5].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setResolutionScale(scale)}
                    className={`py-1.5 text-xs rounded-lg font-medium transition cursor-pointer ${
                      resolutionScale === scale
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {scale * 100}%
                  </button>
                ))}
              </div>
            </div>

            {/* FPS Cap / Refresh Lock */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">FPS Limiter Test</span>
                <span className="font-mono text-slate-300">
                  {targetFpsCap === 0 ? 'Unlimited' : `${targetFpsCap} FPS`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 60, 144, 240].map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setTargetFpsCap(cap)}
                    className={`py-1 text-xs rounded-md font-mono transition cursor-pointer ${
                      targetFpsCap === cap
                        ? 'bg-slate-700 text-emerald-400 font-bold'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cap === 0 ? 'Max' : `${cap}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-slate-800 space-y-2.5 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">3D Geometric Core</span>
                <input
                  type="checkbox"
                  checked={enable3DGeometry}
                  onChange={(e) => setEnable3DGeometry(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Post-Process Glow Pass</span>
                <input
                  type="checkbox"
                  checked={enableGlow}
                  onChange={(e) => setEnableGlow(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Quick Hardware Optimization Tip */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>FPS Optimization Note</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              If your 1% Low is below 60 FPS while average is high, frame pacing jitter is causing perceptible micro-stutter. Enable HAGS and configure an FPS cap 3 FPS below your monitor's refresh rate (e.g. 141 FPS on 144Hz) to eliminate input buffer lag.
            </p>
          </div>
        </div>
      </div>

      {/* Benchmark Results Card (If available) */}
      {benchmarkResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-emerald-800/60 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Benchmark Certified Score</h3>
                <p className="text-xs text-slate-400">
                  Tested under {benchmarkResult.testedParticles.toLocaleString()} active entities · {benchmarkResult.resolutionScale * 100}% rendering scale
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
                {benchmarkResult.score} PTS
              </div>
              <div className={`text-xs font-semibold ${benchmarkResult.ratingColor}`}>
                {benchmarkResult.tier}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400">Average FPS</div>
              <div className="mt-1 text-xl font-bold text-white">{benchmarkResult.avgFps}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400">1% Low (P99)</div>
              <div className="mt-1 text-xl font-bold text-cyan-400">{benchmarkResult.onePercentLow}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400">FPS Stability</div>
              <div className="mt-1 text-xl font-bold text-emerald-400">{benchmarkResult.stabilityScore}%</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-slate-400">Min / Max FPS</div>
              <div className="mt-1 text-xl font-bold text-slate-300">
                {benchmarkResult.minFps} / {benchmarkResult.maxFps}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
