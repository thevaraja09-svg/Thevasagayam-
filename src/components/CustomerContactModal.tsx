import React from 'react';
import { AppSettings } from '../types';
import { X, Phone, MessageSquare, Mail, MapPin, Clock, Navigation, ShieldCheck } from 'lucide-react';
import { DigiHubLogo } from './DigiHubLogo';

interface CustomerContactModalProps {
  settings: AppSettings;
  onClose: () => void;
}

export const CustomerContactModal: React.FC<CustomerContactModalProps> = ({ settings, onClose }) => {
  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWa = settings.whatsapp.replace(/[^0-9+]/g, '');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto" id="contact-modal-container">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="mb-2">
            <DigiHubLogo variant="white" size="md" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Direct Client Engineering Support</h2>
          <p className="text-xs text-sky-200 mt-1">{settings.slogan}</p>
        </div>

        {/* Quick Action Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-sm border border-sky-200 transition shadow-sm"
              id="btn-call-direct"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              <span>Call Us</span>
            </a>

            <a
              href={`https://wa.me/${cleanWa.replace('+', '')}?text=Hello%20DIGI%20Hub,%20I%20would%20like%20to%20inquire%20about%20CCTV%20and%20Network%20solutions.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm border border-emerald-200 transition shadow-sm"
              id="btn-whatsapp-direct"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`mailto:${settings.email}?subject=Inquiry%20from%20DIGI%20Hub%20Client`}
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm border border-purple-200 transition shadow-sm"
              id="btn-email-direct"
            >
              <Mail className="w-4 h-4 text-purple-600" />
              <span>Email DIGI Hub</span>
            </a>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-sm border border-orange-200 transition shadow-sm"
              id="btn-directions-direct"
            >
              <Navigation className="w-4 h-4 text-orange-600" />
              <span>Get Directions</span>
            </a>
          </div>

          {/* Contact Details List */}
          <div className="space-y-4 rounded-2xl bg-slate-50 p-5 border border-slate-100 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Headquarters & Technical Depot</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{settings.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Operating & Dispatch Hours</p>
                <p className="text-slate-600 mt-0.5">{settings.businessHours}</p>
                <p className="text-[11px] text-amber-600 font-semibold mt-0.5">24/7 Priority Emergency Coverage for SLA Customers</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Government & Security Certification</p>
                <p className="text-slate-600 mt-0.5">Licensed CCTV Low-Voltage & Telecoms Cabling Contractor</p>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative h-40 bg-slate-100">
            <iframe
              title="DIGI Hub Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={settings.googleMapsEmbedUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
