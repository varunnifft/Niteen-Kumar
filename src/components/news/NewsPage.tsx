import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Announcement } from '../../types';
import { api } from '../../services/api';

export const NewsPage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Application Release',
    'Feature Update',
    'Consulting Notice',
    'Technical Article',
    'Engineering Module'
  ];

  useEffect(() => {
    api.getAnnouncements()
      .then((res) => {
        setAnnouncements(res.announcements);
      })
      .catch((err) => {
        console.error('Failed to load announcements', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredAnnouncements = announcements.filter((ann) => {
    return selectedCategory === 'All' || ann.category === selectedCategory;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
              <Bell className="w-4 h-4" />
              Service Announcements & Releases
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              News, Releases & Industrial Updates
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl text-sm leading-relaxed">
              Stay informed with our latest ironmaking computational software versions, metallurgical advisory announcements, and engineering field research.
            </p>
          </div>

          {/* Category Filter */}
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
        </div>

        {/* Announcements Stream */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            Loading service announcements...
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="py-16 text-center bg-slate-900 rounded-xl border border-slate-800 p-8">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No announcements in this category</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredAnnouncements.map((ann) => {
              const isExpanded = expandedId === ann.id;

              return (
                <div
                  key={ann.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 transition-all hover:border-slate-700 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="text-orange-400 font-semibold">{ann.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {ann.publicationDate}
                      </span>
                    </div>

                    {ann.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30">
                        {ann.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white hover:text-orange-400 transition-colors cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : ann.id)}>
                      {ann.title}
                    </h2>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {ann.shortDescription}
                    </p>
                  </div>

                  {/* Expanded Full Details */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-800 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-lg">
                      <p>{ann.fullDetails}</p>
                      {ann.relatedAppOrService && (
                        <div className="pt-2 text-xs text-slate-400">
                          Related Resource: <strong className="text-white">{ann.relatedAppOrService}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                      className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Show Less' : 'Read Full Announcement'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    <button
                      onClick={() => onNavigate('applications')}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <span>View Applications</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
