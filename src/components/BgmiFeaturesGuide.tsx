import React, { useState, useMemo } from 'react';
import { Search, Flame, Target, Volume2, Shield, Sparkles, Check, ChevronRight } from 'lucide-react';
import { BGMI_4_6_FEATURES, BgmiFeature } from '../data/bgmiFeatures';

export const BgmiFeaturesGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string>(BGMI_4_6_FEATURES[0].id);
  const [copiedFeatureId, setCopiedFeatureId] = useState<string | null>(null);

  const categories = [
    'All',
    '120 FPS & Graphics',
    'Themed Mode',
    'Weapons & Balance',
    'Tactical & Audio',
    'Vehicles',
    'Royale Pass & Events',
  ];

  const filteredFeatures = useMemo(() => {
    return BGMI_4_6_FEATURES.filter((f) => {
      const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.proTips.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyDetails = (feature: BgmiFeature) => {
    const text = `BGMI 4.6 Feature: ${feature.title}\nCategory: ${feature.category}\n\nSummary:\n${feature.summary}\n\nKey Highlights:\n${feature.details.map((d) => `• ${d}`).join('\n')}\n\nPro Tip: ${feature.proTips}`;
    navigator.clipboard.writeText(text);
    setCopiedFeatureId(feature.id);
    setTimeout(() => setCopiedFeatureId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Official Version 4.6 Major Release Overview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              BGMI 4.6 All Features & Meta Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Complete breakdown of 120 FPS native support, Cyber Mecha themed mode, weapon recoil rebalancing, spatial 3D audio, and tactical mechanics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Total Features</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {BGMI_4_6_FEATURES.length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-xs text-slate-400">Max Frame Target</div>
              <div className="text-xl font-bold font-mono text-cyan-400">120 FPS</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-slate-800/80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 4.6 features (e.g. 120 FPS, mecha, M416, sound, recall)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((feature) => {
          const isExpanded = expandedFeatureId === feature.id;
          const isCopied = copiedFeatureId === feature.id;

          return (
            <div
              key={feature.id}
              className={`p-5 rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-slate-900/95 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header with Title and Unboxed Metadata */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span className="text-emerald-400">{feature.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{feature.badge}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-300">Impact {feature.impactScore}/10</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {feature.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopyDetails(feature)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                    title="Copy feature breakdown"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {feature.summary}
              </p>

              {/* Expanded Highlights */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Key Changes & Mechanics
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-normal">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Player Tip Box */}
              <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-cyan-400">
                  <Target className="w-3.5 h-3.5" />
                  <span>Pro Tip / Meta Strategy</span>
                </div>
                <p className="mt-1 text-slate-400 leading-relaxed">
                  {feature.proTips}
                </p>
              </div>

              {/* Action */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <button
                  onClick={() => setExpandedFeatureId(isExpanded ? '' : feature.id)}
                  className="hover:text-emerald-400 transition cursor-pointer font-medium"
                >
                  {isExpanded ? 'Collapse card' : 'Focus card'}
                </button>
                <button
                  onClick={() => handleCopyDetails(feature)}
                  className="hover:text-white transition cursor-pointer font-mono"
                >
                  {isCopied ? 'Copied to clipboard' : 'Copy details'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
          <p className="text-sm">No BGMI 4.6 features matched your search "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-3 px-4 py-1.5 text-xs font-medium text-emerald-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
