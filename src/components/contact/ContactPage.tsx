import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Wrench,
  Headphones,
  ShieldAlert
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { api } from '../../services/api';

export const ContactPage: React.FC<{
  settings?: SiteSettings;
  onRequestConsulting: () => void;
}> = ({ settings, onRequestConsulting }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Consulting');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await api.sendContact({
        name,
        company,
        email,
        phone,
        inquiryType,
        message
      });
      setSuccess('Thank you. Your message has been routed to our ironmaking engineering desk.');
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
            <Mail className="w-4 h-4" />
            Global Industrial Communication Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact & Metallurgical Support
          </h1>
          <p className="mt-2 text-slate-400 max-w-2xl text-sm leading-relaxed">
            Reach our plant consulting group, computational software support desk, or emergency blast furnace incident support hotline.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onRequestConsulting}
            className="p-5 bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/40 rounded-xl text-left hover:border-orange-500 transition-all flex items-center justify-between group shadow-lg shadow-orange-950/20"
          >
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-1">
                Fast-Track Channel
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                Request Technical Plant Consultation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Submit operational parameters, burden mix, and plant problems with file upload.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-600/20 text-orange-400 group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
          </button>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-left flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Software Support Desk
              </span>
              <h3 className="text-base font-bold text-white">
                Application Technical Assistance
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct inquiry regarding software APK licenses, web versions, and integration APIs.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800 text-slate-300">
              <Headphones className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Contact Coordinates & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                Headquarters & Plant Coordination
              </h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Engineering Headquarters</span>
                    <span className="text-slate-400 leading-relaxed block mt-0.5">
                      {settings?.headquarters || 'Metallurgical Towers, Industrial Technology Corridor, Ranchi / Jamshedpur Engineering Hub, India'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">General Enquiries & Office</span>
                    <span className="text-slate-400 font-mono block mt-0.5">
                      {settings?.phone || '+91 (0651) 240-8800'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Official Email</span>
                    <span className="text-slate-400 block mt-0.5">
                      {settings?.email || 'contact@ironmaking-tech.com'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Operational Hours</span>
                    <span className="text-slate-400 block mt-0.5">
                      {settings?.officeHours || 'Monday - Saturday: 08:30 - 18:30 IST'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Hotline Box */}
              <div className="p-4 bg-slate-950 border border-orange-500/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>24/7 Blast Furnace Incident Support</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  For immediate plant emergencies (tuyere burn-outs, gas leaks, severe hanging, cooling member failure):
                </p>
                <div className="text-base font-bold font-mono text-white pt-1">
                  {settings?.emergencyPhone || '+91 (0651) 240-8899'}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white">Send Us a Direct Message</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                For general technical queries, partnership inquiries, or application access assistance.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {success && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Your Name <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Steel Plant / Design Firm"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Email Address <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Telephone / Mobile
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Inquiry Nature
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Consulting">Consulting / Plant Audit</option>
                  <option value="Technical Support">Application Technical Support</option>
                  <option value="Application Info">Application Licensing & Deployment</option>
                  <option value="General">General Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Message Details <span className="text-orange-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our metallurgical engineering team assist you?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-md shadow-orange-950/40 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Dispatching Message...' : 'Send Inquiry to Engineering Team'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
