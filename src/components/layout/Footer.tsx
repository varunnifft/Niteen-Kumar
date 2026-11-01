import React from 'react';
import { Flame, Mail, Phone, MapPin, Shield, ExternalLink, ArrowUpRight } from 'lucide-react';
import { SiteSettings } from '../../types';

interface FooterProps {
  settings?: SiteSettings;
  onNavigate: (tab: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenLegal }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Upper Industrial Strip */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-white font-bold text-sm tracking-tight">
                Ironmaking Technology & Digital Solutions
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              "Smarter Ironmaking Through Engineering, Technology and Digital Innovation"
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Industrial engineering platform dedicated to blast furnace operations, raw material agglomeration (sintering & pelletizing), coke plant optimization, and advanced metallurgical computational software.
            </p>
          </div>

          {/* Col 2: Blast Furnace & Supporting Plants */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase mb-3 text-orange-400">
              Process Technologies
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('blast-furnace')}
                  className="hover:text-white transition-colors text-left"
                >
                  Blast Furnace Operations & Gas Dynamics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('supporting-plants')}
                  className="hover:text-white transition-colors text-left"
                >
                  Sinter Plant & FeO Basicity Control
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('supporting-plants')}
                  className="hover:text-white transition-colors text-left"
                >
                  Pellet Plant & Induration Grate
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('supporting-plants')}
                  className="hover:text-white transition-colors text-left"
                >
                  Coke Oven & CSR/CRI Quality
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('supporting-plants')}
                  className="hover:text-white transition-colors text-left"
                >
                  Pulverized Coal Injection (PCI)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('supporting-plants')}
                  className="hover:text-white transition-colors text-left"
                >
                  Top Pressure Recovery Turbine (TRT)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Applications & Consulting */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase mb-3 text-orange-400">
              Digital Tools & Consulting
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('applications')}
                  className="hover:text-white transition-colors text-left"
                >
                  Burden Distribution Trajectory Model
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('applications')}
                  className="hover:text-white transition-colors text-left"
                >
                  CBAM Carbon Emissions Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('applications')}
                  className="hover:text-white transition-colors text-left"
                >
                  Furnace Geometry & Refractory Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('consulting')}
                  className="hover:text-white transition-colors text-left"
                >
                  Plant Performance & Stability Audits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('consulting')}
                  className="hover:text-white transition-colors text-left"
                >
                  Fuel Rate & Productivity Improvement
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knowledge')}
                  className="hover:text-white transition-colors text-left"
                >
                  Technical Knowledge Center & Calculators
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Plant Contact & Emergency Support */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase mb-3 text-orange-400">
              Industrial Coordination
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">
                  {settings?.headquarters || 'Metallurgical Towers, Industrial Technology Corridor, Ranchi / Jamshedpur Engineering Hub, India'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{settings?.phone || '+91 (0651) 240-8800'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{settings?.email || 'contact@ironmaking-tech.com'}</span>
              </div>
              <div className="p-2.5 bg-slate-950/80 border border-orange-500/30 rounded-lg mt-3">
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                  24/7 Blast Furnace Incident Support
                </p>
                <p className="text-white font-mono text-xs font-semibold mt-0.5">
                  {settings?.emergencyPhone || '+91 (0651) 240-8899'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-[11px]">
          © {new Date().getFullYear()} Ironmaking Technology & Digital Solutions. All industrial engineering rights reserved.
        </p>

        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-slate-200 transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-slate-700">·</span>
          <button
            onClick={() => onOpenLegal('terms')}
            className="hover:text-slate-200 transition-colors"
          >
            Terms of Service
          </button>
          <span className="text-slate-700">·</span>
          <button
            onClick={() => onOpenLegal('disclaimer')}
            className="hover:text-slate-200 transition-colors"
          >
            Metallurgical Engineering Disclaimer
          </button>
        </div>
      </div>
    </footer>
  );
};
