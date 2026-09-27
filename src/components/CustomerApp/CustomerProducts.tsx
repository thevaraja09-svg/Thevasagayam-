import React, { useState } from 'react';
import { Product } from '../../types';
import { Search, Filter, ShieldCheck, Tag, X, CheckCircle, Package, Layers, Info } from 'lucide-react';

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
    <div className="space-y-5 pb-12" id="customer-products-view">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Equipment & Hardware Catalogue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Authorized distributor for Hikvision, Dahua, Ubiquiti UniFi, and Western Digital Purple.
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model, brand, SKU (e.g. 4K AcuSense, U6-Pro, 8TB)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
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

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredProducts.map((product) => {
          const discountPercent = product.discountPrice
            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
            : 0;

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden p-3 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges */}
                <div className="h-36 rounded-xl overflow-hidden bg-slate-100 relative mb-2.5">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-sm">
                    {product.brand}
                  </span>
                  {discountPercent > 0 && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white shadow-sm">
                      -{discountPercent}%
                    </span>
                  )}
                  <span
                    className={`absolute bottom-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      product.stockQuantity > 5
                        ? 'bg-emerald-500 text-white'
                        : product.stockQuantity > 0
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Backorder'}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 font-mono uppercase">{product.sku}</p>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug mt-0.5">
                  {product.name}
                </h4>
              </div>

              {/* Price & Action */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {product.discountPrice ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-sm text-sky-700">
                        ${product.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-extrabold text-sm text-slate-900">
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
                  className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition text-xs font-semibold"
                  title="Request Quote"
                >
                  Quote
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="relative h-56 bg-slate-100 overflow-hidden">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 flex gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold">
                  {selectedProduct.brand}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold">
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <p className="text-xs text-slate-400 font-mono">SKU: {selectedProduct.sku}</p>
                <h3 className="text-lg font-black text-slate-900 leading-snug mt-0.5">
                  {selectedProduct.name}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-extrabold text-sky-700">
                    ${(selectedProduct.discountPrice || selectedProduct.price).toFixed(2)}
                  </span>
                  {selectedProduct.discountPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedProduct.stockQuantity} In Stock
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{selectedProduct.description}</p>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-medium block capitalize text-[10px]">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-semibold text-slate-800">{val}</span>
                    </div>
                  ))}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[10px]">Warranty Period</span>
                    <span className="font-semibold text-emerald-700">{selectedProduct.warrantyMonths} Months Hardware Replacement</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
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
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition flex items-center gap-1.5"
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
