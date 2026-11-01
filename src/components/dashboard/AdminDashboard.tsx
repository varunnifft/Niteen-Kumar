import React, { useState, useEffect } from 'react';
import {
  Shield,
  Layers,
  FileText,
  Bell,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Users,
  Search,
  Wrench,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  ApplicationItem,
  ConsultationRequest,
  Article,
  Announcement,
  SiteSettings,
  AdminStats
} from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'applications' | 'announcements' | 'articles' | 'settings'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Status edit modal state
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Under Review');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // App edit modal state
  const [editingApp, setEditingApp] = useState<ApplicationItem | null>(null);
  const [appSaving, setAppSaving] = useState(false);

  // New Announcement state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Application Release' | 'Feature Update' | 'Consulting Notice' | 'Technical Article' | 'Engineering Module'>('Application Release');
  const [newAnnDesc, setNewAnnDesc] = useState('');
  const [newAnnFull, setNewAnnFull] = useState('');
  const [newAnnService, setNewAnnService] = useState('Ironmaking Suite');
  const [annSaving, setAnnSaving] = useState(false);

  // Settings edit state
  const [settingsPhone, setSettingsPhone] = useState('');
  const [settingsEmergency, setSettingsEmergency] = useState('');
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsHq, setSettingsHq] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadAllData = () => {
    setLoading(true);
    Promise.all([
      api.getAdminStats(),
      api.getAllConsultations(),
      api.getApplications(),
      api.getAnnouncements(),
      api.getArticles(),
      api.getSettings()
    ])
      .then(([statsRes, consRes, appsRes, annRes, artRes, setRes]) => {
        setStats(statsRes);
        setConsultations(consRes.consultations);
        setApplications(appsRes.applications);
        setAnnouncements(annRes.announcements);
        setArticles(artRes.articles);
        setSettings(setRes.settings);

        setSettingsPhone(setRes.settings.phone);
        setSettingsEmergency(setRes.settings.emergencyPhone);
        setSettingsEmail(setRes.settings.email);
        setSettingsHq(setRes.settings.headquarters);
      })
      .catch((err) => {
        console.error('Failed to load admin dashboard data', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-slate-400">
            This dashboard is restricted to authorized plant administrators and principal metallurgical engineers.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-md shadow-orange-950/40"
          >
            Sign In with Administrator Credentials
          </button>
        </div>
      </div>
    );
  }

  // Handle consultation status change
  const handleUpdateStatus = async () => {
    if (!selectedConsultation) return;
    setStatusUpdating(true);
    setActionSuccess(null);
    try {
      await api.updateConsultationStatus(selectedConsultation.id, {
        status: newStatus,
        adminNotes
      });
      setActionSuccess(`Consultation ${selectedConsultation.id} status updated to ${newStatus}`);
      setSelectedConsultation(null);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to update consultation status');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Handle saving application changes
  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    setAppSaving(true);
    setActionSuccess(null);
    try {
      await api.updateApplication(editingApp.id, editingApp);
      setActionSuccess(`Application ${editingApp.name} updated successfully.`);
      setEditingApp(null);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to update application');
    } finally {
      setAppSaving(false);
    }
  };

  // Handle creating announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnSaving(true);
    setActionSuccess(null);
    try {
      await api.createAnnouncement({
        title: newAnnTitle,
        category: newAnnCategory,
        shortDescription: newAnnDesc,
        fullDetails: newAnnFull || newAnnDesc,
        relatedAppOrService: newAnnService,
        badge: 'Official Notice'
      });
      setActionSuccess('Service announcement published successfully.');
      setNewAnnTitle('');
      setNewAnnDesc('');
      setNewAnnFull('');
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to create announcement');
    } finally {
      setAnnSaving(false);
    }
  };

  // Handle saving site settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setActionSuccess(null);
    try {
      await api.updateSettings({
        phone: settingsPhone,
        emergencyPhone: settingsEmergency,
        email: settingsEmail,
        headquarters: settingsHq
      });
      setActionSuccess('Website contact coordinates updated.');
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
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
        {/* Admin Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/40">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Administrator Control Center
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 font-medium">
                  Verified Administrator
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Signed in as {user?.email} · Manage applications, review consulting requests, publish releases & edit plant settings.
              </p>
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Overview & Metrics
          </button>

          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'consultations'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>Consulting Requests</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded font-mono">
              {consultations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'applications'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Applications Management ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'announcements'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Announcements & Releases
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-950/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Website Contact Details
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <span className="text-xs text-slate-400 block">Total Consultations</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {stats.totalConsultations}
                </span>
                <span className="text-[10px] text-orange-400 mt-1 block">
                  {stats.pendingConsultations} Pending Review
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <span className="text-xs text-slate-400 block">Active Applications</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {stats.totalApplications}
                </span>
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  {stats.publishedApplications} Published Live
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <span className="text-xs text-slate-400 block">Knowledge Center Guides</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {stats.totalArticles}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">Metallurgical References</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <span className="text-xs text-slate-400 block">Registered Users</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {stats.totalUsers}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">Plant Personnel</span>
              </div>
            </div>

            {/* Status Breakdown Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Consultation Pipeline Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
                {['New', 'Under Review', 'Information Required', 'In Progress', 'Completed', 'Closed'].map((st) => (
                  <div key={st} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block truncate">{st}</span>
                    <span className="text-lg font-bold font-mono text-white mt-1 block">
                      {stats.statusCounts[st] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONSULTATIONS MANAGEMENT */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto">
              <h2 className="text-base font-bold text-white mb-4">
                Plant Consulting Submissions ({consultations.length})
              </h2>

              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-300 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Reference</th>
                    <th className="py-3 px-3">Client / Plant</th>
                    <th className="py-3 px-3">Topic</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {consultations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-850 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                        {c.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{c.fullName}</div>
                        <div className="text-[11px] text-slate-400">{c.companyName}</div>
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-slate-200">
                        {c.consultingTopic}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {c.preferredMethod}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedConsultation(c);
                            setNewStatus(c.status);
                            setAdminNotes(c.adminNotes || '');
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 rounded text-xs font-semibold"
                        >
                          Review / Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATIONS MANAGEMENT */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-white">Application Catalog & Download URLs</h2>
                  <p className="text-xs text-slate-400">
                    Configure real Android APK download links, web application links, or set to Coming Soon.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{app.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-orange-400 font-mono">
                          v{app.version}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          app.appType === 'coming_soon' ? 'bg-amber-950/40 text-amber-400 border border-amber-800' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
                        }`}>
                          {app.appType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono truncate max-w-lg">
                        APK: {app.androidDownloadUrl || 'None configured (Shows Coming Soon)'}
                      </p>
                      <p className="text-xs text-slate-400 font-mono truncate max-w-lg">
                        Web: {app.webAppUrl || 'None configured'}
                      </p>
                    </div>

                    <button
                      onClick={() => setEditingApp({ ...app })}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-orange-400" />
                      <span>Configure URLs & Version</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create Announcement Form */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Publish New Announcement / Release</h2>
              <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="e.g. Release of Blast Furnace Heat Balance v3.1"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newAnnCategory}
                    onChange={(e) => setNewAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Application Release">Application Release</option>
                    <option value="Feature Update">Feature Update</option>
                    <option value="Consulting Notice">Consulting Notice</option>
                    <option value="Technical Article">Technical Article</option>
                    <option value="Engineering Module">Engineering Module</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Related Application or Service</label>
                  <input
                    type="text"
                    value={newAnnService}
                    onChange={(e) => setNewAnnService(e.target.value)}
                    placeholder="e.g. CBAM Carbon Emissions Calculator"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    required
                    value={newAnnDesc}
                    onChange={(e) => setNewAnnDesc(e.target.value)}
                    placeholder="Brief 1-2 sentence summary displayed on homepage"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Full Announcement Details</label>
                  <textarea
                    rows={4}
                    value={newAnnFull}
                    onChange={(e) => setNewAnnFull(e.target.value)}
                    placeholder="Full technical details and changes"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={annSaving}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {annSaving ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </form>
            </div>

            {/* Existing Announcements Stream */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <h3 className="text-base font-bold text-white mb-2">
                Published Announcements ({announcements.length})
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-white">
                      <span>{ann.title}</span>
                      <span className="text-[10px] text-orange-400 font-mono">{ann.publicationDate}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{ann.shortDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WEBSITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-white">Website Technical & Emergency Coordinates</h2>
            <p className="text-xs text-slate-400">
              Update company address, plant emergency support telephone number, and official inquiry email addresses.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">General Inquiries Telephone</label>
                <input
                  type="text"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">24/7 Plant Emergency Hotline</label>
                <input
                  type="text"
                  value={settingsEmergency}
                  onChange={(e) => setSettingsEmergency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Headquarters Address</label>
                <textarea
                  rows={2}
                  value={settingsHq}
                  onChange={(e) => setSettingsHq(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={settingsSaving}
                className="py-2.5 px-5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {settingsSaving ? 'Saving Settings...' : 'Update Website Coordinates'}
              </button>
            </form>
          </div>
        )}

        {/* Status Review Modal */}
        {selectedConsultation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-orange-400 text-xs font-bold">
                    {selectedConsultation.id}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Review Consultation: {selectedConsultation.companyName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Contact: {selectedConsultation.fullName} ({selectedConsultation.email})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <strong className="text-slate-400">Topic: </strong>
                  <span className="text-white font-semibold">{selectedConsultation.consultingTopic}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Plant Type / Location: </strong>
                  <span className="text-slate-200">{selectedConsultation.plantType} · {selectedConsultation.plantLocation}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Problem Description: </strong>
                  <p className="text-slate-300 mt-1">{selectedConsultation.problemDescription}</p>
                </div>
                {selectedConsultation.currentOperatingParameters && (
                  <div>
                    <strong className="text-slate-400">Reported Operating Parameters: </strong>
                    <p className="text-slate-300 font-mono text-[11px] mt-1">{selectedConsultation.currentOperatingParameters}</p>
                  </div>
                )}
                {selectedConsultation.attachments && selectedConsultation.attachments.length > 0 && (
                  <div>
                    <strong className="text-slate-400 block mb-1">Attached Files ({selectedConsultation.attachments.length}):</strong>
                    <div className="flex flex-wrap gap-2">
                      {selectedConsultation.attachments.map((att, i) => (
                        <div key={i} className="px-2 py-1 bg-slate-900 rounded border border-slate-800 text-[11px] text-orange-400">
                          {att.name} ({(att.size / 1024).toFixed(0)} KB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Information Required">Information Required</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Engineering Committee Notes / Response to Client
                  </label>
                  <textarea
                    rows={4}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Enter diagnostic notes, request for further radar data, or scheduled video conference time..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={statusUpdating}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs disabled:opacity-50"
                >
                  {statusUpdating ? 'Updating...' : 'Save Consultation Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Application Modal */}
        {editingApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-100">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Configure: {editingApp.name}</h3>
                <button onClick={() => setEditingApp(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSaveApp} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Release Version</label>
                  <input
                    type="text"
                    value={editingApp.version}
                    onChange={(e) => setEditingApp({ ...editingApp, version: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Application Distribution Type</label>
                  <select
                    value={editingApp.appType}
                    onChange={(e) => setEditingApp({ ...editingApp, appType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="both">Both Android APK & Web App</option>
                    <option value="apk">Android APK Only</option>
                    <option value="web">Web Application Only</option>
                    <option value="coming_soon">Coming Soon (Under Verification)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Android APK Download URL</label>
                  <input
                    type="url"
                    value={editingApp.androidDownloadUrl || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, androidDownloadUrl: e.target.value })}
                    placeholder="https://downloads.ironmaking-tech.com/apps/app.apk"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">
                    Leave blank to indicate no APK is currently available.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Web Application Workspace URL</label>
                  <input
                    type="text"
                    value={editingApp.webAppUrl || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, webAppUrl: e.target.value })}
                    placeholder="/apps/app-name/launch"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPublishedCheck"
                    checked={editingApp.isPublished}
                    onChange={(e) => setEditingApp({ ...editingApp, isPublished: e.target.checked })}
                    className="accent-orange-500"
                  />
                  <label htmlFor="isPublishedCheck" className="text-slate-300">
                    Publish in Public Catalog
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingApp(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={appSaving}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs disabled:opacity-50"
                  >
                    {appSaving ? 'Saving...' : 'Update Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
