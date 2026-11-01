import React from 'react';
import { X, Shield, FileText, AlertTriangle } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'disclaimer' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-600/10 border border-orange-500/30 text-orange-400">
              {type === 'privacy' && <Shield className="w-5 h-5" />}
              {type === 'terms' && <FileText className="w-5 h-5" />}
              {type === 'disclaimer' && <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {type === 'privacy' && 'Industrial Privacy Policy'}
                {type === 'terms' && 'Terms of Industrial Service & Software License'}
                {type === 'disclaimer' && 'Metallurgical Engineering & Safety Disclaimer'}
              </h2>
              <p className="text-xs text-slate-400">
                Ironmaking Technology & Digital Solutions · Effective 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed">
          {type === 'privacy' && (
            <>
              <h4 className="font-bold text-white text-sm">1. Industrial Operating Data Protection</h4>
              <p>
                Ironmaking Technology & Digital Solutions respects the sensitive proprietary nature of plant operating parameters, burden matrices, fuel rates, raw material assays, and thermocouple telemetry uploaded to our platform. All data transmitted through consulting inquiries or computational tools is encrypted using industry standard protocols.
              </p>
              <h4 className="font-bold text-white text-sm">2. Non-Disclosure & Enterprise Confidentiality</h4>
              <p>
                We do not sell, rent, or monetize client plant data or technical attachments. Operating information is reviewed strictly by designated metallurgical engineers for the explicit purpose of conducting requested audits and generating diagnostic reports.
              </p>
              <h4 className="font-bold text-white text-sm">3. User Credentials & Access</h4>
              <p>
                Account passwords are encrypted using salted multi-iteration cryptographic hashes (PBKDF2). Access tokens are scoped with expiry and stored securely.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h4 className="font-bold text-white text-sm">1. Application Use & Licensing</h4>
              <p>
                The computational tools (including Blast Furnace Burden Distribution, Geometry, Heat Balance, Cost Planning, Sinter Optimization, and CBAM Carbon Accounting) are licensed for verified plant operations, academic research, and engineering design.
              </p>
              <h4 className="font-bold text-white text-sm">2. Plant Technical Implementation</h4>
              <p>
                Calculations provided by online tools or software models are theoretical thermodynamic simulations based on standard pyrometallurgical principles. Physical implementation into live blast furnace control systems must always be supervised and authorized by the facility's licensed blast furnace operating head.
              </p>
              <h4 className="font-bold text-white text-sm">3. Software Download & Versioning</h4>
              <p>
                Official Android APKs and web application endpoints are distributed solely through our verified domains. Users agree not to decompile or tamper with proprietary calculation binaries.
              </p>
            </>
          )}

          {type === 'disclaimer' && (
            <>
              <h4 className="font-bold text-white text-sm">1. Pyrometallurgical Operating Safety</h4>
              <p>
                Blast furnace ironmaking involves extreme temperatures (exceeding 2200°C in the raceway), high pressures (up to 4.5 bar), toxic carbon monoxide (CO) gas, and molten hot metal and slag. All emergency standard operating procedures (SOPs), gas safety protocols, and plant troubleshooting recommendations must be adapted to each steelworks' localized safety regulations, blast furnace dimensions, and refractory condition.
              </p>
              <h4 className="font-bold text-white text-sm">2. Limitation of Liability</h4>
              <p>
                While our algorithms and consulting recommendations are based on established metallurgical science and decades of industrial field experience, Ironmaking Technology & Digital Solutions cannot be held liable for mechanical failure, refractory wear, tuyere burn-outs, or operational downtime arising from uncalibrated or unsupervised process parameter adjustments.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
