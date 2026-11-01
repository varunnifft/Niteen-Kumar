import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Calculator,
  Flame,
  Layers,
  ChevronRight,
  Sliders,
  CheckCircle2,
  FileText,
  Tag,
  ArrowRight,
  Shield,
  Activity
} from 'lucide-react';
import { Article } from '../../types';
import { api } from '../../services/api';

export const KnowledgeCenterPage: React.FC<{ onRequestConsulting: () => void }> = ({ onRequestConsulting }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Active Tab: 'articles' or 'calculators'
  const [activeTab, setActiveTab] = useState<'articles' | 'calculators'>('articles');

  // Interactive Reference Calculator: Slag Basicity & Viscosity
  const [slagCao, setSlagCao] = useState(38.5);
  const [slagSio2, setSlagSio2] = useState(33.0);
  const [slagMgo, setSlagMgo] = useState(8.5);
  const [slagAl2o3, setSlagAl2o3] = useState(14.5);

  const b2 = (slagCao / (slagSio2 || 1)).toFixed(2);
  const b4 = ((slagCao + slagMgo) / (slagSio2 + slagAl2o3 || 1)).toFixed(2);
  const mgoAl2o3Ratio = (slagMgo / (slagAl2o3 || 1)).toFixed(2);
  const estViscosity = (1.5 + (slagAl2o3 * 0.12) - (slagMgo * 0.08) - (Number(b2) * 0.4)).toFixed(1);

  // Interactive Reference Calculator: Sinter Return Fines Equilibrium
  const [rawMixFeed, setRawMixFeed] = useState(450); // t/h
  const [sinterYield, setSinterYield] = useState(72); // %
  const [screenFinesPct, setScreenFinesPct] = useState(28); // %
  const [circulatingFinesTarget, setCirculatingFinesTarget] = useState(28); // %

  const grossSinter = (rawMixFeed * 0.76).toFixed(1);
  const finesGenerated = ((Number(grossSinter) * screenFinesPct) / 100).toFixed(1);
  const netBlastFurnaceSinter = (Number(grossSinter) - Number(finesGenerated)).toFixed(1);

  const categories = [
    'All',
    'Blast Furnace Guides',
    'Sinter Plant',
    'Raw Material Quality',
    'Process Optimization',
    'Troubleshooting',
    'Safety & SOP'
  ];

  useEffect(() => {
    api.getArticles()
      .then((res) => {
        setArticles(res.articles);
      })
      .catch((err) => {
        console.error('Failed to load articles', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4" />
              Metallurgical Engineering Reference
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Technical Knowledge Center
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl text-sm leading-relaxed">
              In-depth technical guides, operating standard procedures, metallurgical formulas, and real-time interactive engineering calculators.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'articles'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Technical Guides</span>
            </button>
            <button
              onClick={() => setActiveTab('calculators')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'calculators'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Calculators</span>
            </button>
          </div>
        </div>

        {/* ARTICLES TAB */}
        {activeTab === 'articles' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Filter Bar & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === c
                        ? 'bg-orange-600 text-white font-semibold'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="w-full md:w-72 relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter articles & formulas..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Articles List */}
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-xs">
                Loading metallurgical reference articles...
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="py-16 text-center bg-slate-900 rounded-xl border border-slate-800 p-8">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">No articles matched your criteria</p>
                <p className="text-xs text-slate-400 mt-1">Try another search term or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="text-orange-400 font-semibold">{art.category}</span>
                        <span>{art.readTime}</span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>

                      {art.keyFormulas && art.keyFormulas.length > 0 && (
                        <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300">
                          <span className="text-orange-400 font-bold block mb-0.5">Key Equation:</span>
                          <span className="truncate block">{art.keyFormulas[0]}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {art.tags.map((t, i) => (
                          <span key={i} className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 mt-5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Published {art.publishedDate}
                      </span>
                      <button
                        onClick={() => setActiveArticle(art)}
                        className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 group/btn"
                      >
                        <span>Read Technical Guide</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CALCULATORS TAB */}
        {activeTab === 'calculators' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Calculator 1: Slag Basicity & Viscosity */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-white">
                    Blast Furnace Slag Basicity (B2 / B4) & Viscosity Predictor
                  </h3>
                </div>
                <span className="text-xs font-mono text-orange-400">Thermodynamic Viscosity Model</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Adjust primary slag chemical components to compute Binary Basicity (B2 = CaO/SiO2), Quaternary Basicity (B4), and verify whether high Al2O3 levels are safely mitigated by MgO additions to preserve smooth tapping fluidity.
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">CaO (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={slagCao}
                        onChange={(e) => setSlagCao(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">SiO2 (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={slagSio2}
                        onChange={(e) => setSlagSio2(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">MgO (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={slagMgo}
                        onChange={(e) => setSlagMgo(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Al2O3 (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={slagAl2o3}
                        onChange={(e) => setSlagAl2o3(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Results Card */}
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Binary Basicity (B2)</span>
                      <span className="text-xl font-bold font-mono text-orange-400 mt-0.5 block">
                        {b2}
                      </span>
                      <span className="text-[10px] text-slate-500">Target: 1.08 – 1.22</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Quaternary Basicity (B4)</span>
                      <span className="text-xl font-bold font-mono text-white mt-0.5 block">
                        {b4}
                      </span>
                      <span className="text-[10px] text-slate-500">(CaO+MgO)/(SiO2+Al2O3)</span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">MgO / Al2O3 Ratio</span>
                      <span className={`text-xl font-bold font-mono mt-0.5 block ${
                        Number(mgoAl2o3Ratio) >= 0.55 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {mgoAl2o3Ratio}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {Number(mgoAl2o3Ratio) >= 0.55 ? '✓ Safe Window (≥0.55)' : 'Risk: High Viscosity'}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Est. Viscosity @1450°C</span>
                      <span className="text-xl font-bold font-mono text-cyan-400 mt-0.5 block">
                        {estViscosity} <span className="text-xs text-slate-400 font-normal">poise</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Target &lt; 3.5 poise</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    High alumina (&gt;14%) expands the high-temperature primary crystal field of melilite/spinel. Maintaining MgO &gt; 8.0% shifts the composition into the low-melting liquidus valley.
                  </p>
                </div>
              </div>
            </div>

            {/* Calculator 2: Sinter Return Fines Balancer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-white">
                    Sinter Strand Return Fines Closed-Circuit Balancer
                  </h3>
                </div>
                <span className="text-xs font-mono text-orange-400">Strand Mass Balance</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Balance raw mix feed, screen mesh size (-5mm), and circulating return fines inventory to avoid strand choking or fine starvation in the blast furnace stockhouse.
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Raw Mix Feed Rate (t/h)</label>
                      <input
                        type="number"
                        value={rawMixFeed}
                        onChange={(e) => setRawMixFeed(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Screen Undersize (-5mm) Fines %</label>
                      <input
                        type="number"
                        value={screenFinesPct}
                        onChange={(e) => setScreenFinesPct(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Gross Sinter Discharged:</span>
                    <strong className="text-white font-mono text-sm">{grossSinter} t/h</strong>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Return Fines Generated (-5mm):</span>
                    <strong className="text-orange-400 font-mono text-sm">{finesGenerated} t/h</strong>
                  </div>
                  <div className="flex justify-between items-center py-2 text-xs">
                    <span className="text-slate-400">Net Blast Furnace Usable Sinter:</span>
                    <strong className="text-emerald-400 font-mono text-sm">{netBlastFurnaceSinter} t/h</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Read Article Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold mb-1">
                    <span>{activeArticle.category}</span>
                    <span>·</span>
                    <span>{activeArticle.readTime}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {activeArticle.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    By {activeArticle.author} · Published {activeArticle.publishedDate}
                  </p>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p className="text-base text-white font-medium bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  {activeArticle.summary}
                </p>

                {activeArticle.sections.map((sec, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="text-base font-bold text-white text-orange-400">
                      {sec.heading}
                    </h3>
                    <p>{sec.content}</p>
                    {sec.bullets && (
                      <ul className="space-y-1 pt-1 pl-4 list-disc text-xs text-slate-300">
                        {sec.bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {activeArticle.keyFormulas && activeArticle.keyFormulas.length > 0 && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                      Governing Metallurgical Equations
                    </h4>
                    <div className="space-y-1.5 font-mono text-xs text-slate-200">
                      {activeArticle.keyFormulas.map((f, fi) => (
                        <div key={fi} className="p-2 bg-slate-900 rounded border border-slate-800/80">
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onRequestConsulting();
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold"
                >
                  Consult With Author on Plant Implementation
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
