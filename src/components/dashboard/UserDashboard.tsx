import React, { useState, useEffect } from 'react';
import {
  User,
  Building2,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Clock,
  Layers,
  Smartphone,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ConsultationRequest, ApplicationItem } from '../../types';

export const UserDashboard: React.FC<{
  onNavigate: (tab: string) => void;
  onRequestConsulting: () => void;
}> = ({ onNavigate, onRequestConsulting }) => {
  const { user, updateProfile, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'requests' | 'applications' | 'profile'>('requests');
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    Promise.all([api.getMyConsultations(), api.getApplications()])
      .then(([consRes, appsRes]) => {
        setConsultations(consRes.consultations);
        setApplications(appsRes.applications);
      })
      .catch((err) => {
        console.error('Failed to load user dashboard data', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Member Portal Authentication</h2>
          <p className="text-xs text-slate-400">
            Please log in or register your technical account to track consulting requests and access software packages.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-md shadow-orange-950/40"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      await updateProfile({
        fullName,
        companyName,
        designation,
        mobile
      });
      setProfileMessage('Profile credentials updated successfully.');
    } catch (err: any) {
      setProfileMessage(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'text-blue-400 bg-blue-950/50 border-blue-800';
      case 'Under Review':
        return 'text-amber-400 bg-amber-950/50 border-amber-800';
      case 'Information Required':
        return 'text-purple-400 bg-purple-950/50 border-purple-800';
      case 'In Progress':
        return 'text-orange-400 bg-orange-950/50 border-orange-800';
      case 'Completed':
        return 'text-emerald-400 bg-emerald-950/50 border-emerald-800';
      case 'Closed':
        return 'text-slate-400 bg-slate-800 border-slate-700';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* User Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-950/40">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user.fullName}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-orange-400 font-medium">
                  {user.role === 'admin' ? 'Administrator' : 'Plant Member'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {user.designation} · {user.companyName} · {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRequestConsulting}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-950/40 transition-colors"
            >
              Submit New Consulting Request
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Consulting Requests ({consultations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Application Downloads</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* TAB 1: CONSULTING REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-xs">
                Loading submitted consultation requests...
              </div>
            ) : consultations.length === 0 ? (
              <div className="py-16 text-center bg-slate-900 rounded-xl border border-slate-800 p-8 space-y-3">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Consulting Requests Filed Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Submit your plant operational parameters or troubleshooting challenge to get engineering assistance.
                </p>
                <button
                  onClick={onRequestConsulting}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Start Request Form
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-white">
                            {req.id}
                          </span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadge(req.status)}`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-orange-400 font-semibold mt-0.5">
                          {req.consultingTopic}
                        </p>
                      </div>

                      <div className="text-right text-xs text-slate-400 font-mono">
                        Submitted: {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-2">
                      <p className="leading-relaxed">
                        <strong className="text-slate-400">Problem Description: </strong>
                        {req.problemDescription}
                      </p>
                      {req.currentOperatingParameters && (
                        <p className="leading-relaxed font-mono bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300">
                          <strong className="text-orange-400 font-sans">Operating Parameters: </strong>
                          {req.currentOperatingParameters}
                        </p>
                      )}
                    </div>

                    {/* Admin Response Note */}
                    {req.adminNotes && (
                      <div className="bg-slate-950 p-3.5 rounded-lg border border-orange-500/30 text-xs space-y-1">
                        <span className="font-bold text-orange-400 uppercase tracking-wider text-[10px] block">
                          Consulting Committee Official Feedback:
                        </span>
                        <p className="text-slate-200 leading-relaxed">
                          {req.adminNotes}
                        </p>
                      </div>
                    )}

                    {/* Attachments */}
                    {req.attachments && req.attachments.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                          Submitted Attachments ({req.attachments.length}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {req.attachments.map((att, i) => (
                            <div
                              key={i}
                              className="px-2.5 py-1 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 font-mono text-[11px]"
                            >
                              <FileText className="w-3.5 h-3.5 text-orange-400" />
                              <span>{att.name}</span>
                              <span className="text-slate-500">({(att.size / 1024).toFixed(0)} KB)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPLICATION DOWNLOADS */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-base font-bold text-white mb-1">
                Authorized Application Repositories
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                All registered industrial software modules, latest release APKs, and browser client endpoints.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{app.name}</h4>
                      <p className="text-xs text-slate-400">
                        v{app.version} · {app.category}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {app.androidDownloadUrl ? (
                        <a
                          href={app.androidDownloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>APK</span>
                        </a>
                      ) : null}

                      {app.webAppUrl ? (
                        <button
                          onClick={() => alert(`Launching ${app.name}`)}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Web</span>
                        </button>
                      ) : null}

                      {!app.androidDownloadUrl && !app.webAppUrl && (
                        <span className="text-[11px] text-slate-500 bg-slate-900 px-2.5 py-1 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">Update Plant Professional Profile</h2>
              <p className="text-xs text-slate-400">Keep your company and contact information up-to-date for consulting communications.</p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              {profileMessage && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{profileMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Company / Plant</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="py-2.5 px-5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {profileSaving ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
