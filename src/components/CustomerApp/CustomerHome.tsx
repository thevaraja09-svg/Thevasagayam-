import React, { useState } from 'react';
import { ServiceItem, Product, ServiceRequest, NotificationItem, AppSettings } from '../../types';
import {
  Shield,
  Wrench,
  Phone,
  MessageSquare,
  ArrowRight,
  Video,
  Wifi,
  Cpu,
  CheckCircle2,
  ChevronRight,
  Bell,
  Clock,
  AlertCircle,
  Eye,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Lock,
  Headphones,
  CheckCircle,
  Star,
  Radio,
} from 'lucide-react';
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

  // Live Camera Simulator State for World-Class Interactive Experience
  const [selectedDemoCam, setSelectedDemoCam] = useState<'front' | 'perimeter' | 'server'>('front');
  const [isNightMode, setIsNightMode] = useState(false);

  const demoCameras = {
    front: {
      name: 'Cam 01 — Main Entrance & Lobby Gate',
      resolution: '4K UHD (3840 x 2160) @ 30 FPS',
      aiDetection: 'Human & Vehicle AcuSense AI Active',
      detectionTarget: 'Vehicle Detected: Silver Sedan (98.4%)',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&auto=format&fit=crop&q=80',
      nightImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80',
      bitrate: '4,096 kbps H.265+',
    },
    perimeter: {
      name: 'Cam 02 — East Perimeter Fence & Loading Dock',
      resolution: '4K ColorVu Full-Color Optical @ 30 FPS',
      aiDetection: 'Smart Line-Crossing Tripwire Active',
      detectionTarget: 'Perimeter Boundary Normal (No Violations)',
      image: 'https://images.unsplash.com/photo-1549109926-58f039549485?w=1200&auto=format&fit=crop&q=80',
      nightImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
      bitrate: '3,840 kbps H.265+',
    },
    server: {
      name: 'Cam 03 — Data Center & Server Infrastructure',
      resolution: '5MP PoE Dome with Biometric Access Interlock',
      aiDetection: 'Thermal Gradient & Fire Pre-Warning AI',
      detectionTarget: 'Rack Temp: 21.4°C — Access Authorized',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80',
      nightImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
      bitrate: '2,560 kbps H.265+',
    },
  };

  const currentCam = demoCameras[selectedDemoCam];

  return (
    <div className="space-y-10 sm:space-y-12 pb-16" id="customer-home-view">
      {/* Mobile-Only Top Greeting (On desktop, this is cleanly handled in the sticky top nav) */}
      <div className="flex items-center justify-between pt-1 px-1 md:hidden">
        <DigiHubLogo size="md" />
        <button
          onClick={() => onNavigateTab('account')}
          className="relative p-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-700 transition shadow-xs hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifs.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Flagship Security Hero Banner with Generous Whitespace */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white p-7 sm:p-10 lg:p-12 shadow-2xl border border-slate-800/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-emerald-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            Enterprise 4K AI Surveillance & Optical Fiber Networks
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            High-Assurance Security & Gigabit Network Infrastructure
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg mt-4 leading-relaxed max-w-2xl font-normal">
            {settings.slogan}. Turnkey installations of ColorVu 4K AI cameras, certified optical fiber links, server rack patch panels, and commercial Wi-Fi 6 mesh.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mt-8">
            <button
              onClick={() => onRequestQuote()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              id="hero-btn-quote"
            >
              <Shield className="w-4 h-4" />
              Request Engineering Quote
            </button>

            <button
              onClick={() => onRequestService()}
              className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 backdrop-blur-md transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              id="hero-btn-service"
            >
              <Wrench className="w-4 h-4 text-emerald-400" />
              Book Certified Technician
            </button>

            <button
              onClick={onOpenContact}
              className="px-4 py-3 rounded-xl text-slate-300 hover:text-white font-semibold text-sm transition flex items-center gap-1.5"
            >
              <Headphones className="w-4 h-4 text-sky-400" />
              Direct Support
            </button>
          </div>

          {/* Live Trust Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 pt-8 border-t border-slate-800/80">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">99.98%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Stream Uptime SLA</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">&lt; 45 Min</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Emergency Field SLA</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">2,400+</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Secured Premises</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">3 Years</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Hardware Warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Service Ticket Notification (Expanded with Live Stepper) */}
      {featuredActiveJob && (
        <section className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border border-amber-300 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex-shrink-0 shadow-sm mt-0.5">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Active Service Ticket in Progress
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300">
                    {featuredActiveJob.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {featuredActiveJob.requestNumber} &bull; {featuredActiveJob.serviceType}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {featuredActiveJob.assignedTechnicianName ? (
                    <>
                      Assigned Lead Field Engineer:{' '}
                      <strong className="text-slate-800">{featuredActiveJob.assignedTechnicianName}</strong>{' '}
                      &bull; Vehicle Dispatch: Van DH-402
                    </>
                  ) : (
                    'Dispatched to our on-call central engineering queue'
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('requests')}
              className="text-xs sm:text-sm font-bold text-amber-950 bg-white hover:bg-amber-100/50 px-4 py-2.5 rounded-xl border border-amber-300 shadow-xs hover:shadow transition flex items-center gap-2 self-start md:self-center"
            >
              Track Live Dispatch <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* World-Class Quick Action Hub (Spacious 4-Card Responsive Grid) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Immediate Services & Direct Support
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Instant engineering quotes, field technician booking, and 24/7 technical assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Get Quote */}
          <button
            onClick={() => onRequestQuote()}
            className="text-left p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center mb-4 shadow-md shadow-sky-600/20 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Request Quotation
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Custom equipment bill of materials and turn-key installation pricing for residential & commercial sites.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:text-sky-700">
              Start Estimate <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Book Service Ticket */}
          <button
            onClick={() => onRequestService()}
            className="text-left p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Book Field Ticket
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Camera repair, fiber optic fusion splicing, NVR storage replacement, or network speed diagnostics.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
              Book Technician <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Call Hotline */}
          <a
            href={`tel:${cleanPhone}`}
            className="text-left p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                24/7 Central Depot
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Connect directly with certified system engineers for emergency outages, offline alarms, and remote triage.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:text-purple-700">
              {settings.phone} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Card 4: WhatsApp Support */}
          <a
            href={`https://wa.me/${cleanWa.replace('+', '')}?text=Hello%20DIGI%20Hub,%20I%20need%20assistance%20with%20CCTV%20or%20Networking`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-left p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mb-4 shadow-md shadow-teal-600/20 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                Instant WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Send blueprints, photos of existing wiring, or request instant product availability from our warehouse.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:text-teal-700">
              Open WhatsApp Chat <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </div>
      </section>

      {/* World-Class Interactive 4K AI Camera Feed Showcase */}
      <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live System Demonstration
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Interactive 4K AI Surveillance Simulator
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Experience the clarity and smart detection analytics powered by DIGI Hub engineered NVR systems.
            </p>
          </div>

          {/* Camera Selector Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDemoCam('front')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedDemoCam === 'front'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Entrance Cam
            </button>

            <button
              onClick={() => setSelectedDemoCam('perimeter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedDemoCam === 'perimeter'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Perimeter Cam
            </button>

            <button
              onClick={() => setSelectedDemoCam('server')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedDemoCam === 'server'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Data Center
            </button>
          </div>
        </div>

        {/* Live Simulated Video Player Box */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-21/9 border border-slate-800 shadow-inner group">
          <img
            src={isNightMode ? currentCam.nightImage : currentCam.image}
            alt={currentCam.name}
            className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
          />

          {/* Subtle Scanline Overlay */}
          <div className="absolute inset-0 bg-radial from-transparent to-black/60 pointer-events-none" />

          {/* Top Camera Information HUD */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono pointer-events-none">
            <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-bold text-white tracking-wider">REC</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-300 font-semibold">{currentCam.name}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-emerald-400 font-bold">
                {currentCam.resolution}
              </div>
              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sky-400 font-bold">
                {currentCam.bitrate}
              </div>
            </div>
          </div>

          {/* AI Bounding Box Graphic Simulation */}
          <div className="absolute top-1/3 left-1/4 sm:left-1/3 border-2 border-emerald-400/90 bg-emerald-500/10 p-2 rounded-lg pointer-events-none max-w-xs animate-pulse">
            <span className="text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider block mb-1">
              AI Deep Learning
            </span>
            <p className="text-xs font-mono text-emerald-200 font-semibold">{currentCam.detectionTarget}</p>
          </div>

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-slate-300">
              {currentCam.aiDetection}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNightMode(!isNightMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md border transition flex items-center gap-1.5 cursor-pointer ${
                  isNightMode
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-black/75 text-slate-300 border-white/15 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {isNightMode ? 'Night ColorVu: ON' : 'Day Mode'}
              </button>

              <button
                onClick={() => onRequestQuote('4K AI Surveillance System')}
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-md shadow-sky-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                Quote This Setup <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CCTV Surveillance Solutions Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              CCTV Surveillance Systems
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Turnkey installations for retail, residential estates, high-rises, and industrial perimeter security.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('services')}
            className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 group self-start sm:self-center"
          >
            Explore All Solutions ({services.length}){' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.slice(0, 4).map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-full sm:w-36 h-36">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      4K Ultra
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                      {service.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1 group-hover:text-sky-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Key Bullet Features */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {service.features.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Starting installed from</span>
                  <span className="text-lg font-black text-slate-900">${service.startingPrice}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onRequestQuote(service.name)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                  >
                    Request Quote <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRequestService(service.name)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Service
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Network & Infrastructure Solutions Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Network Engineering & Optical Fiber
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Structured Cat6A cabling, server racks, PoE switches, and high-density wireless access points.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('services')}
            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 group self-start sm:self-center"
          >
            All Network Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.slice(4, 8).map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-full sm:w-36 h-36">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      PoE+ Gigabit
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      {service.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1 group-hover:text-emerald-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {service.features.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Deployment from</span>
                  <span className="text-lg font-black text-slate-900">${service.startingPrice}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onRequestQuote(service.name)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                  >
                    Request Quote <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRequestService(service.name)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* World-Class Hardware Catalogue Spotlight */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Enterprise Equipment Catalog
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Authorized hardware directly from Hikvision, Dahua, Ubiquiti UniFi, and Western Digital.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 group self-start sm:self-center"
          >
            View Complete Catalog ({products.length}){' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigateTab('products')}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 rounded-xl overflow-hidden bg-slate-100 mb-3.5 relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900/85 text-white backdrop-blur-md">
                    {product.brand}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  {product.sku}
                </span>

                <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-1 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
                  {product.name}
                </h4>

                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-black text-base text-sky-700">${product.price.toFixed(2)}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Special Order'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestQuote(product.name);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition text-xs font-bold"
                >
                  Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Trust, Warranty & SLA Guarantees */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl">
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            The DIGI Hub Engineering Standard
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Why Critical Facilities Rely on DIGI Hub
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every project is engineered with strict adherence to ISO 27001 data protection protocols, BICSI structured cabling standards, and OEM direct warranties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Full On-Site Warranty</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              3-year replacement warranty on NVR recorders and optical fiber lines with zero labor deduction fees.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Rapid Dispatch SLA</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Guaranteed under 45-minute emergency technician arrival for critical camera outages or primary network failures.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Encrypted Cyber Hardening</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Default password sanitization, 802.1X network port authentication, and isolated camera VLAN architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Contact & Rapid Booking Callout */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-extrabold text-xl sm:text-2xl">
            Need an Immediate On-Site Assessment?
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            Our certified field engineers will survey your premises, calculate lens angles, and provide a complimentary turnkey proposal within 24 hours.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenContact}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white text-sm font-bold transition shadow-lg shadow-sky-500/25 active:scale-95 cursor-pointer"
          >
            Contact Central Depot
          </button>
          <a
            href={`tel:${cleanPhone}`}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 transition flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            Direct Call
          </a>
        </div>
      </section>
    </div>
  );
};
