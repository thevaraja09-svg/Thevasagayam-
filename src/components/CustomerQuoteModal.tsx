import React, { useState } from 'react';
import { api } from '../lib/api';
import { ServiceItem, QuotationRequest } from '../types';
import { X, Camera, UploadCloud, Calendar, Clock, MapPin, Building, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';

interface CustomerQuoteModalProps {
  services: ServiceItem[];
  preselectedService?: string;
  onClose: () => void;
  onSuccess: (request: QuotationRequest) => void;
}

export const CustomerQuoteModal: React.FC<CustomerQuoteModalProps> = ({
  services,
  preselectedService,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    location: '',
    serviceRequired: preselectedService || (services[0]?.name ?? 'CCTV Installation'),
    numberOfCameras: 4,
    propertyType: 'Residential / Villa',
    preferredDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    preferredTime: 'Morning (9:00 AM - 12:00 PM)',
    additionalRequirements: '',
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const readPromises: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file must be under 10MB.');
        setIsUploading(false);
        return;
      }

      readPromises.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(readPromises).then(async (dataUrls) => {
      const uploadedUrls: string[] = [];
      for (const dataUrl of dataUrls) {
        try {
          const res = await api.uploadFile(dataUrl, 'site_photo.jpg');
          uploadedUrls.push(res.url);
        } catch {
          // Fallback to dataUrl directly
          uploadedUrls.push(dataUrl);
        }
      }
      setPhotos((prev) => [...prev, ...uploadedUrls]);
      setIsUploading(false);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.email || !formData.location) {
      setError('Please fill in all contact details and installation location.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.requestQuotation({
        ...formData,
        photos,
      });
      onSuccess(res.quotationRequest);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quotation request. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto" id="quote-modal-container">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Official Quotation System
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Request an Engineering Quotation</h2>
          <p className="text-slate-300 text-xs mt-1">
            Receive a formal, itemized quotation with hardware warranty within 24 hours.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1. Client Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. David Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. david.chen@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Installation Address / Location *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="48 Maple Crescent, Green Valley"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Scope */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">2. Service & Scope Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Required *</label>
                <select
                  value={formData.serviceRequired}
                  onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 font-medium"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Property Classification</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  >
                    <option value="Residential / Villa">Residential / Villa</option>
                    <option value="Apartment">Apartment / Penthouse</option>
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Retail Shop">Retail Shop / Showroom</option>
                    <option value="Warehouse / Factory">Warehouse / Factory</option>
                    <option value="Educational Institution">Educational Institution</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Cameras / Access Points Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="128"
                  value={formData.numberOfCameras}
                  onChange={(e) => setFormData({ ...formData, numberOfCameras: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-2 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  >
                    <option>Morning (9 AM - 12 PM)</option>
                    <option>Afternoon (1 PM - 4 PM)</option>
                    <option>Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Requirements */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Project Specifications</label>
            <textarea
              rows={3}
              value={formData.additionalRequirements}
              onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
              placeholder="e.g. Night vision needed around backyard pool, license plate capture at entry gate, or fiber optic link between main villa and guest house..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          {/* Photo Uploads */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">3. Site Photographs (Optional)</h3>
            <p className="text-xs text-slate-500 mb-3">
              Upload photos of your premises, cable pathways, or current electrical rack to receive a more accurate quotation.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              {photos.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                  <img src={url} alt="Site preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-sky-500 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-sky-50/50 transition">
                <Camera className="w-6 h-6 text-slate-400" />
                <span className="text-[10px] text-slate-500 mt-1 font-medium">Add Photo</span>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

              {isUploading && <span className="text-xs text-sky-600 animate-pulse">Uploading photos...</span>}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-sm font-bold shadow-md shadow-sky-600/20 disabled:opacity-50 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>Submitting Request...</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Submit Quotation Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
