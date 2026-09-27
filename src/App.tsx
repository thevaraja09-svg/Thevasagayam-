import React, { useState, useEffect } from 'react';
import { api } from './lib/api';
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
  NotificationItem,
  AppSettings,
} from './types';
import { SplashScreen } from './components/SplashScreen';
import { CustomerApp } from './components/CustomerApp/CustomerApp';
import { TechnicianDashboard } from './components/TechnicianApp/TechnicianDashboard';
import { AdminDashboard } from './components/AdminApp/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { DigiHubLogo } from './components/DigiHubLogo';
import {
  Smartphone,
  Monitor,
  User as UserIcon,
  Shield,
  Truck,
  Layers,
  Sparkles,
  Wifi,
  Battery,
  ChevronDown,
} from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // View presentation mode: Mobile frame vs Full responsive screen
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Core Data Stores
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotationRequests, setQuotationRequests] = useState<QuotationRequest[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [warranties, setWarranties] = useState<WarrantyRecord[]>([]);
  const [cctvDevices, setCctvDevices] = useState<CCTVDevice[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    companyName: 'DIGI Hub',
    slogan: 'Secure Homes | Safe Businesses | Stronger Connections',
    phone: '+1 (555) 344-4482',
    whatsapp: '+1 (555) 344-4482',
    email: 'support@digihub-solutions.com',
    address: '8400 Tech Convergence Blvd, Suite 400, Silicon Corridor',
    taxRatePercent: 8.5,
    currency: 'USD',
    businessHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0192873733074!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858085f94bfa29%3A0x6e9fef39ff85c654!2sMarket%20St%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1699999999999',
  });

  const [isLoading, setIsLoading] = useState(true);

  // Bootstrap initial session & data
  const fetchData = async () => {
    try {
      // Authenticate or get current user
      let userObj: User | null = null;
      try {
        const meRes = await api.getMe();
        userObj = meRes.user;
      } catch {
        // If not logged in, auto sign in default customer
        const loginRes = await api.login('david.chen@gmail.com', 'client123');
        userObj = loginRes.user;
      }
      setCurrentUser(userObj);

      // Parallelize fetches
      const [
        servicesRes,
        productsRes,
        quoteReqsRes,
        quotesRes,
        serviceReqsRes,
        invRes,
        warrRes,
        cctvRes,
        notifRes,
        settingsRes,
      ] = await Promise.all([
        api.getServices(),
        api.getProducts(),
        api.getQuotationRequests(),
        api.getQuotations(),
        api.getServiceRequests(),
        api.getInvoices(),
        api.getWarranties(),
        api.getCctvDevices(),
        api.getNotifications(),
        api.getSettings(),
      ]);

      setServices(servicesRes.services);
      setProducts(productsRes.products);
      setQuotationRequests(quoteReqsRes.quotationRequests);
      setQuotations(quotesRes.quotations);
      setServiceRequests(serviceReqsRes.serviceRequests);
      setInvoices(invRes.invoices);
      setWarranties(warrRes.warranties);
      setCctvDevices(cctvRes.devices);
      setNotifications(notifRes.notifications);
      setSettings(settingsRes.settings);
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleSwitch = async (role: string, email: string) => {
    setIsLoading(true);
    try {
      const res = await api.switchRole(role, email);
      setCurrentUser(res.user);
      await fetchData();
    } catch (err) {
      console.error('Failed to switch role', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.setToken(null);
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  if (showSplash) {
    return <SplashScreen onDismiss={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Application Control Bar */}
      <nav
        className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/90 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs z-50 sticky top-0 print:hidden shadow-lg shadow-black/20"
        id="app-top-control-bar"
      >
        <div className="flex items-center gap-3">
          <DigiHubLogo variant="white" size="sm" />
          <div className="hidden lg:flex items-center gap-2 border-l border-slate-800 pl-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide">
              Security & Network Systems Online
            </span>
          </div>
        </div>

        {/* Center: Active Role & Quick Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800/80 shadow-inner">
          <button
            onClick={() => handleRoleSwitch('CUSTOMER', 'david.chen@gmail.com')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-all duration-200 flex items-center gap-1.5 ${
              currentUser?.role === 'CUSTOMER'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md shadow-sky-600/30 glow-sky-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customer</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('TECHNICIAN', 'tech.alex@digihub.com')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-all duration-200 flex items-center gap-1.5 ${
              currentUser?.role === 'TECHNICIAN'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 glow-emerald-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Technician</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('ADMIN', 'admin@digihub.com')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-all duration-200 flex items-center gap-1.5 ${
              currentUser?.role === 'ADMIN'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 glow-purple-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Portal</span>
          </button>
        </div>

        {/* Right: Device Frame Toggle & Account Control */}
        <div className="flex items-center gap-2">
          {currentUser?.role === 'CUSTOMER' && (
            <button
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-all flex items-center gap-1.5 border border-slate-700/50 shadow-sm"
              title="Toggle between Mobile Phone Frame and Full Screen"
            >
              {isMobileFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Full Screen</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Mobile Frame</span>
                </>
              )}
            </button>
          )}

          {currentUser ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white transition-all flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="hidden md:inline font-semibold">{currentUser.fullName}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold transition-all shadow-md shadow-sky-600/20"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Main App Content View Router */}
      <div className="flex-1 flex flex-col justify-center items-center overflow-x-hidden">
        {currentUser?.role === 'ADMIN' ? (
          <div className="w-full">
            <AdminDashboard
              user={currentUser}
              services={services}
              products={products}
              quotationRequests={quotationRequests}
              quotations={quotations}
              serviceRequests={serviceRequests}
              invoices={invoices}
              warranties={warranties}
              cctvDevices={cctvDevices}
              settings={settings}
              onRefresh={fetchData}
              onLogout={handleLogout}
              onSwitchRole={handleRoleSwitch}
            />
          </div>
        ) : currentUser?.role === 'TECHNICIAN' ? (
          <div className="w-full">
            <TechnicianDashboard
              user={currentUser}
              settings={settings}
              onRefresh={fetchData}
              onLogout={handleLogout}
              onSwitchRole={handleRoleSwitch}
            />
          </div>
        ) : (
          /* Customer Mobile Application */
          <div
            className={`w-full transition-all duration-300 ${
              isMobileFrame
                ? 'max-w-[420px] my-6 rounded-[48px] border-[10px] border-slate-800 bg-slate-50 shadow-2xl overflow-hidden relative'
                : 'w-full bg-slate-50'
            }`}
          >
            {/* Mobile Phone Notch & Status Bar (Only visible when Mobile Frame is active) */}
            {isMobileFrame && (
              <div className="bg-slate-900 text-white text-[11px] px-6 py-2 flex items-center justify-between select-none border-b border-slate-800">
                <span className="font-semibold">9:41</span>
                <div className="w-24 h-4 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3 h-3" />
                  <span className="font-bold text-[9px]">5G</span>
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            {currentUser && (
              <CustomerApp
                user={currentUser}
                services={services}
                products={products}
                quotationRequests={quotationRequests}
                quotations={quotations}
                serviceRequests={serviceRequests}
                invoices={invoices}
                warranties={warranties}
                cctvDevices={cctvDevices}
                notifications={notifications}
                settings={settings}
                onRefresh={fetchData}
                onLogout={handleLogout}
                onSwitchRole={handleRoleSwitch}
              />
            )}
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
