import React, { useState } from 'react';
import { ServiceItem } from '../../types';
import {
  Search,
  Shield,
  Wrench,
  CheckCircle2,
  ChevronRight,
  Filter,
  Sparkles,
  Clock,
  CheckCircle,
  HelpCircle,
  X,
  PhoneCall,
} from 'lucide-react';

interface CustomerServicesProps {
  services: ServiceItem[];
  onRequestQuote: (serviceName: string) => void;
  onRequestService: (serviceName: string) => void;
}

export const CustomerServices: React.FC<CustomerServicesProps> = ({
  services,
  onRequestQuote,
  onRequestService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories = ['All', 'CCTV Systems', 'Networking', 'Access Control', 'Security & Telecom'];

  const filteredServices = services.filter((s) => {
    const matchCat =
      selectedCategory === 'All' ||
      (selectedCategory === 'CCTV Systems' && s.category === 'CCTV') ||
      (selectedCategory === 'Networking' && s.category === 'Networking') ||
      (selectedCategory === 'Access Control' && s.category === 'Access Control') ||
      (selectedCategory === 'Security & Telecom' && s.category === 'Security');

    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 pb-16" id="customer-services-view">
      {/* Header with Generous Whitespace */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Turnkey Engineering Services & Deployments
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Professional Security & Network Solutions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From 4K Ultra HD AI camera arrays to optical fiber fusion splicing and server rack cabling, our certified engineering team delivers enterprise-grade reliability backed by on-site warranties.
        </p>
      </div>

      {/* Search & Filter Hub */}
      <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CCTV installation, fiber optics, server racks, intercoms, access control..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 hover:bg-white focus:bg-white transition shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-auto hidden sm:inline whitespace-nowrap">
            Showing {filteredServices.length} solutions
          </span>
        </div>
      </div>

      {/* Services List with Uncrowded Layout */}
      <div className="space-y-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-sky-300 transition-all p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 group"
          >
            {/* Service Image */}
            <div className="lg:w-72 h-52 lg:h-auto rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900/85 text-white backdrop-blur-md shadow-xs">
                {service.category}
              </span>
              <span className="absolute bottom-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/90 text-white backdrop-blur-sm flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Licensed SLA
              </span>
            </div>

            {/* Service Details */}
            <div className="flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
                    {service.name}
                  </h3>
                  <div className="sm:text-right flex-shrink-0">
                    <span className="text-xs font-medium text-slate-400 block">Starting installed price</span>
                    <span className="text-2xl font-black text-sky-700">${service.startingPrice}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {service.description}
                </p>

                {/* Structured Features Grid */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Included in this Deployment:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                    {service.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="font-medium text-slate-800">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Hub */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onRequestQuote(service.name)}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  Request Full Proposal
                </button>

                <button
                  onClick={() => onRequestService(service.name)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-bold border border-emerald-200 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  Book Field Technician
                </button>

                <button
                  onClick={() => setActiveModalService(service)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition ml-auto flex items-center gap-1 cursor-pointer"
                >
                  Specifications <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Services Found</h3>
            <p className="text-sm max-w-sm mx-auto leading-relaxed">
              We couldn't find any services matching "{searchQuery}". Try selecting "All" or clearing the search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="relative h-60 bg-slate-900 overflow-hidden">
              <img
                src={activeModalService.image}
                alt={activeModalService.name}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={() => setActiveModalService(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold">
                  {activeModalService.category}
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/75 text-white text-xs font-bold backdrop-blur-sm">
                  Starting from ${activeModalService.startingPrice}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeModalService.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  {activeModalService.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Engineering Scope of Work
                </h4>
                <div className="space-y-2.5">
                  {activeModalService.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-slate-900 font-bold block">{feat}</strong>
                        <span className="text-slate-500 text-xs">
                          Installed and tested to strict commercial compliance standards.
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalService(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const name = activeModalService.name;
                    setActiveModalService(null);
                    onRequestQuote(name);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  Request Proposal for this Solution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
