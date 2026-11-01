import React, { useState } from 'react';
import {
  Wrench,
  Send,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  Shield,
  Layers,
  Flame,
  Activity,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ConsultationRequest } from '../../types';

export const ConsultingPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [plantLocation, setPlantLocation] = useState('');
  const [plantType, setPlantType] = useState('Integrated Steel Plant (Large BF)');
  const [consultingTopic, setConsultingTopic] = useState('Blast furnace operation and performance improvement');
  const [problemDescription, setProblemDescription] = useState('');
  const [currentOperatingParameters, setCurrentOperatingParameters] = useState('');
  const [expectedImprovement, setExpectedImprovement] = useState('');
  const [preferredMethod, setPreferredMethod] = useState('Remote engineering audit & virtual review');

  // File Attachments State
  const [attachments, setAttachments] = useState<Array<{ name: string; size: number; type: string; dataUrl?: string }>>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  // Status Tracking Lookup State
  const [trackRefId, setTrackRefId] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [trackedRecord, setTrackedRecord] = useState<Partial<ConsultationRequest> | null>(null);

  const topics = [
    'Blast furnace operation and performance improvement',
    'Sinter plant productivity and quality optimization',
    'Pellet plant process optimization',
    'Coke quality and fuel rate improvement',
    'Raw material quality assessment',
    'Burden distribution and furnace stability',
    'Fuel rate and productivity improvement',
    'Process troubleshooting and technical analysis',
    'Industrial safety and emergency preparedness',
    'Energy efficiency and carbon emission reduction'
  ];

  const plantTypes = [
    'Integrated Steel Plant (Large BF > 2500 m³)',
    'Mid-Sized Blast Furnace Plant (1000 – 2500 m³)',
    'Mini Blast Furnace / Merchant Pig Iron Plant (< 1000 m³)',
    'Standalone Sintering Plant',
    'Standalone Pelletizing Complex',
    'Merchant Coke Oven Battery',
    'Engineering Consulting / EPC Firm'
  ];

  const methods = [
    'Remote engineering audit & virtual review',
    'On-site plant diagnostic audit & field survey',
    'Video conference technical review & data modeling',
    'Detailed computational analysis report & recommendations'
  ];

  // Handle file uploads (validates type: PDF, Excel, Word, PNG/JPG; max size 15MB)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > 5) {
      setFileError('Maximum 5 files allowed per consulting submission.');
      return;
    }

    const validExtensions = ['.pdf', '.xlsx', '.xls', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.csv'];

    Array.from(files).forEach((file) => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validExtensions.includes(ext)) {
        setFileError(`Invalid file format "${file.name}". Supported: PDF, Excel, Word, CSV, Images.`);
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        setFileError(`File "${file.name}" exceeds the 15MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
            dataUrl: typeof reader.result === 'string' ? reader.result : undefined
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await api.submitConsultation({
        fullName,
        companyName,
        designation,
        email,
        mobile,
        plantLocation,
        plantType,
        consultingTopic,
        problemDescription,
        currentOperatingParameters,
        expectedImprovement,
        preferredMethod,
        attachments
      });

      setSubmittedRefId(res.referenceId);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit consultation request. Please check the network.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRefId.trim()) return;

    setTrackingLoading(true);
    setTrackingError(null);
    setTrackedRecord(null);

    try {
      const res = await api.trackConsultation(trackRefId.trim());
      setTrackedRecord(res.consultation);
    } catch (err: any) {
      setTrackingError(err.message || 'Reference number not found.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'New':
        return 'text-blue-400 bg-blue-950/40 border-blue-800';
      case 'Under Review':
        return 'text-amber-400 bg-amber-950/40 border-amber-800';
      case 'Information Required':
        return 'text-purple-400 bg-purple-950/40 border-purple-800';
      case 'In Progress':
        return 'text-orange-400 bg-orange-950/40 border-orange-800';
      case 'Completed':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800';
      case 'Closed':
        return 'text-slate-400 bg-slate-800 border-slate-700';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
              <Wrench className="w-4 h-4" />
              Industrial Metallurgical Advisory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Technical Consulting Services
            </h1>
            <p className="mt-2 text-slate-400 max-w-3xl text-sm leading-relaxed">
              Engage our senior blast furnace superintendents and process metallurgists to resolve operating irregularities, decrease specific fuel consumption, improve sinter and coke indices, and audit plant safety.
            </p>
          </div>

          {/* Quick Track Shortcut */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shrink-0 w-full md:w-80 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-orange-400" />
              Track Submitted Request
            </span>
            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                value={trackRefId}
                onChange={(e) => setTrackRefId(e.target.value)}
                placeholder="e.g. ITDS-2026-0412"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shrink-0 disabled:opacity-50"
              >
                Track
              </button>
            </form>
          </div>
        </div>

        {/* Tracked Record Alert Box (If Tracked) */}
        {trackingLoading && (
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
            Searching consultation database for {trackRefId}...
          </div>
        )}

        {trackingError && (
          <div className="p-4 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{trackingError}</span>
          </div>
        )}

        {trackedRecord && (
          <div className="bg-slate-900 border-2 border-orange-500/50 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Consultation Reference</span>
                <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  <span>{trackedRecord.id}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-sans font-medium ${getStatusColor(trackedRecord.status)}`}>
                    {trackedRecord.status}
                  </span>
                </h3>
              </div>
              <div className="text-right text-xs text-slate-400 font-mono">
                Last Updated: {trackedRecord.updatedAt ? new Date(trackedRecord.updatedAt).toLocaleDateString() : 'Recent'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Company / Plant:</span>
                <strong className="text-white">{trackedRecord.companyName}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Consulting Domain:</span>
                <strong className="text-white">{trackedRecord.consultingTopic}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">Requested Method:</span>
                <strong className="text-white">{trackedRecord.preferredMethod}</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                Engineering Team Feedback & Next Steps
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {trackedRecord.adminNotes || 'Your request is in our queue and will be reviewed by our principal ironmaking team shortly.'}
              </p>
            </div>
          </div>
        )}

        {/* Success Confirmation Card */}
        {submittedRefId ? (
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-5 max-w-2xl mx-auto shadow-2xl">
            <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Consulting Request Received</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Your technical consulting inquiry has been securely stored in our industrial database. Our principal metallurgical team will review your operating parameters within 24 hours.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 inline-block font-mono">
              <span className="text-xs text-slate-400 block mb-1">Your Tracking Reference Number</span>
              <span className="text-xl sm:text-2xl font-bold text-orange-400 tracking-wider">
                {submittedRefId}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setTrackRefId(submittedRefId);
                  setSubmittedRefId(null);
                }}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Track Request Status
              </button>
              <button
                onClick={() => {
                  setSubmittedRefId(null);
                  setProblemDescription('');
                  setAttachments([]);
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* Main Consulting Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Consulting Domain Showcase */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400 border-b border-slate-800 pb-2">
                  Specialized Consulting Domains
                </h3>
                <ul className="space-y-2 text-xs">
                  {topics.map((t, idx) => (
                    <li
                      key={idx}
                      onClick={() => setConsultingTopic(t)}
                      className={`p-2.5 rounded-lg cursor-pointer transition-colors border ${
                        consultingTopic === t
                          ? 'bg-orange-950/40 border-orange-500/60 text-white font-medium'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                        <span className="line-clamp-2">{t}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-orange-400">
                  Engagement Deliverables
                </h4>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Complete thermochemical mass & heat balance simulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Chute distribution angle matrix tuned for radar profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Sinter & pellet chemistry optimization for low RDI (&lt;28%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Formal technical action report with quantified fuel savings</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Technical Request Form */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">
                  Technical Assistance Request Form
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  All technical plant parameters and attachments are handled with strict industrial confidentiality.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-lg text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submitter Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Iyer"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Company / Organization <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Jindal Steel / SAIL / ArcelorMittal"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Designation / Department <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Head of Blast Furnace Operations"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Official Email Address <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Mobile / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Plant Location / Region
                    </label>
                    <input
                      type="text"
                      value={plantLocation}
                      onChange={(e) => setPlantLocation(e.target.value)}
                      placeholder="e.g. Angul, Odisha / Jubail, Saudi Arabia"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Plant Type & Topic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Plant Configuration / Type <span className="text-orange-400">*</span>
                    </label>
                    <select
                      value={plantType}
                      onChange={(e) => setPlantType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {plantTypes.map((pt, i) => (
                        <option key={i} value={pt}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Consulting Topic <span className="text-orange-400">*</span>
                    </label>
                    <select
                      value={consultingTopic}
                      onChange={(e) => setConsultingTopic(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {topics.map((t, i) => (
                        <option key={i} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Problem Description */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Description of Problem / Irregularity <span className="text-orange-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe specific symptoms: hanging, slipping, high heat load, throat temperature fluctuations, high fuel rate, poor sinter RDI, slag viscosity issues, etc."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Operating Parameters & Expected Improvement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Current Operating Parameters
                    </label>
                    <textarea
                      rows={3}
                      value={currentOperatingParameters}
                      onChange={(e) => setCurrentOperatingParameters(e.target.value)}
                      placeholder="e.g. Volume: 2000m³, Coke Rate: 390 kg/tHM, PCI: 140 kg/tHM, Blast Temp: 1150°C, O2: +3%, Top Pressure: 1.8 bar"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Expected Improvement / KPI Target
                    </label>
                    <textarea
                      rows={3}
                      value={expectedImprovement}
                      onChange={(e) => setExpectedImprovement(e.target.value)}
                      placeholder="e.g. Reduce fuel rate by 15 kg/tHM, eliminate hanging, stabilize lower stack stave temperatures, achieve sinter RDI < 26%"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Preferred Consultation Method */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Preferred Consultation Method <span className="text-orange-400">*</span>
                  </label>
                  <select
                    value={preferredMethod}
                    onChange={(e) => setPreferredMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    {methods.map((m, i) => (
                      <option key={i} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Attachment Upload */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Upload Operating Logs, Radar Traces, Lab Reports (Excel, PDF, Word, Images - Max 15MB each)
                  </label>
                  <div className="border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-lg p-4 bg-slate-950/60 text-center">
                    <input
                      type="file"
                      id="consulting-file-upload"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.xlsx,.xls,.docx,.doc,.png,.jpg,.jpeg,.csv"
                    />
                    <label
                      htmlFor="consulting-file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="w-6 h-6 text-orange-400" />
                      <span className="text-xs text-slate-300 font-medium">
                        Click to select operational files or drag & drop here
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Supports PDF, Excel (.xlsx/.xls), Word (.docx), CSV, PNG, JPG (Up to 5 files)
                      </span>
                    </label>
                  </div>

                  {fileError && (
                    <p className="text-xs text-red-400 mt-1">{fileError}</p>
                  )}

                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[11px] text-slate-400 font-medium">Selected Files:</span>
                      {attachments.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-orange-400 shrink-0" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(i)}
                            className="p-1 text-slate-400 hover:text-red-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Technical Request...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Consultation Request to Metallurgical Committee</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
