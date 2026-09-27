import React from 'react';
import { ServiceItem, Product, ServiceRequest, NotificationItem, AppSettings } from '../../types';
import { Shield, Wrench, Phone, MessageSquare, ArrowRight, Video, Wifi, Cpu, CheckCircle2, ChevronRight, Bell, Clock, AlertCircle } from 'lucide-react';
import { DigiHubLogo } from '../DigiHubLogo';

interface CustomerHomeProps {
  services: ServiceItem[];
  products: Product[];
  activeRequests: ServiceRequest[];
  notifications: NotificationItem[];
  settings: AppSettings;
  onRequestQuote: (serviceName?: string) => void;
  onRequestService: (serviceName?: string) => void;
  onNavigateTab: (tab: 'services' | 'products' | 'requests' | 'account') => void;
  onOpenContact: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  services,
  products,
  activeRequests,
  notifications,
  settings,
  onRequestQuote,
  onRequestService,
  onNavigateTab,
  onOpenContact,
}) => {
  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWa = settings.whatsapp.replace(/[^0-9+]/g, '');
  const unreadNotifs = notifications.filter((n) => !n.read);

  // Active in-progress or assigned job
  const featuredActiveJob = activeRequests.find(
    (sr) => sr.status !== 'Completed' && sr.status !== 'Cancelled'
  );

  return (
    <div className="space-y-6 pb-12" id="customer-home-view">
      {/* Top Brand Greeting Header */}
      <div className="flex items-center justify-between pt-1 px-1">
        <DigiHubLogo size="md" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('account')}
            className="relative p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 transition shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Security-Focused Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800/80">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-emerald-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            Next-Gen Security & Fiber Infrastructure
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            High Assurance 4K Surveillance & Network Systems
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2.5 leading-relaxed">
            {settings.slogan}. Turnkey CCTV installations, high-speed Wi-Fi 6 access points, and structured optical fiber.
          </p>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onRequestQuote()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-sky-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              id="hero-btn-quote"
            >
              <Shield className="w-4 h-4" />
              Get a Free Quote
            </button>
            <button
              onClick={() => onRequestService()}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-xs border border-slate-700 backdrop-blur-md transition-all flex items-center gap-2 shadow-sm"
              id="hero-btn-service"
            >
              <Wrench className="w-4 h-4 text-emerald-400" />
              Book Service Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
        <button
          onClick={() => onRequestQuote()}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-sky-50/50 text-slate-800 border border-slate-200/80 transition-all shadow-sm hover:shadow-md hover:border-sky-300 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center mb-2 shadow-md shadow-sky-600/20 group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-extrabold leading-tight text-slate-900">Get Quote</span>
        </button>

        <button
          onClick={() => onRequestService()}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 text-slate-800 border border-slate-200/80 transition-all shadow-sm hover:shadow-md hover:border-emerald-300 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-2 shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-extrabold leading-tight text-slate-900">Service Ticket</span>
        </button>

        <a
          href={`tel:${cleanPhone}`}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-purple-50/50 text-slate-800 border border-slate-200/80 transition-all shadow-sm hover:shadow-md hover:border-purple-300 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center mb-2 shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-extrabold leading-tight text-slate-900">Call Depot</span>
        </a>

        <a
          href={`https://wa.me/${cleanWa.replace('+', '')}?text=Hello%20DIGI%20Hub,%20I%20need%20assistance%20with%20CCTV%20or%20Networking`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-teal-50/50 text-slate-800 border border-slate-200/80 transition-all shadow-sm hover:shadow-md hover:border-teal-300 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mb-2 shadow-md shadow-teal-600/20 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-extrabold leading-tight text-slate-900">WhatsApp</span>
        </a>
      </div>

      {/* Active Service Ticket Notification Banner */}
      {featuredActiveJob && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border border-amber-300/80 shadow-sm flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex-shrink-0 mt-0.5 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                  Active Service Ticket
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 border border-amber-300">
                  {featuredActiveJob.status}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mt-1">{featuredActiveJob.requestNumber} &bull; {featuredActiveJob.serviceType}</h4>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {featuredActiveJob.assignedTechnicianName
                  ? `Assigned Engineer: ${featuredActiveJob.assignedTechnicianName}`
                  : 'Ticket queued for engineer dispatch'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('requests')}
            className="text-xs font-bold text-amber-950 hover:text-amber-900 flex items-center gap-1 self-center bg-white px-3.5 py-2 rounded-xl border border-amber-300 shadow-sm hover:shadow transition"
          >
            Track <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Core Solutions Grid: CCTV & Networking */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">CCTV Surveillance Solutions</h2>
            <p className="text-xs text-slate-500">Commercial & Residential Turnkey Security</p>
          </div>
          <button
            onClick={() => onNavigateTab('services')}
            className="text-xs font-extrabold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            View All ({services.length}) <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.slice(0, 4).map((service) => (
            <div
              key={service.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all flex gap-4 items-start group"
            >
              <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-22 h-22">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-22 h-22 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded backdrop-blur-sm">
                  4K AI
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">
                  {service.category}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-sky-600 transition-colors">{service.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{service.description}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <span className="text-xs font-extrabold text-slate-900">
                    From ${service.startingPrice}
                  </span>
                  <button
                    onClick={() => onRequestQuote(service.name)}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 group/btn"
                  >
                    Get Quote <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Networking Solutions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Network & Infrastructure</h2>
            <p className="text-xs text-slate-500">Server Racks, Enterprise Wi-Fi, Structured Cabling & Access Control</p>
          </div>
          <button
            onClick={() => onNavigateTab('services')}
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.slice(4, 8).map((service) => (
            <div
              key={service.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all flex gap-4 items-start group"
            >
              <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-22 h-22">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-22 h-22 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded backdrop-blur-sm">
                  PoE+
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                  {service.category}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-emerald-600 transition-colors">{service.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{service.description}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <span className="text-xs font-extrabold text-slate-900">
                    From ${service.startingPrice}
                  </span>
                  <button
                    onClick={() => onRequestService(service.name)}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 group/btn"
                  >
                    Book Service <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Catalogue Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Enterprise Hardware</h2>
            <p className="text-xs text-slate-500">Genuine cameras, NVRs, PoE switches, and accessories</p>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs font-extrabold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            Catalog ({products.length}) <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigateTab('products')}
              className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-28 rounded-xl overflow-hidden bg-slate-100 mb-2.5 relative">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm shadow">
                    {product.brand}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">{product.name}</h4>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-black text-xs text-sky-700">${product.price.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Contact Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div>
          <h3 className="font-extrabold text-base">Need an Immediate On-Site Assessment?</h3>
          <p className="text-xs text-slate-300 mt-1">
            Our certified network engineers are on call across the region.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenContact}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white text-xs font-bold transition shadow-lg shadow-sky-500/25 active:scale-95"
          >
            Contact DIGI Hub Depot
          </button>
        </div>
      </div>
    </div>
  );
};
