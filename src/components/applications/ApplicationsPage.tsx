import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Download,
  ExternalLink,
  Clock,
  Smartphone,
  Globe,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Flame,
  Cpu,
  TrendingUp,
  Activity,
  ShieldAlert,
  DraftingCompass,
  PieChart,
  Leaf
} from 'lucide-react';
import { ApplicationItem } from '../../types';
import { api } from '../../services/api';
import { ApplicationDetailModal } from './ApplicationDetailModal';

// Icon map helper
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Layers,
  DraftingCompass,
  PieChart,
  Flame,
  TrendingUp,
  Leaf,
  Cpu,
  Activity,
  ShieldAlert
};

export const ApplicationsPage: React.FC<{ onRequestConsulting: () => void }> = ({ onRequestConsulting }) => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  const categories = [
    'All',
    'Blast Furnace Burden Distribution',
    'Blast Furnace Geometry and Design',
    'Blast Furnace Raw Material Planning',
    'Blast Furnace Heat Balance',
    'Blast Furnace Cost and Production Planning',
    'CBAM Carbon Emissions Calculator',
    'Sinter Plant Analysis and Optimization',
    'Raw Material Quality Analysis',
    'Industrial Safety and Emergency SOP Management'
  ];

  useEffect(() => {
    api.getApplications()
      .then((res) => {
        setApplications(res.applications);
      })
      .catch((err) => {
        console.error('Failed to load applications from API', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.targetUsers.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
              <Cpu className="w-4 h-4" />
              Specialized Industrial Software Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ironmaking Computational Applications
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl text-sm leading-relaxed">
              Industrial engineering tools designed for blast furnace operation heads, metallurgical process engineers, sinter plant teams, and safety supervisors.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications, algorithms..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Category Horizontal Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white font-semibold shadow-md shadow-orange-950/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Applications Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <div className="inline-block w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>Loading industrial application suite...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/60 rounded-xl border border-slate-800 p-8 space-y-3">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No applications matched your filter</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or select "All" categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => {
              const IconComponent = iconMap[app.iconName] || Layers;
              const hasApk = app.appType === 'apk' || app.appType === 'both';
              const hasWeb = app.appType === 'web' || app.appType === 'both';
              const isComingSoon = app.appType === 'coming_soon' || (!app.androidDownloadUrl && !app.webAppUrl);

              return (
                <div
                  key={app.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-orange-950/10 group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon + Version + Category */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-3 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-400 group-hover:scale-105 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-mono text-slate-400 block">
                          v{app.version}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {app.latestUpdateDate}
                        </span>
                      </div>
                    </div>

                    {/* App Title & Category */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {app.category}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {app.shortDescription}
                    </p>

                    {/* Highlights / Features (Max 3) */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        Core Modules:
                      </span>
                      {app.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Target Users */}
                    <div className="text-[11px] text-slate-400 pt-1">
                      <strong className="text-slate-300">Audience: </strong>
                      <span className="line-clamp-1">{app.targetUsers}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700 text-center"
                      >
                        View Details
                      </button>

                      {isComingSoon ? (
                        <div className="w-full py-2 px-2 bg-slate-800/50 text-slate-400 text-xs rounded-lg text-center font-medium flex items-center justify-center gap-1 border border-slate-800">
                          <Clock className="w-3.5 h-3.5 text-orange-400" />
                          <span>Coming Soon</span>
                        </div>
                      ) : hasApk && app.androidDownloadUrl ? (
                        <a
                          href={app.androidDownloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors text-center flex items-center justify-center gap-1 shadow-md shadow-emerald-950/30"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Android APK</span>
                        </a>
                      ) : hasWeb && app.webAppUrl ? (
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="w-full py-2 px-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors text-center flex items-center justify-center gap-1 shadow-md shadow-orange-950/30"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Open Web App</span>
                        </button>
                      ) : (
                        <div className="w-full py-2 px-2 bg-slate-800 text-slate-400 text-xs rounded-lg text-center font-medium">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onRequestConsulting={onRequestConsulting}
        />
      </div>
    </div>
  );
};
