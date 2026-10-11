import React, { useState } from 'react';
import { User, CCTVDevice, Invoice, WarrantyRecord, NotificationItem, AppSettings } from '../../types';
import { api } from '../../lib/api';
import {
  User as UserIcon,
  Video,
  FileCheck,
  ShieldCheck,
  Bell,
  LogOut,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Camera,
  MapPin,
  Phone,
  Mail,
  Lock,
  ChevronRight,
  Sparkles,
  Wifi,
  Radio,
  Clock,
  Shield,
  FileText,
  Check,
} from 'lucide-react';
import { PDFModal } from '../PDFModal';

interface CustomerAccountProps {
  user: User;
  cctvDevices: CCTVDevice[];
  invoices: Invoice[];
  warranties: WarrantyRecord[];
  notifications: NotificationItem[];
  settings: AppSettings;
  onRefresh: () => void;
  onLogout: () => void;
  onSwitchRole: (role: string, email: string) => void;
}

export const CustomerAccount: React.FC<CustomerAccountProps> = ({
  user,
  cctvDevices,
  invoices,
  warranties,
  notifications,
  settings,
  onRefresh,
  onLogout,
  onSwitchRole,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'profile' | 'cctv' | 'invoices' | 'warranties' | 'notifications'>('overview');
  const [editFormData, setEditFormData] = useState({
    fullName: user.fullName,
    phone: user.phone,
    address: user.address,
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // CCTV Ping State
  const [pingingDeviceId, setPingingDeviceId] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<Record<string, { success: boolean; latencyMs: number; timestamp: string }>>({});

  // PDF Preview
  const [selectedInvoiceForPDF, setSelectedInvoiceForPDF] = useState<Invoice | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(null);
    try {
      await api.updateProfile(editFormData);
      setProfileSuccessMsg('Profile details successfully updated.');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePingDevice = async (deviceId: string) => {
    setPingingDeviceId(deviceId);
    try {
      const res = await api.pingCctvDevice(deviceId);
      setPingResults((prev) => ({
        ...prev,
        [deviceId]: {
          success: res.ping.success,
          latencyMs: res.ping.latencyMs,
          timestamp: res.ping.timestamp,
        },
      }));
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Device ping test failed');
    } finally {
      setPingingDeviceId(null);
    }
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      onRefresh();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 pb-16" id="customer-account-view">
      {/* Profile Card Header with Generous Padding */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-3xl shadow-lg border-2 border-white/20">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                user.fullName.charAt(0)
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg bg-emerald-500 text-white border-2 border-slate-900 text-xs font-bold shadow-xs">
              ACTIVE SLA
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold">{user.fullName}</h2>
            <p className="text-sm text-sky-200">{user.email}</p>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>{user.address}</span>
            </p>
            <p className="text-xs text-emerald-400 font-semibold pt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              24/7 Security Operations Center Monitoring Connected
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center">
          <button
            onClick={() => setActiveSection('profile')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs sm:text-sm no-scrollbar bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {[
          { id: 'overview', label: 'Overview & Health' },
          { id: 'cctv', label: `My CCTV Fleet (${cctvDevices.length})` },
          { id: 'invoices', label: `Invoices (${invoices.length})` },
          { id: 'warranties', label: `Warranties (${warranties.length})` },
          { id: 'notifications', label: `Alerts (${notifications.length})` },
          { id: 'profile', label: 'Settings & Demo' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              activeSection === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Surveillance Fleet</span>
              <span className="text-3xl font-black text-slate-900 block">{cctvDevices.length}</span>
              <span className="text-xs text-emerald-600 font-semibold block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All Cameras Online
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Billing Statements</span>
              <span className="text-3xl font-black text-slate-900 block">{invoices.length}</span>
              <span className="text-xs text-sky-600 font-semibold block flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Invoices on File
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hardware Warranty</span>
              <span className="text-3xl font-black text-slate-900 block">
                {warranties.filter((w) => w.status === 'Active').length}
              </span>
              <span className="text-xs text-purple-600 font-semibold block flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Active Guarantees
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Security Tier</span>
              <span className="text-3xl font-black text-slate-900 block">Tier 1</span>
              <span className="text-xs text-emerald-600 font-semibold block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Protected 24/7
              </span>
            </div>
          </div>

          {/* Quick CCTV Live Status Preview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-sky-600" />
                  Live Camera Fleet Connectivity Health
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time RTSP stream heartbeat and secure gateway diagnostics.
                </p>
              </div>
              <button
                onClick={() => setActiveSection('cctv')}
                className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 transition flex items-center gap-1"
              >
                Inspect All Devices <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {cctvDevices.map((dev) => (
                <div key={dev.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-slate-900">{dev.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">
                      IP: {dev.ipAddress} &bull; Model: {dev.model}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        dev.status === 'Online'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dev.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {dev.status}
                    </span>
                    <button
                      onClick={() => handlePingDevice(dev.id)}
                      disabled={pingingDeviceId === dev.id}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                      title="Run handshake ping"
                    >
                      <RefreshCw className={`w-4 h-4 ${pingingDeviceId === dev.id ? 'animate-spin text-sky-600' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CCTV Device Fleet Section */}
      {activeSection === 'cctv' && (
        <div className="space-y-6">
          <div className="bg-sky-50 p-5 rounded-2xl border border-sky-200 text-xs sm:text-sm text-sky-950 flex items-start gap-3.5">
            <Activity className="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-sky-900">Live Hardware Handshake & Security Gateway Health</p>
              <p className="text-sky-800 leading-relaxed font-normal">
                Every camera is monitored over an encrypted internal VLAN. Click "Run Diagnostics" to verify real latency, packet loss, and stream continuity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cctvDevices.map((dev) => {
              const ping = pingResults[dev.id];

              return (
                <div
                  key={dev.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {dev.channelName || 'IP Surveillance Channel'}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 mt-0.5 leading-snug">{dev.name}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{dev.model} (SN: {dev.serialNumber})</p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        dev.status === 'Online'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dev.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {dev.status}
                    </span>
                  </div>

                  {/* Network Technical Parameters */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 font-mono text-slate-700">
                    <p><span className="text-slate-400 font-sans">Internal IP:</span> {dev.ipAddress}</p>
                    <p><span className="text-slate-400 font-sans">RTSP Stream:</span> {dev.rtspUrl}</p>
                    <p><span className="text-slate-400 font-sans">ONVIF Port:</span> {dev.port} / 443 (SSL TLS 1.3)</p>
                    <p><span className="text-slate-400 font-sans">Firmware:</span> {dev.firmwareVersion || 'v5.7.12-build2025'}</p>
                  </div>

                  {/* Ping Result Display */}
                  {ping && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-center justify-between font-medium">
                      <span>Gateway Diagnostic Response:</span>
                      <span className="font-mono font-bold text-emerald-800">{ping.latencyMs} ms &bull; OK</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">
                      Last Check: {new Date(dev.lastPing || Date.now()).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => handlePingDevice(dev.id)}
                      disabled={pingingDeviceId === dev.id}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${pingingDeviceId === dev.id ? 'animate-spin' : ''}`} />
                      {pingingDeviceId === dev.id ? 'Pinging Gateway...' : 'Run Diagnostics'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invoices Section */}
      {activeSection === 'invoices' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      Issued on {new Date(inv.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-lg text-slate-900 mt-1">
                    Tax Invoice &bull; ${(inv.total).toFixed(2)}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Payment Due: {new Date(inv.dueDate).toLocaleDateString()} &bull; Total Line Items: {inv.items.length}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                      inv.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {inv.paymentStatus}
                  </span>

                  <button
                    onClick={() => setSelectedInvoiceForPDF(inv)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    View / Print Invoice
                  </button>
                </div>
              </div>
            ))}

            {invoices.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
                No invoices recorded for this account.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warranties Section */}
      {activeSection === 'warranties' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {warranties.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      DIGI Hub Certified Guarantee
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{w.productName}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">SN: {w.serialNumber}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      w.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {w.status}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm space-y-1.5 leading-relaxed">
                  <p className="text-slate-700">
                    <strong className="text-slate-900 font-bold">Valid Through:</strong>{' '}
                    {new Date(w.warrantyEnd).toLocaleDateString()}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900 font-bold">Coverage Terms:</strong> {w.terms}
                  </p>
                </div>
              </div>
            ))}

            {warranties.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm col-span-2">
                No hardware warranty cards registered yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkNotifRead(notif.id)}
              className={`p-5 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                notif.read ? 'bg-white border-slate-200' : 'bg-sky-50/70 border-sky-200 shadow-xs'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl text-white flex-shrink-0 ${
                  notif.type === 'SUCCESS'
                    ? 'bg-emerald-500'
                    : notif.type === 'ALERT'
                    ? 'bg-rose-500'
                    : 'bg-sky-500'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{notif.title}</h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
              No notifications at this time.
            </div>
          )}
        </div>
      )}

      {/* Edit Profile & Role Switcher */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 max-w-2xl">
          <div className="space-y-1">
            <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900">Personal & Premises Profile</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your dispatch address and emergency technical contact info.
            </p>
          </div>

          {profileSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={editFormData.fullName}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Contact Phone</label>
              <input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Premises Address</label>
              <input
                type="text"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Role Switcher Demo */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Quick Switch Role for Demo Exploration:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onSwitchRole('CUSTOMER', 'david.chen@gmail.com')}
                className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs sm:text-sm font-bold hover:bg-sky-100 transition text-center cursor-pointer"
              >
                Customer (David)
              </button>
              <button
                type="button"
                onClick={() => onSwitchRole('TECHNICIAN', 'tech.alex@digihub.com')}
                className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold hover:bg-emerald-100 transition text-center cursor-pointer"
              >
                Technician (Alex)
              </button>
              <button
                type="button"
                onClick={() => onSwitchRole('ADMIN', 'admin@digihub.com')}
                className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs sm:text-sm font-bold hover:bg-purple-100 transition text-center cursor-pointer"
              >
                Admin (David Sterling)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable PDF Modal */}
      {selectedInvoiceForPDF && (
        <PDFModal
          type="invoice"
          data={selectedInvoiceForPDF}
          settings={settings}
          onClose={() => setSelectedInvoiceForPDF(null)}
        />
      )}
    </div>
  );
};
