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
    <div className="space-y-6 pb-12" id="customer-account-view">
      {/* Profile Card Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                user.fullName.charAt(0)
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-emerald-500 text-white border-2 border-slate-900 text-[10px] font-bold">
              PRO
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-xs text-sky-200 mt-0.5">{user.email}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {user.address}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveSection('profile')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition"
          >
            Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Security' },
          { id: 'cctv', label: `My CCTV Devices (${cctvDevices.length})` },
          { id: 'invoices', label: `Invoices (${invoices.length})` },
          { id: 'warranties', label: `Warranties (${warranties.length})` },
          { id: 'notifications', label: `Alerts (${notifications.length})` },
          { id: 'profile', label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
              activeSection === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Surveillance</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{cctvDevices.length}</span>
              <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">Active Cameras</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Invoices</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{invoices.length}</span>
              <span className="text-xs text-sky-600 font-semibold mt-0.5 block">Statements on File</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Warranty</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {warranties.filter((w) => w.status === 'Active').length}
              </span>
              <span className="text-xs text-purple-600 font-semibold mt-0.5 block">Guarantees Active</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Level</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">Tier 1</span>
              <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">Protected 24/7</span>
            </div>
          </div>

          {/* Quick CCTV Live Status Preview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-sky-600" />
                Live Camera Connectivity Health
              </h3>
              <button
                onClick={() => setActiveSection('cctv')}
                className="text-xs font-semibold text-sky-600 hover:underline"
              >
                Inspect All Devices
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {cctvDevices.map((dev) => (
                <div key={dev.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{dev.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      IP: {dev.ipAddress} &bull; {dev.model}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        dev.status === 'Online'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dev.status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {dev.status}
                    </span>
                    <button
                      onClick={() => handlePingDevice(dev.id)}
                      disabled={pingingDeviceId === dev.id}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      title="Run handshake ping"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${pingingDeviceId === dev.id ? 'animate-spin text-sky-600' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CCTV Device Management Section */}
      {activeSection === 'cctv' && (
        <div className="space-y-4">
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 text-xs text-sky-900 flex items-start gap-3">
            <Activity className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Real CCTV Handshake & Health Monitor</p>
              <p className="text-sky-800 mt-0.5">
                Every camera stream connects through DIGI Hub's low-latency security gateway. Click "Run Diagnostics" to verify real latency and stream status.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cctvDevices.map((dev) => {
              const ping = pingResults[dev.id];

              return (
                <div
                  key={dev.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {dev.channelName || 'IP Camera'}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{dev.name}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{dev.model} (SN: {dev.serialNumber})</p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
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
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 font-mono text-slate-600">
                    <p><span className="text-slate-400 font-sans">Internal IP:</span> {dev.ipAddress}</p>
                    <p><span className="text-slate-400 font-sans">RTSP Stream:</span> {dev.rtspUrl}</p>
                    <p><span className="text-slate-400 font-sans">ONVIF / Web Port:</span> {dev.port} / 443 (SSL Encrypted)</p>
                    <p><span className="text-slate-400 font-sans">Firmware:</span> {dev.firmwareVersion || 'v5.7.12-build2025'}</p>
                  </div>

                  {/* Ping Result Display */}
                  {ping && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                      <span className="font-semibold">Gateway Ping Handshake:</span>
                      <span className="font-mono font-bold">{ping.latencyMs} ms &bull; OK</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">
                      Last Check: {new Date(dev.lastPing || Date.now()).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => handlePingDevice(dev.id)}
                      disabled={pingingDeviceId === dev.id}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${pingingDeviceId === dev.id ? 'animate-spin' : ''}`} />
                      {pingingDeviceId === dev.id ? 'Testing...' : 'Run Diagnostics'}
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      Issued: {new Date(inv.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 mt-1">
                    Tax Invoice &bull; ${(inv.total).toFixed(2)}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Due Date: {new Date(inv.dueDate).toLocaleDateString()} &bull; Items: {inv.items.length}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inv.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {inv.paymentStatus}
                  </span>

                  <button
                    onClick={() => setSelectedInvoiceForPDF(inv)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View / Print Invoice
                  </button>
                </div>
              </div>
            ))}

            {invoices.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No invoices recorded for this account.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warranties Section */}
      {activeSection === 'warranties' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {warranties.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      DIGI Hub Certified Guarantee
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5">{w.productName}</h3>
                    <p className="text-xs text-slate-500 font-mono">SN: {w.serialNumber}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      w.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {w.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-700">Valid Through:</span>{' '}
                    {new Date(w.warrantyEnd).toLocaleDateString()}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-700">Coverage Terms:</span> {w.terms}
                  </p>
                </div>
              </div>
            ))}

            {warranties.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs col-span-2">
                No hardware warranty cards registered yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkNotifRead(notif.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                notif.read ? 'bg-white border-slate-200' : 'bg-sky-50/70 border-sky-200'
              }`}
            >
              <div
                className={`p-2 rounded-xl text-white flex-shrink-0 ${
                  notif.type === 'SUCCESS'
                    ? 'bg-emerald-500'
                    : notif.type === 'ALERT'
                    ? 'bg-rose-500'
                    : 'bg-sky-500'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
                  <span className="text-[11px] text-slate-400">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No notifications at this time.
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Form */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 max-w-xl">
          <h3 className="font-bold text-lg text-slate-900">Personal & Premises Profile</h3>

          {profileSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editFormData.fullName}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Premises Address</label>
              <input
                type="text"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition disabled:opacity-50"
            >
              {isSavingProfile ? 'Saving...' : 'Update Profile'}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Switch Active User Role for Demo:
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSwitchRole('CUSTOMER', 'david.chen@gmail.com')}
                className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold hover:bg-sky-100 transition text-center"
              >
                Customer (David)
              </button>
              <button
                type="button"
                onClick={() => onSwitchRole('TECHNICIAN', 'tech.alex@digihub.com')}
                className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition text-center"
              >
                Technician (Alex)
              </button>
              <button
                type="button"
                onClick={() => onSwitchRole('ADMIN', 'admin@digihub.com')}
                className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold hover:bg-purple-100 transition text-center"
              >
                Admin (Sterling)
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
