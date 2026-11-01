import React, { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Shield,
  Smartphone,
  Globe,
  Sliders,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { ApplicationItem } from '../../types';

interface ApplicationDetailModalProps {
  application: ApplicationItem | null;
  onClose: () => void;
  onRequestConsulting: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onRequestConsulting
}) => {
  if (!application) return null;

  // Embedded Interactive Simulator State for CBAM Calculator
  const [cbamProduction, setCbamProduction] = useState(5000); // tHM/day
  const [cbamCokeRate, setCbamCokeRate] = useState(370); // kg/tHM
  const [cbamPciRate, setCbamPciRate] = useState(165); // kg/tHM
  const [cbamCarbonPrice, setCbamCarbonPrice] = useState(75); // €/tCO2

  // Computed CBAM outputs
  const scope1EmissionFactor = ((cbamCokeRate * 3.1) + (cbamPciRate * 2.45) + 80) / 1000; // tCO2/tHM
  const dailyTotalEmissions = (cbamProduction * scope1EmissionFactor).toFixed(0);
  const annualCarbonCostEur = ((cbamProduction * scope1EmissionFactor * 365) * cbamCarbonPrice).toLocaleString();

  // Embedded Interactive Simulator State for Burden Distribution Chute
  const [chuteAngle1, setChuteAngle1] = useState(48);
  const [chuteAngle2, setChuteAngle2] = useState(38);
  const [chuteAngle3, setChuteAngle3] = useState(26);
  const [centralCokePlug, setCentralCokePlug] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-600/10 border border-orange-500/30 text-orange-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {application.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-orange-400 font-mono">
                  v{application.version}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {application.category} · Updated {application.latestUpdateDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Main Description */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Technical Description & Overview
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {application.fullDescription}
            </p>
          </div>

          {/* Key Features & Intended Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 text-orange-400">
                <CheckCircle2 className="w-4 h-4" />
                Core Application Capabilities
              </h4>
              <ul className="space-y-2">
                {application.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-xs leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 text-orange-400">
                  Target Operating Profiles
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  {application.targetUsers}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 text-orange-400">
                  System Requirements
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono">
                  {application.systemRequirements}
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Live Tool Preview for CBAM Calculator */}
          {application.slug === 'cbam-calculator' && (
            <div className="p-5 bg-slate-950 rounded-xl border border-orange-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-400" />
                  <span className="font-bold text-white text-xs sm:text-sm">
                    Live In-Browser Simulation: Carbon Intensity & CBAM Impact
                  </span>
                </div>
                <span className="text-[10px] text-orange-400 font-mono uppercase">Interactive Module</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Daily Hot Metal (t/d)</label>
                  <input
                    type="number"
                    value={cbamProduction}
                    onChange={(e) => setCbamProduction(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Coke Rate (kg/tHM)</label>
                  <input
                    type="number"
                    value={cbamCokeRate}
                    onChange={(e) => setCbamCokeRate(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">PCI Rate (kg/tHM)</label>
                  <input
                    type="number"
                    value={cbamPciRate}
                    onChange={(e) => setCbamPciRate(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Specific Emission Factor</span>
                  <span className="text-lg font-bold font-mono text-orange-400">
                    {scope1EmissionFactor.toFixed(3)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">tCO2e / tHM</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Daily Plant Emissions</span>
                  <span className="text-lg font-bold font-mono text-white">
                    {Number(dailyTotalEmissions).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">tCO2e / day</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Annual CBAM Value (@€75)</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    €{annualCarbonCostEur}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Projected Exposure</span>
                </div>
              </div>
            </div>
          )}

          {/* Embedded Live Tool Preview for Burden Distribution */}
          {application.slug === 'burden-distribution' && (
            <div className="p-5 bg-slate-950 rounded-xl border border-orange-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-400" />
                  <span className="font-bold text-white text-xs sm:text-sm">
                    Bell-Less Chute Tilting Angle Simulator
                  </span>
                </div>
                <span className="text-[10px] text-orange-400 font-mono uppercase">Matrix Preview</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Wall Ring Angle (Ring 1)</span>
                    <span className="font-mono text-orange-400">{chuteAngle1}°</span>
                  </div>
                  <input
                    type="range"
                    min="42"
                    max="52"
                    value={chuteAngle1}
                    onChange={(e) => setChuteAngle1(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Mid-Radius Angle (Ring 2)</span>
                    <span className="font-mono text-orange-400">{chuteAngle2}°</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="42"
                    value={chuteAngle2}
                    onChange={(e) => setChuteAngle2(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Center Ring Angle (Ring 3)</span>
                    <span className="font-mono text-orange-400">{chuteAngle3}°</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="30"
                    value={chuteAngle3}
                    onChange={(e) => setChuteAngle3(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-300">Central Coke Charging (Coke Plug for gas channel preservation):</span>
                <button
                  onClick={() => setCentralCokePlug(!centralCokePlug)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    centralCokePlug ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {centralCokePlug ? 'Enabled (Recommended)' : 'Disabled'}
                </button>
              </div>
            </div>
          )}

          {/* Technical Highlights */}
          {application.technicalHighlights && application.technicalHighlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-orange-400">
                Engineering Field Validation
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {application.technicalHighlights.map((hl, i) => (
                  <li key={i} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 flex items-start gap-2">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            Installation Support: <strong className="text-white">support@ironmaking-tech.com</strong>
          </div>

          <div className="flex items-center gap-3">
            {application.appType === 'coming_soon' || (!application.androidDownloadUrl && !application.webAppUrl) ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>Coming Soon (Verification Phase)</span>
              </div>
            ) : (
              <>
                {application.androidDownloadUrl && (
                  <a
                    href={application.androidDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs transition-colors shadow-md shadow-emerald-950/40"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Download Android APK</span>
                  </a>
                )}
                {application.webAppUrl && (
                  <button
                    onClick={() => {
                      alert(`Launching Web Application: ${application.name} in interactive workspace.`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg text-xs transition-colors shadow-md shadow-orange-950/40"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Open Web Application</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => {
                onClose();
                onRequestConsulting();
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors border border-slate-700"
            >
              Consulting Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
