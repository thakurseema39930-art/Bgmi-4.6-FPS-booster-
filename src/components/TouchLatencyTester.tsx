import React, { useState, useRef } from 'react';
import { Target, Zap, RotateCcw, Award } from 'lucide-react';

export const TouchLatencyTester: React.FC = () => {
  const [testState, setTestState] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [tooEarly, setTooEarly] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTest = () => {
    setTooEarly(false);
    setReactionTime(null);
    setTestState('waiting');

    // Random delay between 1.5s and 4.5s
    const delay = 1500 + Math.random() * 3000;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setTestState('ready');
    }, delay);
  };

  const handleClickSurface = () => {
    if (testState === 'idle') {
      startTest();
    } else if (testState === 'waiting') {
      // Clicked too early
      if (timerRef.current) clearTimeout(timerRef.current);
      setTooEarly(true);
      setTestState('idle');
    } else if (testState === 'ready') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setHistory((prev) => [elapsed, ...prev].slice(0, 10));
      setTestState('finished');
    } else if (testState === 'finished') {
      startTest();
    }
  };

  const avgReaction =
    history.length > 0
      ? Math.round(history.reduce((a, b) => a + b, 0) / history.length)
      : null;
  const bestReaction = history.length > 0 ? Math.min(...history) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Reflex & Touch Sampling Diagnostics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Touch Response & Reflex Benchmark
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Test your screen's touch latency and your real combat reaction time. At 120 FPS, visual stimulus reaches your eyes 8.3ms faster than at 60 FPS.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Last Click</div>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {reactionTime !== null ? `${reactionTime} ms` : '—'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Best Score</div>
            <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
              {bestReaction !== null ? `${bestReaction} ms` : '—'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Average (10 runs)</div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {avgReaction !== null ? `${avgReaction} ms` : '—'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">120 FPS Advantage</div>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              -8.33 ms
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Trigger Pad */}
      <div
        onClick={handleClickSurface}
        className={`w-full h-72 rounded-3xl flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-all duration-150 border-2 ${
          testState === 'idle'
            ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
            : testState === 'waiting'
            ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            : testState === 'ready'
            ? 'bg-emerald-600 border-emerald-400 text-white shadow-2xl scale-[1.01]'
            : 'bg-slate-900 border-emerald-500/80 text-emerald-300'
        }`}
      >
        {testState === 'idle' && (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400">
              <Target className="w-8 h-8" />
            </div>
            <div className="text-xl font-bold">
              {tooEarly ? 'Too Early! Tap When It Turns Green' : 'Tap Anywhere to Start Test'}
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Wait for the screen to turn bright emerald green, then tap immediately to register touch response.
            </p>
          </div>
        )}

        {testState === 'waiting' && (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mx-auto" />
            <div className="text-xl font-bold text-rose-200">Wait for Green...</div>
            <p className="text-xs text-rose-300/80">Don't tap yet! Stand ready.</p>
          </div>
        )}

        {testState === 'ready' && (
          <div className="space-y-2 animate-bounce">
            <div className="text-3xl font-extrabold tracking-tight">TAP NOW!</div>
            <div className="text-xs opacity-90">Fire reflex shot!</div>
          </div>
        )}

        {testState === 'finished' && (
          <div className="space-y-2">
            <div className="text-4xl font-extrabold font-mono tabular-nums text-white">
              {reactionTime} ms
            </div>
            <div className="text-sm font-semibold text-emerald-400">
              {reactionTime && reactionTime < 180
                ? 'Esports Elite Reflex (TDM God)'
                : reactionTime && reactionTime < 240
                ? 'Competitive Player Reflex'
                : 'Standard Reaction Speed'}
            </div>
            <p className="text-xs text-slate-400 mt-2">Tap to test again</p>
          </div>
        )}
      </div>

      {/* Frame Latency Comparison Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">60 FPS (Extreme)</span>
            <span className="font-mono text-slate-400">16.66 ms / frame</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Standard baseline. Good for survival and medium-range gunfights, but has higher input buffering during high-speed close-range slide & hipfire.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-400">90 FPS (Ultra Extreme)</span>
            <span className="font-mono text-cyan-400 font-semibold">11.11 ms / frame</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            33% lower input lag than 60 FPS. Noticeably crisper enemy tracking when driving vehicles and spraying moving targets with red dot.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400">120 FPS (Native 4.6)</span>
            <span className="font-mono text-emerald-400 font-semibold">8.33 ms / frame</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            50% reduced motion blur and instantaneous crosshair feedback. Gives tournament players the decisive millisecond advantage in 1v1 close-range jiggle peeking.
          </p>
        </div>
      </div>
    </div>
  );
};
