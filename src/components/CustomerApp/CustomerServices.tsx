import React, { useState } from 'react';
import { ServiceItem } from '../../types';
import { Search, Shield, Wrench, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

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
    <div className="space-y-5 pb-12" id="customer-services-view">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Professional Services & Solutions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Certified engineering deployments, ongoing maintenance SLAs, and fiber optic cabling.
        </p>
      </div>

      {/* Search & Filter Chips */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CCTV installation, fiber optics, intercoms..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
          >
            <div className="sm:w-44 h-36 sm:h-auto rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-sm">
                {service.category}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{service.name}</h3>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-medium text-slate-400 block">Starting from</span>
                    <span className="text-base font-black text-sky-700">${service.startingPrice}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{service.description}</p>

                {/* Service Features Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {service.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onRequestQuote(service.name)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Request Quotation
                </button>
                <button
                  onClick={() => onRequestService(service.name)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                  Book Service Ticket
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No services matching "{searchQuery}". Try selecting another category or clear the search filter.
          </div>
        )}
      </div>
    </div>
  );
};
