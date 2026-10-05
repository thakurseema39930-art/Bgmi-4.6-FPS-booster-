import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { Zap } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickBoost: () => void;
  boosted: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onQuickBoost,
  boosted,
}) => {
  const navItems = [
    { id: 'features', label: 'Features 4.6' },
    { id: 'booster', label: 'FPS Booster' },
    { id: 'benchmark', label: 'Stress Benchmark' },
    { id: 'sensitivity', label: 'Sensitivity' },
    { id: 'reflex', label: 'Touch Latency' },
    { id: 'ping', label: 'Ping Stabilizer' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('features');
          }}
          className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
        >
          BGMI 4.6 FrameCraft
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
                activeTab === item.id
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onQuickBoost}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
              boosted
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${boosted ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>{boosted ? 'Boosted 120 FPS' : 'Quick Boost'}</span>
          </button>

          <PWAInstallButton />
        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroll */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition cursor-pointer ${
              activeTab === item.id
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
