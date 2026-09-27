import React from 'react';
import { Quotation, Invoice, AppSettings } from '../types';
import { Printer, Download, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DigiHubLogo } from './DigiHubLogo';

interface PDFModalProps {
  type: 'quotation' | 'invoice';
  data: Quotation | Invoice;
  settings: AppSettings;
  onClose: () => void;
}

export const PDFModal: React.FC<PDFModalProps> = ({ type, data, settings, onClose }) => {
  const isQuote = type === 'quotation';
  const quote = isQuote ? (data as Quotation) : null;
  const invoice = !isQuote ? (data as Invoice) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none">
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              Official Document
            </span>
            <span className="font-semibold text-sm">
              {isQuote ? `Quotation: ${quote?.quotationNumber}` : `Tax Invoice: ${invoice?.invoiceNumber}`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body (Printable Paper Style) */}
        <div className="p-8 sm:p-10 overflow-y-auto bg-white font-sans text-slate-800 print:p-8" id="printable-doc">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <DigiHubLogo size="lg" />
              <p className="text-xs text-slate-500 mt-2 font-medium max-w-sm">{settings.slogan}</p>
              <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                <p>{settings.address}</p>
                <p>Phone: {settings.phone} | WA: {settings.whatsapp}</p>
                <p>Email: {settings.email}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 bg-slate-100 text-slate-700">
                {isQuote ? 'COMMERCIAL ESTIMATE' : 'OFFICIAL TAX INVOICE'}
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isQuote ? quote?.quotationNumber : invoice?.invoiceNumber}
              </h2>
              <div className="text-xs text-slate-500 mt-2 space-y-1">
                <p>
                  <span className="font-semibold text-slate-700">Date Issued:</span>{' '}
                  {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                {isQuote && (
                  <p>
                    <span className="font-semibold text-slate-700">Valid Until:</span>{' '}
                    {new Date(quote!.validityDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
                {!isQuote && (
                  <>
                    <p>
                      <span className="font-semibold text-slate-700">Payment Due:</span>{' '}
                      {new Date(invoice!.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Status: {invoice?.paymentStatus}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Customer Bill-To Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Prepared For / Client:</p>
              <h3 className="font-bold text-slate-900 text-base">{data.customerName}</h3>
              <p className="text-xs text-slate-600 mt-1">{data.customerAddress || 'Client Location on File'}</p>
              <p className="text-xs text-slate-600 mt-0.5">Phone: {data.customerPhone || 'N/A'}</p>
              <p className="text-xs text-slate-600">{data.customerEmail}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Project Classification:</p>
              <p className="text-xs font-semibold text-slate-800">CCTV & Network Solutions Deployment</p>
              <p className="text-xs text-slate-500 mt-1">Contractor License: DH-SEC-NET-9941</p>
              <p className="text-xs text-slate-500">Security Grade: Commercial / Enterprise High Assurance</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">#</th>
                  <th className="py-3 px-2">Item Description / Equipment & Service</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.items.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-2 text-slate-400 font-medium">{index + 1}</td>
                    <td className="py-3.5 px-2 font-semibold text-slate-800 max-w-xs">{item.description}</td>
                    <td className="py-3.5 px-2 text-center text-slate-700">{item.quantity}</td>
                    <td className="py-3.5 px-2 text-right text-slate-700">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6 mt-6">
            <div className="sm:max-w-xs text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Notes & Terms:</p>
              <p>{isQuote ? quote?.termsAndConditions : invoice?.notes}</p>
              {isQuote && quote?.notes && (
                <p className="mt-2 text-sky-700 bg-sky-50 p-2 rounded border border-sky-100 font-medium">
                  {quote.notes}
                </p>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${data.subtotal.toFixed(2)}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Special Discount:</span>
                  <span className="font-semibold">-${data.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax ({settings.taxRatePercent}%):</span>
                <span className="font-semibold">${data.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2">
                <span>Grand Total:</span>
                <span className="text-sky-700">${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Official Verification Seal & Signatures */}
          <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 items-end">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-sky-600 flex items-center justify-center text-sky-600 flex-shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DIGI Hub Quality Guarantee</p>
                <p className="text-xs font-semibold text-slate-700">Certified Optical & Electronic Compliance</p>
                <p className="text-[10px] text-slate-500">Authorized Digital Dispatch Document</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 w-48 pb-1 mb-1">
                <span className="font-serif italic text-sm text-slate-700">David Sterling</span>
              </div>
              <p className="text-[11px] font-bold text-slate-800">Authorized Operations Director</p>
              <p className="text-[10px] text-slate-400">DIGI Hub — CCTV & Network Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
