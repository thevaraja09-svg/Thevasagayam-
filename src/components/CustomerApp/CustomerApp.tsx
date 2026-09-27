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
import { Home, Layers, Package, FileText, User as UserIcon } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between" id="customer-mobile-app">
      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24 flex-1">
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

      {/* Customer Mobile Sticky Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-4 shadow-lg shadow-slate-900/5 print:hidden"
        id="customer-bottom-nav"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'home' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'services' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Services</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'products' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Products</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex flex-col items-center justify-center py-1 relative transition ${
              activeTab === 'requests' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative">
              <FileText className="w-5 h-5 mb-0.5" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {pendingRequestsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'account' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <UserIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Account</span>
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
