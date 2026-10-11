import React, { useState } from 'react';
import { Product } from '../../types';
import {
  Search,
  Filter,
  ShieldCheck,
  Tag,
  X,
  CheckCircle,
  Package,
  Layers,
  Info,
  Sparkles,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface CustomerProductsProps {
  products: Product[];
  onRequestQuote: (productName: string) => void;
}

export const CustomerProducts: React.FC<CustomerProductsProps> = ({ products, onRequestQuote }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    'All',
    'CCTV Cameras',
    'NVR & Storage',
    'Network Switches',
    'Wi-Fi & Routers',
    'Access & Intercom',
    'Cables & Power',
  ];

  const filteredProducts = products.filter((p) => {
    let catMatch = selectedCategory === 'All';
    if (selectedCategory === 'CCTV Cameras') catMatch = p.category === 'CCTV Cameras';
    if (selectedCategory === 'NVR & Storage') catMatch = p.category === 'NVR' || p.category === 'DVR' || p.category === 'Hard Drives';
    if (selectedCategory === 'Network Switches') catMatch = p.category === 'Network Switches';
    if (selectedCategory === 'Wi-Fi & Routers') catMatch = p.category === 'Wi-Fi' || p.category === 'Routers';
    if (selectedCategory === 'Access & Intercom') catMatch = p.category === 'Access Control' || p.category === 'Intercoms' || p.category === 'Video Doorbells';
    if (selectedCategory === 'Cables & Power') catMatch = p.category === 'Cables' || p.category === 'Accessories';

    const searchMatch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    return catMatch && searchMatch;
  });

  return (
    <div className="space-y-8 pb-16" id="customer-products-view">
      {/* Title & Scope */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Enterprise Certified Equipment & Hardware
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Surveillance & Networking Hardware Catalogue
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Authorized direct distributor for Hikvision, Dahua, Ubiquiti UniFi, and Western Digital Purple. All equipment carries 3-year factory warranty and local depot replacement support.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model, brand, SKU (e.g., 4K ColorVu, U6-Pro, 8TB WD Purple, PoE Switch)..."
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
            Showing {filteredProducts.length} items
          </span>
        </div>
      </div>

      {/* Products Grid with Uncrowded Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const discountPercent = product.discountPrice
            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
            : 0;

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden p-5 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Image Container with Badges */}
                <div className="h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900/85 text-white backdrop-blur-md shadow-xs">
                    {product.brand}
                  </span>
                  {discountPercent > 0 && (
                    <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-600 text-white shadow-xs">
                      -{discountPercent}%
                    </span>
                  )}
                  <span
                    className={`absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-xs flex items-center gap-1 ${
                      product.stockQuantity > 5
                        ? 'bg-emerald-600/90 text-white'
                        : product.stockQuantity > 0
                        ? 'bg-amber-600/90 text-white'
                        : 'bg-rose-600/90 text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Special Order'}
                  </span>
                </div>

                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">{product.sku}</p>

                <h4 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
                  {product.name}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {product.discountPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-lg text-sky-700">
                        ${product.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-black text-lg text-slate-900">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestQuote(product.name);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  Quote <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Equipment Matching Your Query</h3>
            <p className="text-sm max-w-sm mx-auto leading-relaxed">
              We couldn't find any products matching "{searchQuery}". Try selecting another category or resetting the search filter.
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

      {/* World-Class Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Image Header */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover opacity-95"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold">
                  {selectedProduct.brand}
                </span>
                <span className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold">
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
              <div>
                <p className="text-xs text-slate-400 font-mono">SKU: {selectedProduct.sku}</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mt-1">
                  {selectedProduct.name}
                </h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-2xl font-black text-sky-700">
                    ${(selectedProduct.discountPrice || selectedProduct.price).toFixed(2)}
                  </span>
                  {selectedProduct.discountPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedProduct.stockQuantity} In Stock (Immediate Dispatch)
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{selectedProduct.description}</p>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                  {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-medium block capitalize text-xs">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-bold text-slate-800">{val}</span>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium block text-xs">Warranty Guarantee</span>
                    <span className="font-bold text-emerald-700">
                      {selectedProduct.warrantyMonths} Months Advanced Hardware Replacement
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prodName = selectedProduct.name;
                    setSelectedProduct(null);
                    onRequestQuote(prodName);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Request Quotation for this Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
