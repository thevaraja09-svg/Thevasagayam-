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
  Plus,
  Truck,
  Sparkles,
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
    <div className="space-y-8 pb-16" id="customer-requests-view">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Live Client Tracker & Work Orders
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Requests, Quotes & Service Tickets
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Real-time status tracking for engineering proposals, equipment bills of material, and field dispatch execution.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            onClick={onRequestNewQuote}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Quote Request
          </button>
          <button
            onClick={onRequestNewService}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench className="w-4 h-4" />
            Book Service Ticket
          </button>
        </div>
      </div>

      {/* Segmented Tabs with Generous Padding */}
      <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200/90 max-w-md">
        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'quotations'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-600" />
          Formal Quotes ({quotationRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('serviceTickets')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'serviceTickets'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-600" />
          Field Tickets ({serviceRequests.length})
        </button>
      </div>

      {/* Tab 1: Quotations View */}
      {activeTab === 'quotations' && (
        <div className="space-y-6">
          {quotationRequests.map((req) => {
            const preparedQuote = quotations.find((q) => q.requestId === req.id);

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md transition space-y-5"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-sky-800 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                      {req.requestNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                      req.status === 'Quotation Prepared'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : req.status === 'Customer Accepted'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : req.status === 'Under Review'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {req.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                    {req.serviceRequired}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Location: {req.location}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span>Property: {req.propertyType}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span>Scope: {req.numberOfCameras} Cameras</span>
                  </p>
                  {req.additionalRequirements && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 italic leading-relaxed">
                      "{req.additionalRequirements}"
                    </p>
                  )}
                </div>

                {/* If Quotation Is Prepared */}
                {preparedQuote && (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50/80 via-sky-50/40 to-white border border-sky-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                          Official Bill of Materials #{preparedQuote.quotationNumber}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {preparedQuote.status}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          ${preparedQuote.total.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          (Valid until {new Date(preparedQuote.validityDate).toLocaleDateString()})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                      <button
                        onClick={() => setSelectedQuotationForPDF(preparedQuote)}
                        className="px-4 py-2.5 rounded-xl bg-white border border-sky-300 text-sky-700 text-xs sm:text-sm font-bold shadow-xs hover:bg-sky-50 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        View Official PDF Document
                      </button>

                      {preparedQuote.status === 'Sent' && (
                        <>
                          <button
                            disabled={isUpdatingStatus === preparedQuote.id}
                            onClick={() => handleCustomerResponse(preparedQuote.id, true)}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            Accept & Proceed
                          </button>
                          <button
                            disabled={isUpdatingStatus === preparedQuote.id}
                            onClick={() => handleCustomerResponse(preparedQuote.id, false)}
                            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs sm:text-sm font-bold border border-rose-200 transition cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {preparedQuote.status === 'Accepted' && (
                        <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
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
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Quotation Requests on File</h3>
              <p className="text-sm max-w-sm mx-auto leading-relaxed">
                Click "+ New Quote Request" above to receive an itemized proposal for cameras, cabling, or network gear.
              </p>
              <button
                onClick={onRequestNewQuote}
                className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition"
              >
                Create Quotation Request
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Service Tickets View */}
      {activeTab === 'serviceTickets' && (
        <div className="space-y-6">
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
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md transition space-y-6"
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                      {ticket.requestNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Opened on {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                      ticket.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : ticket.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : ticket.status === 'Technician On The Way'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {ticket.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                    {ticket.serviceType}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 font-bold">Issue Description:</strong>{' '}
                    {ticket.problemDescription}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 pt-1">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{ticket.location}</span>
                  </p>
                </div>

                {/* Assigned Field Engineer Card */}
                {ticket.assignedTechnicianName && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {ticket.assignedTechnicianName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{ticket.assignedTechnicianName}</p>
                        <p className="text-slate-500 text-xs">Certified Lead Field Technician &bull; Van DH-402</p>
                      </div>
                    </div>
                    {ticket.scheduledDate && (
                      <div className="sm:text-right">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{ticket.scheduledDate}</p>
                        <p className="text-slate-500 text-xs">{ticket.scheduledTime || 'Arrival Window'}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* World-Class Progress Stepper (Non-crowded, responsive) */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Field Dispatch Progression
                  </h4>

                  {/* Desktop Stepper */}
                  <div className="hidden sm:grid grid-cols-6 gap-2 relative">
                    {steps.map((step, idx) => {
                      const isDone = currentStepIdx >= idx && ticket.status !== 'Cancelled';
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div key={step} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                              isCurrent
                                ? 'bg-sky-600 text-white ring-4 ring-sky-100 scale-105'
                                : isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-xs leading-snug font-semibold ${
                              isCurrent
                                ? 'text-sky-700 font-bold'
                                : isDone
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Stepper Pill */}
                  <div className="sm:hidden p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      Step {currentStepIdx >= 0 ? currentStepIdx + 1 : 1} of 6:
                    </span>
                    <span className="font-extrabold text-sky-700">{ticket.status}</span>
                  </div>
                </div>

                {/* Technician Completion Notes */}
                {ticket.technicianNotes && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm space-y-2">
                    <p className="font-bold text-emerald-950">Field Engineer Resolution Report:</p>
                    <p className="text-emerald-900 leading-relaxed">{ticket.technicianNotes}</p>
                    {ticket.partsUsed && ticket.partsUsed.length > 0 && (
                      <p className="text-emerald-900 pt-1 border-t border-emerald-200/80">
                        <strong className="font-bold">Replaced / Tested Components:</strong>{' '}
                        {ticket.partsUsed.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {serviceRequests.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Service Tickets Logged</h3>
              <p className="text-sm max-w-sm mx-auto leading-relaxed">
                If you are experiencing camera offline issues, recording errors, or fiber damage, book a certified technician ticket now.
              </p>
              <button
                onClick={onRequestNewService}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
              >
                Book Service Ticket
              </button>
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
