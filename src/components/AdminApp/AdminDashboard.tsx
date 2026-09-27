import React, { useState, useEffect } from 'react';
import {
  User,
  ServiceItem,
  Product,
  QuotationRequest,
  Quotation,
  ServiceRequest,
  Invoice,
  WarrantyRecord,
  CCTVDevice,
  AuditLogItem,
  AppSettings,
} from '../../types';
import { api } from '../../lib/api';
import {
  LayoutDashboard,
  Users,
  Layers,
  Package,
  FileText,
  Wrench,
  Truck,
  CreditCard,
  ShieldCheck,
  Video,
  ClipboardList,
  Settings as SettingsIcon,
  Bell,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  DollarSign,
  Send,
  Eye,
  LogOut,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { DigiHubLogo } from '../DigiHubLogo';
import { PDFModal } from '../PDFModal';

interface AdminDashboardProps {
  user: User;
  services: ServiceItem[];
  products: Product[];
  quotationRequests: QuotationRequest[];
  quotations: Quotation[];
  serviceRequests: ServiceRequest[];
  invoices: Invoice[];
  warranties: WarrantyRecord[];
  cctvDevices: CCTVDevice[];
  settings: AppSettings;
  onRefresh: () => void;
  onLogout: () => void;
  onSwitchRole: (role: string, email: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  services,
  products,
  quotationRequests,
  quotations,
  serviceRequests,
  invoices,
  warranties,
  cctvDevices,
  settings,
  onRefresh,
  onLogout,
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'customers'
    | 'quotations'
    | 'serviceRequests'
    | 'products'
    | 'services'
    | 'technicians'
    | 'invoices'
    | 'warranties'
    | 'cctv'
    | 'audit'
    | 'settings'
  >('overview');

  // Admin Customers
  const [customers, setCustomers] = useState<User[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // PDF Preview
  const [selectedPDFDoc, setSelectedPDFDoc] = useState<{ type: 'quotation' | 'invoice'; data: any } | null>(null);

  // Modals
  const [isQuotationBuilderOpen, setIsQuotationBuilderOpen] = useState(false);
  const [selectedRequestForQuote, setSelectedRequestForQuote] = useState<QuotationRequest | null>(null);

  // Assign Tech Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedServiceRequestForAssign, setSelectedServiceRequestForAssign] = useState<ServiceRequest | null>(null);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [assignDate, setAssignDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignTime, setAssignTime] = useState('Morning (9:00 AM - 12:00 PM)');

  // Product Editor Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Broadcast Modal
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ title: '', message: '', type: 'INFO' });

  // Settings Editor
  const [appSettingsState, setAppSettingsState] = useState<AppSettings>(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const loadAdminData = async () => {
    try {
      const [custRes, techRes, auditRes, statsRes] = await Promise.all([
        api.getAdminCustomers(),
        api.getTechnicians(),
        api.getAuditLogs(),
        api.getDashboardStats(),
      ]);
      setCustomers(custRes.customers);
      setTechnicians(techRes.technicians);
      setAuditLogs(auditRes.logs);
      setDashboardStats(statsRes);
    } catch (err) {
      console.error('Failed to load admin datasets', err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Customer status toggle
  const handleToggleCustomer = async (id: string) => {
    try {
      await api.toggleCustomerActive(id);
      loadAdminData();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle customer status');
    }
  };

  // Prepare Quotation Form State
  const [quoteItems, setQuoteItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([
    { description: 'Hikvision 4K AcuSense Dome Camera DS-2CD2186G2-ISU', quantity: 4, unitPrice: 175.0 },
    { description: 'Hikvision 8-Channel 4K NVR DS-7608NXI-I2/8P', quantity: 1, unitPrice: 380.0 },
    { description: 'Western Digital 4TB Purple Surveillance Hard Drive', quantity: 1, unitPrice: 110.0 },
    { description: 'Cat6 Shielded Outdoor Cable & Conduit Pathway (150m)', quantity: 1, unitPrice: 195.0 },
    { description: 'Certified Installation, Commissioning & Mobile App Setup', quantity: 1, unitPrice: 320.0 },
  ]);
  const [quoteDiscount, setQuoteDiscount] = useState(50);
  const [quoteValidityDays, setQuoteValidityDays] = useState(30);
  const [quoteNotes, setQuoteNotes] = useState('Includes 24 months DIGI Hub on-site hardware replacement warranty.');

  const handleOpenQuotationBuilder = (req: QuotationRequest) => {
    setSelectedRequestForQuote(req);
    setIsQuotationBuilderOpen(true);
  };

  const handleCreateFormalQuotation = async () => {
    if (!selectedRequestForQuote) return;
    try {
      const validityDate = new Date(Date.now() + quoteValidityDays * 86400000).toISOString();
      await api.createQuotation({
        requestId: selectedRequestForQuote.id,
        customerId: selectedRequestForQuote.customerId,
        customerName: selectedRequestForQuote.customerName,
        customerEmail: selectedRequestForQuote.email,
        customerPhone: selectedRequestForQuote.phone,
        customerAddress: selectedRequestForQuote.location,
        items: quoteItems,
        discount: quoteDiscount,
        validityDate,
        notes: quoteNotes,
      });

      setIsQuotationBuilderOpen(false);
      onRefresh();
      loadAdminData();
      alert('Official Quotation prepared and dispatched to customer portal.');
    } catch (err: any) {
      alert(err.message || 'Failed to prepare quotation');
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedServiceRequestForAssign || !selectedTechId) return;
    try {
      await api.assignTechnician(selectedServiceRequestForAssign.id, {
        technicianId: selectedTechId,
        scheduledDate: assignDate,
        scheduledTime: assignTime,
      });
      setIsAssignModalOpen(false);
      onRefresh();
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to assign technician');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await api.updateSettings(appSettingsState);
      setAppSettingsState(res.settings);
      onRefresh();
      alert('DIGI Hub company settings and contact info successfully updated.');
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.broadcastNotification(broadcastData);
      setIsBroadcastModalOpen(false);
      setBroadcastData({ title: '', message: '', type: 'INFO' });
      onRefresh();
      alert('Broadcast notification sent to all active customer accounts.');
    } catch (err: any) {
      alert(err.message || 'Failed to broadcast notification');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      onRefresh();
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const totalRevenue = invoices
    .filter((inv) => inv.paymentStatus === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white" id="admin-web-dashboard">
      {/* Admin Top Header */}
      <header className="bg-slate-900/90 backdrop-blur-xl text-white sticky top-0 z-30 shadow-xl border-b border-slate-800">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DigiHubLogo variant="white" size="sm" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> Command Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-bold transition shadow-md shadow-sky-600/20"
            >
              <Bell className="w-3.5 h-3.5" /> Broadcast Alert
            </button>

            {/* Quick Demo Role Switcher */}
            <div className="hidden md:flex gap-1.5 text-xs">
              <button
                onClick={() => onSwitchRole('CUSTOMER', 'david.chen@gmail.com')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold border border-slate-700/60 transition"
              >
                Customer Portal
              </button>
              <button
                onClick={() => onSwitchRole('TECHNICIAN', 'tech.alex@digihub.com')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold border border-slate-700/60 transition"
              >
                Technician Hub
              </button>
            </div>

            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-700/60 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Split: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 space-y-1.5 flex-shrink-0 backdrop-blur-md">
          <div className="p-3.5 mb-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-800/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-purple-900/40">
              {user.fullName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-xs text-white truncate">{user.fullName}</p>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Super Administrator</p>
            </div>
          </div>

          {[
            { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
            { id: 'quotations', label: `Quotations (${quotationRequests.length})`, icon: FileText },
            { id: 'serviceRequests', label: `Service Tickets (${serviceRequests.length})`, icon: Wrench },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'technicians', label: `Technicians (${technicians.length})`, icon: Truck },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'services', label: `Services (${services.length})`, icon: Layers },
            { id: 'invoices', label: `Invoices (${invoices.length})`, icon: CreditCard },
            { id: 'warranties', label: `Warranties (${warranties.length})`, icon: ShieldCheck },
            { id: 'cctv', label: `CCTV Matrix (${cctvDevices.length})`, icon: Video },
            { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: ClipboardList },
            { id: 'settings', label: 'System Settings', icon: SettingsIcon },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 glow-purple-sm'
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Executive Operations Center</h1>
                <p className="text-xs text-slate-400 mt-1">
                  High-level performance metrics, dispatch pipelines, and financial telemetry for DIGI Hub.
                </p>
              </div>

              {/* 4 Premium Metric KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 blur-xl rounded-full group-hover:bg-sky-500/20 transition-all" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Customers</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-black text-white">{customers.length || 3}</span>
                    <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold mt-2 inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active System Profiles
                  </span>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-xl rounded-full group-hover:bg-amber-500/20 transition-all" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">New Quotations</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-black text-white">{quotationRequests.length}</span>
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] text-amber-400 font-bold mt-2 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending Evaluation
                  </span>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full group-hover:bg-emerald-500/20 transition-all" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Open Tickets</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-black text-white">{serviceRequests.length}</span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400">
                      <Wrench className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] text-sky-400 font-bold mt-2 inline-flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Field Dispatched
                  </span>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full group-hover:bg-emerald-500/20 transition-all" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Revenue (Paid)</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-3xl font-black text-emerald-400">${totalRevenue.toFixed(2)}</span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium mt-2 block">Invoiced Settlement</span>
                </div>
              </div>

              {/* Operational Pipelines */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Quotations Needing Formal Estimate */}
                <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-400" />
                      Quotation Requests Pipeline
                    </h3>
                    <button
                      onClick={() => setActiveTab('quotations')}
                      className="text-xs font-bold text-sky-400 hover:text-sky-300"
                    >
                      View All ({quotationRequests.length})
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800/80">
                    {quotationRequests.slice(0, 4).map((req) => (
                      <div key={req.id} className="py-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-white truncate">
                            {req.customerName} &bull; {req.serviceRequired}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {req.location} &bull; {req.numberOfCameras} cameras
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenQuotationBuilder(req)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-bold whitespace-nowrap shadow-md transition-all active:scale-95"
                        >
                          Prepare Quote
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Tickets Pending Technician Assignment */}
                <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-emerald-400" />
                      Active Dispatch Tickets
                    </h3>
                    <button
                      onClick={() => setActiveTab('serviceRequests')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      View All ({serviceRequests.length})
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800/80">
                    {serviceRequests.slice(0, 4).map((sr) => (
                      <div key={sr.id} className="py-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-emerald-400">{sr.requestNumber}</span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {sr.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-1">
                            {sr.serviceType} &bull; {sr.location}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedServiceRequestForAssign(sr);
                            setIsAssignModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold whitespace-nowrap transition-all active:scale-95"
                        >
                          Assign Tech
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTATIONS */}
          {activeTab === 'quotations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Quotation Management</h2>
                  <p className="text-xs text-slate-500">
                    Review customer quotation requests and generate formal itemized PDFs.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Request #</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Scope</th>
                      <th className="py-3 px-4">Cameras</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotationRequests.map((req) => {
                      const quote = quotations.find((q) => q.requestId === req.id);

                      return (
                        <tr key={req.id} className="hover:bg-slate-50/60">
                          <td className="py-3.5 px-4 font-mono font-bold text-sky-700">{req.requestNumber}</td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{req.customerName}</p>
                            <p className="text-[11px] text-slate-400">{req.phone}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800">{req.serviceRequired}</p>
                            <p className="text-[11px] text-slate-500">{req.location}</p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">{req.numberOfCameras} Units</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {quote ? (
                              <button
                                onClick={() => setSelectedPDFDoc({ type: 'quotation', data: quote })}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition inline-flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> View Quote PDF
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenQuotationBuilder(req)}
                                className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition"
                              >
                                Create Quote
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICE REQUESTS */}
          {activeTab === 'serviceRequests' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Field Service Dispatch Tickets</h2>
                <p className="text-xs text-slate-500">
                  Assign certified technicians, set date & time windows, and track live status.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Ticket #</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Assigned Tech</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Dispatch Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {serviceRequests.map((sr) => (
                      <tr key={sr.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{sr.requestNumber}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{sr.serviceType}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{sr.problemDescription}</p>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{sr.location}</td>
                        <td className="py-3.5 px-4">
                          {sr.assignedTechnicianName ? (
                            <span className="font-semibold text-slate-900">{sr.assignedTechnicianName}</span>
                          ) : (
                            <span className="text-amber-600 font-medium">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {sr.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedServiceRequestForAssign(sr);
                              setIsAssignModalOpen(true);
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                          >
                            Assign / Reschedule
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Customer Management</h2>
                  <p className="text-xs text-slate-500">
                    View customer profiles, contact info, and toggle active status.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Account Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{c.fullName}</td>
                        <td className="py-3.5 px-4 text-slate-600">{c.email}</td>
                        <td className="py-3.5 px-4 text-slate-600">{c.phone}</td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{c.address}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {c.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleCustomer(c.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                              c.isActive
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {c.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Hardware & Product Inventory</h2>
                  <p className="text-xs text-slate-500">
                    Manage cameras, NVRs, switches, stock counts, and pricing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                          {p.sku}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {p.stockQuantity} in stock
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Brand: {p.brand} &bull; Category: {p.category}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-sky-700">${p.price.toFixed(2)}</span>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Engineering Services Catalogue</h2>
                <p className="text-xs text-slate-500">
                  The 10 core CCTV and networking solutions offered by DIGI Hub.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex gap-3.5">
                    <img src={s.image} alt={s.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">{s.category}</span>
                      <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{s.description}</p>
                      <p className="text-xs font-extrabold text-slate-900 mt-2">From ${s.startingPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TECHNICIANS */}
          {activeTab === 'technicians' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Field Technicians & Vehicle Units</h2>
                <p className="text-xs text-slate-500">
                  Technician status, assigned service vehicles, and mobile contact numbers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {technicians.map((t) => (
                  <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow">
                        {t.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{t.fullName}</h4>
                        <p className="text-[11px] text-emerald-700 font-semibold">Active Dispatch Engineer</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <p><span className="text-slate-400">Phone:</span> {t.phone}</p>
                      <p><span className="text-slate-400">Email:</span> {t.email}</p>
                      <p><span className="text-slate-400">Assigned Van:</span> DH-VAN-04</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: INVOICES */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Tax Invoices & Billing</h2>
                <p className="text-xs text-slate-500">
                  Official invoice records, payment statuses, and printable PDF statements.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{inv.customerName}</td>
                        <td className="py-3.5 px-4 font-black text-sky-700">${inv.total.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-slate-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.paymentStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {inv.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedPDFDoc({ type: 'invoice', data: inv })}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View Tax Invoice PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: CCTV CAMERAS */}
          {activeTab === 'cctv' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Deployed CCTV Devices</h2>
                <p className="text-xs text-slate-500">
                  Client cameras, IP gateways, RTSP streams, and live connectivity health.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cctvDevices.map((dev) => (
                  <div key={dev.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{dev.name}</h4>
                        <p className="text-xs text-slate-500">{dev.model} (SN: {dev.serialNumber})</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {dev.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono space-y-1 text-slate-600">
                      <p>IP: {dev.ipAddress}</p>
                      <p>RTSP: {dev.rtspUrl}</p>
                      <p>Port: {dev.port} / 443 SSL</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">System Security & Audit Trail</h2>
                <p className="text-xs text-slate-500">
                  Complete immutable ledger of all administrator, technician, and customer actions.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target Entity</th>
                      <th className="py-3 px-4">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{log.userName}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-sky-700">{log.action}</td>
                        <td className="py-3 px-4 text-slate-600">{log.targetEntity}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                          {JSON.stringify(log.details)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: COMPANY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl space-y-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">DIGI Hub Company & System Settings</h2>
                <p className="text-xs text-slate-500">
                  Update customer-facing contact phone numbers, WhatsApp, tax percentages, and company slogan.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={appSettingsState.companyName}
                    onChange={(e) => setAppSettingsState({ ...appSettingsState, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Tagline / Slogan</label>
                  <input
                    type="text"
                    value={appSettingsState.slogan}
                    onChange={(e) => setAppSettingsState({ ...appSettingsState, slogan: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={appSettingsState.phone}
                      onChange={(e) => setAppSettingsState({ ...appSettingsState, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={appSettingsState.whatsapp}
                      onChange={(e) => setAppSettingsState({ ...appSettingsState, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={appSettingsState.email}
                    onChange={(e) => setAppSettingsState({ ...appSettingsState, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Headquarters Physical Address</label>
                  <input
                    type="text"
                    value={appSettingsState.address}
                    onChange={(e) => setAppSettingsState({ ...appSettingsState, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tax Rate Percentage (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={appSettingsState.taxRatePercent}
                      onChange={(e) => setAppSettingsState({ ...appSettingsState, taxRatePercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Business Operating Hours</label>
                    <input
                      type="text"
                      value={appSettingsState.businessHours}
                      onChange={(e) => setAppSettingsState({ ...appSettingsState, businessHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition disabled:opacity-50"
                >
                  {isSavingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Formal Quotation Builder Modal */}
      {isQuotationBuilderOpen && selectedRequestForQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Formal Estimate Generator</span>
                <h3 className="text-xl font-bold">Prepare Quotation for {selectedRequestForQuote.customerName}</h3>
                <p className="text-xs text-slate-400">Request: {selectedRequestForQuote.requestNumber}</p>
              </div>
              <button onClick={() => setIsQuotationBuilderOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Itemized Quotation Lines</h4>
                <div className="space-y-2">
                  {quoteItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].description = e.target.value;
                          setQuoteItems(updated);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border text-xs"
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].quantity = parseInt(e.target.value) || 1;
                          setQuoteItems(updated);
                        }}
                        className="w-16 px-2 py-1.5 rounded-lg border text-xs text-center"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].unitPrice = parseFloat(e.target.value) || 0;
                          setQuoteItems(updated);
                        }}
                        className="w-24 px-2 py-1.5 rounded-lg border text-xs text-right"
                      />
                      <button
                        type="button"
                        onClick={() => setQuoteItems(quoteItems.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setQuoteItems([...quoteItems, { description: 'Hardware / Cabling Item', quantity: 1, unitPrice: 50.0 }])
                    }
                    className="text-xs font-bold text-sky-600 hover:underline"
                  >
                    + Add Line Item
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Promotional Discount ($)</label>
                  <input
                    type="number"
                    value={quoteDiscount}
                    onChange={(e) => setQuoteDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    value={quoteValidityDays}
                    onChange={(e) => setQuoteValidityDays(parseInt(e.target.value) || 14)}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Commercial Notes & Warranty Clause</label>
                <textarea
                  rows={2}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuotationBuilderOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateFormalQuotation}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md"
                >
                  Issue Formal Quotation PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Technician Modal */}
      {isAssignModalOpen && selectedServiceRequestForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900">
              Assign Field Technician to Ticket {selectedServiceRequestForAssign.requestNumber}
            </h3>
            <div>
              <label className="block font-semibold mb-1">Select Technician</label>
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs bg-slate-50"
              >
                <option value="">-- Choose Field Technician --</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} (Unit: DH-VAN-04)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Scheduled Date</label>
              <input
                type="date"
                value={assignDate}
                onChange={(e) => setAssignDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Time Slot Window</label>
              <select
                value={assignTime}
                onChange={(e) => setAssignTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs bg-slate-50"
              >
                <option>Morning (9:00 AM - 12:00 PM)</option>
                <option>Afternoon (1:00 PM - 4:00 PM)</option>
                <option>Evening (4:00 PM - 7:00 PM)</option>
              </select>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignTechnician}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              Broadcast Notification to All Customers
            </h3>
            <form onSubmit={handleBroadcast} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Notification Title</label>
                <input
                  type="text"
                  required
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                  placeholder="e.g. Scheduled Network Maintenance or Holiday Support Hours"
                  className="w-full p-2.5 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Message Body</label>
                <textarea
                  required
                  rows={3}
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                  placeholder="e.g. DIGI Hub engineering will perform optical core switches upgrades on Sunday 2:00 AM - 4:00 AM..."
                  className="w-full p-2.5 rounded-xl border text-xs"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 text-white font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official PDF Document Modal */}
      {selectedPDFDoc && (
        <PDFModal
          type={selectedPDFDoc.type}
          data={selectedPDFDoc.data}
          settings={settings}
          onClose={() => setSelectedPDFDoc(null)}
        />
      )}
    </div>
  );
};
