import React, { useState } from 'react';
import { User, ServiceRequest, AppSettings } from '../../types';
import { api } from '../../lib/api';
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Truck,
  Play,
  Check,
  Camera,
  X,
  AlertCircle,
  Plus,
  FileText,
  Shield,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { DigiHubLogo } from '../DigiHubLogo';

interface TechnicianDashboardProps {
  user: User;
  settings: AppSettings;
  onRefresh: () => void;
  onLogout: () => void;
  onSwitchRole: (role: string, email: string) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  user,
  settings,
  onRefresh,
  onLogout,
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed' | 'all'>('today');
  const [jobsData, setJobsData] = useState<{
    allJobs: ServiceRequest[];
    todayJobs: ServiceRequest[];
    upcomingJobs: ServiceRequest[];
    completedJobs: ServiceRequest[];
    pendingJobs: ServiceRequest[];
  }>({
    allJobs: [],
    todayJobs: [],
    upcomingJobs: [],
    completedJobs: [],
    pendingJobs: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeJobModal, setActiveJobModal] = useState<ServiceRequest | null>(null);

  // Job execution form state
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [partsInput, setPartsInput] = useState('');
  const [partsList, setPartsList] = useState<string[]>([]);
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getTechnicianJobs();
      setJobsData(res);
    } catch (err) {
      console.error('Failed to load technician jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const openJobDetails = (job: ServiceRequest) => {
    setActiveJobModal(job);
    setTechnicianNotes(job.technicianNotes || '');
    setPartsList(job.partsUsed || []);
    setBeforePhotos(job.beforePhotos || []);
    setAfterPhotos(job.afterPhotos || []);
  };

  const handleStatusTransition = async (newStatus: any) => {
    if (!activeJobModal) return;
    setIsSubmittingUpdate(true);
    try {
      await api.updateServiceTicketStatus(activeJobModal.id, {
        status: newStatus,
        technicianNotes,
        partsUsed: partsList,
        beforePhotos,
        afterPhotos,
      });
      await fetchJobs();
      onRefresh();
      // Update local modal
      setActiveJobModal((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err: any) {
      alert(err.message || 'Failed to update job status');
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  const handleAddPart = () => {
    if (!partsInput.trim()) return;
    setPartsList((prev) => [...prev, partsInput.trim()]);
    setPartsInput('');
  };

  const handleRemovePart = (idx: number) => {
    setPartsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isBefore: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await api.uploadFile(base64, isBefore ? 'tech_before.jpg' : 'tech_after.jpg');
          if (isBefore) {
            setBeforePhotos((prev) => [...prev, res.url]);
          } else {
            setAfterPhotos((prev) => [...prev, res.url]);
          }
        } catch {
          if (isBefore) {
            setBeforePhotos((prev) => [...prev, base64]);
          } else {
            setAfterPhotos((prev) => [...prev, base64]);
          }
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const currentList =
    activeTab === 'today'
      ? jobsData.todayJobs
      : activeTab === 'upcoming'
      ? jobsData.upcomingJobs
      : activeTab === 'completed'
      ? jobsData.completedJobs
      : jobsData.allJobs;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans selection:bg-emerald-500 selection:text-white" id="technician-portal">
      {/* Top Bar */}
      <header className="bg-slate-900/90 backdrop-blur-xl text-white sticky top-0 z-30 border-b border-slate-800 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DigiHubLogo variant="white" size="sm" />
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Field Ops Hub
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user.fullName}</p>
              <p className="text-[11px] text-slate-400 font-mono">Mobile Van: DH-VAN-04</p>
            </div>

            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700/60"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Tech KPI Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-emerald-900/50 border border-emerald-400/30">
                {user.fullName.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user.fullName}</h1>
                <span className="text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 uppercase shadow-sm">
                  ACTIVE ON DUTY
                </span>
              </div>
              <p className="text-xs text-emerald-300 font-medium mt-1">
                Certified CCTV & Optical Cabling Field Engineer
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Depot: Central Hub &bull; Vehicle: Unit #04 (Hikvision 4K & PoE Switches Stocked)
              </p>
            </div>
          </div>

          {/* Role Switcher Shortcuts */}
          <div className="flex gap-2 relative z-10">
            <button
              onClick={() => onSwitchRole('CUSTOMER', 'david.chen@gmail.com')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
            >
              Customer View
            </button>
            <button
              onClick={() => onSwitchRole('ADMIN', 'admin@digihub.com')}
              className="px-3.5 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/40 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all shadow-sm"
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto text-xs font-bold no-scrollbar">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'today'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30 glow-emerald-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
            }`}
          >
            Today's Dispatch
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
              {jobsData.todayJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30 glow-emerald-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
            }`}
          >
            Upcoming Scheduled
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
              {jobsData.upcomingJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30 glow-emerald-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
            }`}
          >
            Completed Jobs
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
              {jobsData.completedJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30 glow-emerald-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
            }`}
          >
            All Assigned
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
              {jobsData.allJobs.length}
            </span>
          </button>
        </div>

        {/* Jobs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map((job) => (
            <div
              key={job.id}
              onClick={() => openJobDetails(job)}
              className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-5 shadow-lg hover:shadow-2xl hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between group backdrop-blur-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                    {job.requestNumber}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold ${
                      job.status === 'Completed'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : job.status === 'In Progress'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                        : job.status === 'Technician On The Way'
                        ? 'bg-sky-950/80 text-sky-400 border border-sky-800 animate-pulse'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-emerald-400 transition-colors">
                    {job.serviceType}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                    {job.problemDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="font-medium text-slate-200">{job.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span className="font-mono">Client: {job.customerPhone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>Schedule: {job.scheduledDate || 'Immediate Dispatch'} &bull; {job.scheduledTime || 'Morning Window'}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Open Job Sheet &rarr;
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Updated: {new Date(job.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {currentList.length === 0 && (
            <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs col-span-2">
              No service dispatches currently found in this filter view.
            </div>
          )}
        </div>
      </main>

      {/* Technician Job Sheet Execution Modal */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white relative">
              <button
                onClick={() => setActiveJobModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Wrench className="w-4 h-4" />
                Live Work Order &bull; {activeJobModal.requestNumber}
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{activeJobModal.serviceType}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/30">
                  Current Status: {activeJobModal.status}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Client Info & Direct Contact */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="font-bold text-sm text-slate-900">{activeJobModal.customerPhone} (Customer Phone)</p>
                  <p className="text-slate-600 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {activeJobModal.location}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${activeJobModal.customerPhone}`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 shadow-sm transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Client
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(activeJobModal.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate
                  </a>
                </div>
              </div>

              {/* Reported Problem */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Reported Problem / Customer Scope
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium leading-relaxed">
                  {activeJobModal.problemDescription}
                </div>
              </div>

              {/* Status Action Pipeline Buttons */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Update Service Status (Customer Receives Real-time Notification)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    disabled={isSubmittingUpdate}
                    onClick={() => handleStatusTransition('Technician On The Way')}
                    className={`p-2.5 rounded-xl font-bold border transition flex flex-col items-center justify-center gap-1 ${
                      activeJobModal.status === 'Technician On The Way'
                        ? 'bg-sky-600 text-white border-sky-600 shadow'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>On The Way</span>
                  </button>

                  <button
                    disabled={isSubmittingUpdate}
                    onClick={() => handleStatusTransition('In Progress')}
                    className={`p-2.5 rounded-xl font-bold border transition flex flex-col items-center justify-center gap-1 ${
                      activeJobModal.status === 'In Progress'
                        ? 'bg-amber-600 text-white border-amber-600 shadow'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>In Progress</span>
                  </button>

                  <button
                    disabled={isSubmittingUpdate}
                    onClick={() => handleStatusTransition('Completed')}
                    className={`p-2.5 rounded-xl font-bold border transition flex flex-col items-center justify-center gap-1 ${
                      activeJobModal.status === 'Completed'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Completed</span>
                  </button>

                  <button
                    disabled={isSubmittingUpdate}
                    onClick={() => handleStatusTransition('Scheduled')}
                    className="p-2.5 rounded-xl font-bold border bg-white text-slate-700 hover:bg-slate-50 border-slate-200 flex flex-col items-center justify-center gap-1"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Reschedule</span>
                  </button>
                </div>
              </div>

              {/* Installed Parts & Materials Used */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Parts & Equipment Installed
                </h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={partsInput}
                    onChange={(e) => setPartsInput(e.target.value)}
                    placeholder="e.g. 1x 12V 5A Power Supply, 45m Cat6 Outdoor..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Part
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {partsList.map((part, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium flex items-center gap-1.5 border border-slate-200"
                    >
                      {part}
                      <button
                        type="button"
                        onClick={() => handleRemovePart(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {partsList.length === 0 && (
                    <span className="text-slate-400 italic">No spare parts recorded yet.</span>
                  )}
                </div>
              </div>

              {/* Before & After Photos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Before Photos (Fault Evidence)
                  </h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    {beforePhotos.map((url, i) => (
                      <img key={i} src={url} alt="Before" className="w-16 h-16 rounded-xl object-cover border" />
                    ))}
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer bg-slate-50">
                      <Camera className="w-4 h-4 text-slate-400" />
                      <span className="text-[9px] text-slate-500 mt-0.5">Add Before</span>
                      <input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                    After Photos (Work Completed)
                  </h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    {afterPhotos.map((url, i) => (
                      <img key={i} src={url} alt="After" className="w-16 h-16 rounded-xl object-cover border" />
                    ))}
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer bg-slate-50">
                      <Camera className="w-4 h-4 text-slate-400" />
                      <span className="text-[9px] text-slate-500 mt-0.5">Add After</span>
                      <input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e, false)} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Technician Notes */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Field Engineering Completion Report
                </h4>
                <textarea
                  rows={3}
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  placeholder="e.g. Cleared water ingress from junction box, re-terminated Cat6 connector, aligned camera optical angle. Ping tested 14ms latency."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Save changes without changing status */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveJobModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close Sheet
                </button>
                <button
                  type="button"
                  disabled={isSubmittingUpdate}
                  onClick={() => handleStatusTransition(activeJobModal.status)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow"
                >
                  Save Progress & Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
