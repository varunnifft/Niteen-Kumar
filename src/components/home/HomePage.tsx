import React from 'react';
import {
  Flame,
  Layers,
  Wrench,
  Cpu,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Zap,
  Activity,
  Factory,
  Cog,
  Wind,
  Sliders,
  ChevronRight,
  TrendingUp,
  Clock,
  Download
} from 'lucide-react';
import { ApplicationItem, Announcement, Article } from '../../types';

interface HomePageProps {
  applications: ApplicationItem[];
  announcements: Announcement[];
  articles: Article[];
  onNavigate: (tab: string) => void;
  onRequestConsulting: () => void;
  onSelectApplication: (app: ApplicationItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  applications,
  announcements,
  articles,
  onNavigate,
  onRequestConsulting,
  onSelectApplication
}) => {
  const featuredApps = applications.slice(0, 4);
  const latestAnnouncements = announcements.slice(0, 3);
  const featuredArticles = articles.slice(0, 2);

  const majorAreas = [
    {
      id: 'blast-furnace',
      title: 'Blast Furnace Operations',
      desc: 'Thermochemical counter-current reduction, bell-less chute burden trajectory, raceway combustion kinetics, and hearth deadman drainage.',
      icon: Flame,
      tag: 'Core Pyrometallurgy'
    },
    {
      id: 'supporting-plants',
      title: 'Sintering Plants',
      desc: 'Travelling grate strand permeability, FeO & basicity (B2 = 1.8-2.2) optimization, Burn-Through Point (BTP) automation, and RDI reduction.',
      icon: Layers,
      tag: 'Fine Ore Agglomeration'
    },
    {
      id: 'supporting-plants',
      title: 'Pelletizing Complexes',
      desc: 'Disc balling green strength, induration thermal cycles (1250-1320°C), Cold Crushing Strength (CCS > 250 daN), and low-swelling pellet metallurgy.',
      icon: Factory,
      tag: 'High-Fe Burden'
    },
    {
      id: 'supporting-plants',
      title: 'Coke Oven Batteries',
      desc: 'Coal carbonization, CSR (>65%) & CRI (<24%) enhancement, stamp charging density, and Coke Dry Quenching (CDQ) waste heat recovery.',
      icon: Activity,
      tag: 'Structural Carbon Grid'
    },
    {
      id: 'supporting-plants',
      title: 'Pulverized Coal Injection (PCI)',
      desc: 'Vertical roller milling, inert N2 gas drying, dense-phase injection, and coaxial tuyere lances delivering coke replacement ratios up to 0.95.',
      icon: Zap,
      tag: 'Coke Reduction'
    },
    {
      id: 'supporting-plants',
      title: 'Gas Recovery & TRT Turbines',
      desc: 'Dry baghouse dust cleaning (<5 mg/Nm³), Top Pressure Recovery Turbines generating 35-55 kWh/tHM, and blast furnace gas calorific utilization.',
      icon: Wind,
      tag: 'Clean Energy & TRT'
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. INDUSTRIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800 pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle fiery glow backdrop representing blast furnace molten tapped metal */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-orange-400 font-medium shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span>Industrial Blast Furnace & Metallurgical Solutions</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                  Ironmaking Technology <br />
                  <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">
                    & Digital Solutions
                  </span>
                </h1>
                <p className="text-base sm:text-xl text-slate-300 font-medium tracking-tight">
                  "Smarter Ironmaking Through Engineering, Technology and Digital Innovation"
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                A high-precision engineering platform delivering computational software, process troubleshooting, raw material agglomeration optimization, and comprehensive metallurgical consulting for blast furnace operations, plant general managers, and process engineers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('applications')}
                  className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all shadow-lg shadow-orange-950/40 flex items-center gap-2 group"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Explore Our Applications</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onRequestConsulting}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4 text-orange-400" />
                  <span>Request Technical Consultation</span>
                </button>

                <button
                  onClick={() => onNavigate('news')}
                  className="px-4 py-3 text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  Latest Updates →
                </button>
              </div>
            </div>

            {/* Right Column: Live Operational Telemetry HUD Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Blast Furnace Digital Operating Benchmark
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                    Active Furnace State
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5 mt-4">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hot Metal Temperature</span>
                    <span className="text-lg font-bold font-mono text-orange-400 mt-0.5 block">1,515 °C</span>
                    <span className="text-[10px] text-slate-500">Target: 1495 – 1525°C</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Flame Temp (RAFT)</span>
                    <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">2,185 °C</span>
                    <span className="text-[10px] text-slate-500">Raceway Window: 2100-2250°C</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Specific Fuel Rate</span>
                    <span className="text-lg font-bold font-mono text-white mt-0.5 block">492 <span className="text-xs font-normal text-slate-400">kg/tHM</span></span>
                    <span className="text-[10px] text-slate-500">Coke: 345kg · PCI: 147kg</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Top Gas Efficiency (ηCO)</span>
                    <span className="text-lg font-bold font-mono text-cyan-400 mt-0.5 block">49.8 %</span>
                    <span className="text-[10px] text-slate-500">CO2 / (CO + CO2)</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Slag Basicity (B2)</span>
                    <span className="text-lg font-bold font-mono text-white mt-0.5 block">1.16</span>
                    <span className="text-[10px] text-slate-500">CaO / SiO2 (Fluidity & Desulf)</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Top Pressure</span>
                    <span className="text-lg font-bold font-mono text-white mt-0.5 block">2.15 <span className="text-xs font-normal text-slate-400">bar</span></span>
                    <span className="text-[10px] text-slate-500">Dry TRT Generation Active</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Calculated via ITDS Heat & Mass Balance Engine</span>
                  <button
                    onClick={() => onNavigate('blast-furnace')}
                    className="text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    Open Simulator →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAJOR INDUSTRIAL AREAS SECTION */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              Integrated Metallurgical Value Chain
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Major Industrial Engineering Disciplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              From raw iron ore concentrate to liquid hot metal in the steel ladles, our engineering services and software applications span every pyrometallurgical asset in the ironmaking battery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorAreas.map((area, i) => {
              const Icon = area.icon;
              return (
                <div
                  key={i}
                  onClick={() => onNavigate(area.id)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-950/10 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                        {area.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                        {area.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-2">
                        {area.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-6 flex items-center text-xs font-semibold text-orange-400 group-hover:text-orange-300">
                    <span>Explore Technical Details</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED APPLICATIONS SHOWCASE */}
      <section className="py-20 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                Digital Engineering Tools
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Featured Industrial Software Suite
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Rigorous metallurgical calculation engines for burden trajectory, heat balances, linear cost programming, and CBAM compliance.
              </p>
            </div>

            <button
              onClick={() => onNavigate('applications')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>View All 9 Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredApps.map((app) => (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-orange-400 font-mono font-semibold">
                      v{app.version}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {app.latestUpdateDate}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                      {app.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {app.shortDescription}
                    </p>
                  </div>

                  <ul className="space-y-1 pt-1 border-t border-slate-800/80">
                    {app.features.slice(0, 2).map((feat, fi) => (
                      <li key={fi} className="text-[10px] text-slate-300 flex items-start gap-1">
                        <CheckCircle2 className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-2">
                  <button
                    onClick={() => onSelectApplication(app)}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors border border-slate-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TECHNICAL CONSULTING HIGHLIGHT SECTION */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-orange-500/30 rounded-2xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl space-y-5">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                Specialized Technical Consulting
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Resolve Plant Disturbances, Decrease Fuel Consumption & Stabilize Furnace Walls
              </h2>
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
                Facing hanging, slipping, high lower-stack heat load, poor sinter Tumbler index, or excessive fuel rate? Our senior metallurgical consultants provide targeted engineering audits, radar-calibrated chute distribution patterns, and raw material optimization.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Burden distribution matrix optimization</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sinter FeO & basicity RDI stabilization</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Coke CSR / CRI quality benchmarking</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hearth thermal profile & deadman permeability</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={onRequestConsulting}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs sm:text-sm shadow-lg shadow-orange-950/40 transition-colors flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Submit Plant Problem for Consultation</span>
                </button>
                <button
                  onClick={() => onNavigate('consulting')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs sm:text-sm border border-slate-700 transition-colors"
                >
                  Learn About Our Consulting Process
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST ARTICLES & SERVICE ANNOUNCEMENTS */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                Knowledge & Announcements
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Latest Engineering Insights & Release Notices
              </h2>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
            >
              <span>View All Releases</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Announcements Column */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400">
                Service & Software Announcements
              </h3>
              <div className="space-y-3">
                {latestAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => onNavigate('news')}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span className="text-orange-400 font-semibold">{ann.category}</span>
                      <span>{ann.publicationDate}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white hover:text-orange-400 transition-colors">
                      {ann.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {ann.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Articles Column */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400">
                Technical Knowledge Guides
              </h3>
              <div className="space-y-3">
                {featuredArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onNavigate('knowledge')}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span className="text-orange-400 font-semibold">{art.category}</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white hover:text-orange-400 transition-colors">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {art.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION CTA */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Have a Specific Metallurgical or Computational Requirement?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Connect with our engineering technical desk for customized software installations, enterprise API access, or plant audit proposals.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs sm:text-sm shadow-lg shadow-orange-950/40 transition-colors"
            >
              Contact Our Engineers
            </button>
            <button
              onClick={onRequestConsulting}
              className="px-6 py-3 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs sm:text-sm transition-colors"
            >
              Request Plant Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
