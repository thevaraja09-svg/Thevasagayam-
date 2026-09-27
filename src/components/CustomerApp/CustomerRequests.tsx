import React, { useState } from 'react';
import { QuotationRequest, Quotation, ServiceRequest, AppSettings } from '../../types';
import { api } from '../../lib/api';
import {
  FileText,
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Eye,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  Check,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { PDFModal } from '../PDFModal';

interface CustomerRequestsProps {
  quotationRequests: QuotationRequest[];
  quotations: Quotation[];
  serviceRequests: ServiceRequest[];
  settings: AppSettings;
  onRefresh: () => void;
  onRequestNewQuote: () => void;
  onRequestNewService: () => void;
}

export const CustomerRequests: React.FC<CustomerRequestsProps> = ({
  quotationRequests,
  quotations,
  serviceRequests,
  settings,
  onRefresh,
  onRequestNewQuote,
  onRequestNewService,
}) => {
  const [activeTab, setActiveTab] = useState<'quotations' | 'serviceTickets'>('quotations');
  const [selectedQuotationForPDF, setSelectedQuotationForPDF] = useState<Quotation | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const handleCustomerResponse = async (quotationId: string, accept: boolean) => {
    setIsUpdatingStatus(quotationId);
    try {
      await api.updateQuotationStatus(quotationId, accept ? 'Accepted' : 'Declined');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update quotation status');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  return (
    <div className="space-y-5 pb-12" id="customer-requests-view">
      {/* Title & Request CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Requests & Trackers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status tracking for engineering quotes and field service dispatch tickets.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onRequestNewQuote}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
          >
            + New Quote
          </button>
          <button
            onClick={onRequestNewService}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
          >
            + Book Service
          </button>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80">
        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'quotations'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-600" />
          Quotations ({quotationRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('serviceTickets')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'serviceTickets'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-600" />
          Service Tickets ({serviceRequests.length})
        </button>
      </div>

      {/* Tab 1: Quotations View */}
      {activeTab === 'quotations' && (
        <div className="space-y-4">
          {quotationRequests.map((req) => {
            // Check if there is a prepared formal quotation for this request
            const preparedQuote = quotations.find((q) => q.requestId === req.id);

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {req.requestNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                      req.status === 'Quotation Prepared'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : req.status === 'Customer Accepted'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : req.status === 'Under Review'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {req.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{req.serviceRequired}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {req.location} &bull; Property: {req.propertyType} &bull; {req.numberOfCameras} Cameras
                  </p>
                  {req.additionalRequirements && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      "{req.additionalRequirements}"
                    </p>
                  )}
                </div>

                {/* If Quotation Is Prepared */}
                {preparedQuote && (
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                        Official Prepared Estimate #{preparedQuote.quotationNumber}
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xl font-black text-slate-900">
                          ${preparedQuote.total.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500">
                          (Valid until {new Date(preparedQuote.validityDate).toLocaleDateString()})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedQuotationForPDF(preparedQuote)}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white border border-sky-300 text-sky-700 text-xs font-bold shadow-sm hover:bg-sky-50 transition flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View PDF Quotation
                      </button>

                      {preparedQuote.status === 'Sent' && (
                        <>
                          <button
                            disabled={isUpdatingStatus === preparedQuote.id}
                            onClick={() => handleCustomerResponse(preparedQuote.id, true)}
                            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Accept Quote
                          </button>
                          <button
                            disabled={isUpdatingStatus === preparedQuote.id}
                            onClick={() => handleCustomerResponse(preparedQuote.id, false)}
                            className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {preparedQuote.status === 'Accepted' && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Accepted by You
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {quotationRequests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              You have not submitted any quotation requests yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Service Tickets View */}
      {activeTab === 'serviceTickets' && (
        <div className="space-y-4">
          {serviceRequests.map((ticket) => {
            const steps = [
              'Submitted',
              'Assigned',
              'Scheduled',
              'Technician On The Way',
              'In Progress',
              'Completed',
            ];
            const currentStepIdx = steps.indexOf(ticket.status);

            return (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {ticket.requestNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      ticket.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : ticket.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : ticket.status === 'Technician On The Way'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {ticket.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{ticket.serviceType}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    <span className="font-semibold text-slate-700">Problem:</span> {ticket.problemDescription}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {ticket.location}
                  </p>
                </div>

                {/* Assigned Technician Card */}
                {ticket.assignedTechnicianName && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                        {ticket.assignedTechnicianName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{ticket.assignedTechnicianName}</p>
                        <p className="text-slate-500 text-[11px]">Assigned Field Technician</p>
                      </div>
                    </div>
                    {ticket.scheduledDate && (
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{ticket.scheduledDate}</p>
                        <p className="text-slate-500 text-[11px]">{ticket.scheduledTime || 'Window Scheduled'}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Visual Progress Timeline */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Service Execution Timeline
                  </p>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-3 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
                    {steps.map((step, idx) => {
                      const isDone = currentStepIdx >= idx && ticket.status !== 'Cancelled';
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              isCurrent
                                ? 'bg-sky-600 text-white ring-4 ring-sky-100 scale-110'
                                : isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] mt-1 text-center max-w-[60px] leading-tight font-medium ${
                              isCurrent
                                ? 'font-bold text-sky-700'
                                : isDone
                                ? 'text-slate-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Technician Work Summary & Photos if Completed */}
                {ticket.technicianNotes && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs">
                    <p className="font-bold text-emerald-900">Technician Service Completion Notes:</p>
                    <p className="text-emerald-800 mt-0.5 leading-relaxed">{ticket.technicianNotes}</p>
                    {ticket.partsUsed && ticket.partsUsed.length > 0 && (
                      <p className="text-emerald-800 mt-1 text-[11px]">
                        <span className="font-bold">Hardware Replaced / Installed:</span>{' '}
                        {ticket.partsUsed.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {serviceRequests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No service tickets on file. Click "+ Book Service" to request technician dispatch.
            </div>
          )}
        </div>
      )}

      {/* Printable PDF Modal */}
      {selectedQuotationForPDF && (
        <PDFModal
          type="quotation"
          data={selectedQuotationForPDF}
          settings={settings}
          onClose={() => setSelectedQuotationForPDF(null)}
        />
      )}
    </div>
  );
};
