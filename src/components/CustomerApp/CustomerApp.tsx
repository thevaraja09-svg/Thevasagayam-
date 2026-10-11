import React, { useState } from 'react';
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
} from '../../types';
import { CustomerHome } from './CustomerHome';
import { CustomerServices } from './CustomerServices';
import { CustomerProducts } from './CustomerProducts';
import { CustomerRequests } from './CustomerRequests';
import { CustomerAccount } from './CustomerAccount';
import { CustomerQuoteModal } from '../CustomerQuoteModal';
import { CustomerServiceModal } from '../CustomerServiceModal';
import { CustomerContactModal } from '../CustomerContactModal';
import { DigiHubLogo } from '../DigiHubLogo';
import {
  Home,
  Layers,
  Package,
  FileText,
  User as UserIcon,
  Phone,
  Shield,
  Wrench,
  Clock,
  Sparkles,
  ChevronRight,
  Headphones,
  MapPin,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CustomerAppProps {
  user: User;
  services: ServiceItem[];
  products: Product[];
  quotationRequests: QuotationRequest[];
  quotations: Quotation[];
  serviceRequests: ServiceRequest[];
  invoices: Invoice[];
  warranties: WarrantyRecord[];
  cctvDevices: CCTVDevice[];
  notifications: NotificationItem[];
  settings: AppSettings;
  onRefresh: () => void;
  onLogout: () => void;
  onSwitchRole: (role: string, email: string) => void;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({
  user,
  services,
  products,
  quotationRequests,
  quotations,
  serviceRequests,
  invoices,
  warranties,
  cctvDevices,
  notifications,
  settings,
  onRefresh,
  onLogout,
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'products' | 'requests' | 'account'>('home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [preselectedQuoteService, setPreselectedQuoteService] = useState<string | undefined>();
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [preselectedServiceType, setPreselectedServiceType] = useState<string | undefined>();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleOpenQuote = (serviceName?: string) => {
    setPreselectedQuoteService(serviceName);
    setIsQuoteModalOpen(true);
  };

  const handleOpenService = (serviceName?: string) => {
    setPreselectedServiceType(serviceName);
    setIsServiceModalOpen(true);
  };

  const pendingRequestsCount = serviceRequests.filter(
    (sr) => sr.status !== 'Completed' && sr.status !== 'Cancelled'
  ).length;

  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between" id="customer-main-app">
      {/* World-Class Desktop Navigation Header (Hidden on small mobile screens) */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('home')}
              className="text-left focus:outline-none group transition-transform"
            >
              <DigiHubLogo size="md" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-1.5 lg:gap-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'home'
                    ? 'bg-sky-50 text-sky-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Home className="w-4 h-4 text-sky-600" />
                Home
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'services'
                    ? 'bg-sky-50 text-sky-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Layers className="w-4 h-4 text-sky-600" />
                Services & Solutions
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'products'
                    ? 'bg-sky-50 text-sky-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Package className="w-4 h-4 text-sky-600" />
                Equipment Catalog
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 relative ${
                  activeTab === 'requests'
                    ? 'bg-sky-50 text-sky-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <FileText className="w-4 h-4 text-sky-600" />
                My Requests
                {pendingRequestsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('account')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'account'
                    ? 'bg-sky-50 text-sky-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <UserIcon className="w-4 h-4 text-sky-600" />
                Client Hub & Fleet
              </button>
            </nav>
          </div>

          {/* Right Action Hub */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition"
              title="24/7 Emergency Dispatch Line"
            >
              <Headphones className="w-3.5 h-3.5 text-sky-600" />
              <span>{settings.phone}</span>
            </a>

            <button
              onClick={() => handleOpenQuote()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-bold transition shadow-sm hover:shadow-md flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Request Free Quote
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area: Responsive with ample breathing room */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 flex-1">
        {activeTab === 'home' && (
          <CustomerHome
            services={services}
            products={products}
            activeRequests={serviceRequests}
            notifications={notifications}
            settings={settings}
            onRequestQuote={handleOpenQuote}
            onRequestService={handleOpenService}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenContact={() => setIsContactModalOpen(true)}
          />
        )}

        {activeTab === 'services' && (
          <CustomerServices
            services={services}
            onRequestQuote={handleOpenQuote}
            onRequestService={handleOpenService}
          />
        )}

        {activeTab === 'products' && (
          <CustomerProducts
            products={products}
            onRequestQuote={(prodName) => handleOpenQuote(prodName)}
          />
        )}

        {activeTab === 'requests' && (
          <CustomerRequests
            quotationRequests={quotationRequests}
            quotations={quotations}
            serviceRequests={serviceRequests}
            settings={settings}
            onRefresh={onRefresh}
            onRequestNewQuote={() => handleOpenQuote()}
            onRequestNewService={() => handleOpenService()}
          />
        )}

        {activeTab === 'account' && (
          <CustomerAccount
            user={user}
            cctvDevices={cctvDevices}
            invoices={invoices}
            warranties={warranties}
            notifications={notifications}
            settings={settings}
            onRefresh={onRefresh}
            onLogout={onLogout}
            onSwitchRole={onSwitchRole}
          />
        )}
      </main>

      {/* Modern Desktop & Tablet Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12 py-10 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <DigiHubLogo variant="white" size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Certified enterprise CCTV surveillance, structured fiber optic cabling, and wireless networking infrastructure.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              24/7 Rapid Emergency Response Active
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Core Solutions</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => { setActiveTab('services'); }} className="hover:text-white transition">4K AI Surveillance Systems</button></li>
              <li><button onClick={() => { setActiveTab('services'); }} className="hover:text-white transition">Optical Fiber & Server Racks</button></li>
              <li><button onClick={() => { setActiveTab('services'); }} className="hover:text-white transition">Enterprise Wi-Fi 6 Access Points</button></li>
              <li><button onClick={() => { setActiveTab('services'); }} className="hover:text-white transition">Biometric Access & Intercoms</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Client Portal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => { setActiveTab('requests'); }} className="hover:text-white transition">Track Quotations & Jobs</button></li>
              <li><button onClick={() => { setActiveTab('account'); }} className="hover:text-white transition">Live CCTV Health Monitor</button></li>
              <li><button onClick={() => { setActiveTab('account'); }} className="hover:text-white transition">Digital Invoices & Warranties</button></li>
              <li><button onClick={() => setIsContactModalOpen(true)} className="hover:text-white transition">Depot Service & Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Direct Contact</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition">{settings.phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition">{settings.email}</a>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>{settings.businessHours}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>&copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved. Commercial & Residential Solutions.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Licensed & Insured
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              ISO 27001 Compliant
            </span>
          </div>
        </div>
      </footer>

      {/* Customer Mobile Sticky Bottom Navigation Bar (Visible on mobile screens) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2.5 px-4 shadow-lg shadow-slate-900/10 md:hidden print:hidden"
        id="customer-bottom-nav"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'home' ? 'text-sky-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-semibold leading-none">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'services' ? 'text-sky-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Layers className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-semibold leading-none">Services</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'products' ? 'text-sky-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Package className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-semibold leading-none">Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex flex-col items-center justify-center py-1 relative transition-all ${
              activeTab === 'requests' ? 'text-sky-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative">
              <FileText className="w-5 h-5 mb-1" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {pendingRequestsCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold leading-none">Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'account' ? 'text-sky-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <UserIcon className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-semibold leading-none">Hub</span>
          </button>
        </div>
      </nav>

      {/* Quote Request Modal */}
      {isQuoteModalOpen && (
        <CustomerQuoteModal
          services={services}
          preselectedService={preselectedQuoteService}
          onClose={() => setIsQuoteModalOpen(false)}
          onSuccess={() => {
            setIsQuoteModalOpen(false);
            onRefresh();
            setActiveTab('requests');
          }}
        />
      )}

      {/* Service Request Modal */}
      {isServiceModalOpen && (
        <CustomerServiceModal
          services={services}
          preselectedService={preselectedServiceType}
          onClose={() => setIsServiceModalOpen(false)}
          onSuccess={() => {
            setIsServiceModalOpen(false);
            onRefresh();
            setActiveTab('requests');
          }}
        />
      )}

      {/* Contact Modal */}
      {isContactModalOpen && (
        <CustomerContactModal
          settings={settings}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </div>
  );
};
