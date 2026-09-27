import React, { useState } from 'react';
import { api } from '../lib/api';
import { ServiceItem, ServiceRequest } from '../types';
import { X, Wrench, Camera, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface CustomerServiceModalProps {
  services: ServiceItem[];
  preselectedService?: string;
  onClose: () => void;
  onSuccess: (request: ServiceRequest) => void;
}

export const CustomerServiceModal: React.FC<CustomerServiceModalProps> = ({
  services,
  preselectedService,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    serviceType: preselectedService || (services[1]?.name ?? 'CCTV Maintenance & Health Check'),
    problemDescription: '',
    location: '',
    phone: '',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: 'Morning (9:00 AM - 12:00 PM)',
    additionalNotes: '',
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
          const res = await api.uploadFile(dataUrl, 'fault_photo.jpg');
          uploadedUrls.push(res.url);
        } catch {
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
    if (!formData.serviceType || !formData.problemDescription || !formData.location || !formData.phone) {
      setError('Please fill in service type, problem description, phone number, and location.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.createServiceRequest({
        ...formData,
        photos,
      });
      onSuccess(res.serviceRequest);
    } catch (err: any) {
      setError(err.message || 'Failed to submit service ticket.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto" id="service-modal-container">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            Field Engineering Ticket
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Book a Service or Repair</h2>
          <p className="text-slate-300 text-xs mt-1">
            Dispatch a certified DIGI Hub technician to diagnose and repair your system.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Equipment / System Type *</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 font-medium"
            >
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fault / Issue Description *</label>
            <textarea
              required
              rows={3}
              value={formData.problemDescription}
              onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
              placeholder="e.g. Channel 2 camera video signal lost, NVR beep alarm active, Wi-Fi AP red light flashing, or intercom gate strike not opening..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Address / Location *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. 48 Maple Crescent"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time Window</label>
              <select
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              >
                <option>Morning (9:00 AM - 12:00 PM)</option>
                <option>Afternoon (1:00 PM - 4:00 PM)</option>
                <option>Evening (4:00 PM - 7:00 PM)</option>
                <option>Urgent / Emergency 24/7</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Site Photos (Equipment Error, Error Screens)</label>
            <div className="flex flex-wrap gap-2.5 items-center">
              {photos.map((url, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                  <img src={url} alt="Fault" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-emerald-50/50 transition">
                <Camera className="w-5 h-5 text-slate-400" />
                <span className="text-[9px] text-slate-500 mt-0.5 font-medium">Add Photo</span>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {isUploading && <span className="text-xs text-emerald-600 animate-pulse">Uploading...</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gate Code / Access Instructions (Optional)</label>
            <input
              type="text"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="e.g. Ring buzzer at Gate B or call security desk upon arrival"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>Dispatching Request...</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Dispatch Service Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
