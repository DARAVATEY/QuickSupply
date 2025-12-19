
import React, { useState } from 'react';
import { Supplier, Product } from '../types';

interface SupplierInfoModalProps {
  supplier: Supplier | null;
  onClose: () => void;
  onProductClick?: (product: Product) => void;
  isProductView?: boolean;
  onBackToCompany?: () => void;
  onContact?: (supplier: Supplier) => void;
}

const SupplierInfoModal: React.FC<SupplierInfoModalProps> = ({ 
  supplier, 
  onClose, 
  onProductClick,
  isProductView = false,
  onBackToCompany,
  onContact
}) => {
  const [isContactRevealed, setIsContactRevealed] = useState(false);

  if (!supplier) return null;

  // Helper to handle single product data if in product view
  const firstProduct = supplier.products[0];

  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Navigation / Close Header Overlay */}
      <div className="absolute top-6 left-6 right-6 z-30 flex justify-between items-center pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          {isProductView && (
            <button 
              onClick={onBackToCompany}
              className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 text-white rounded-2xl transition-all active:scale-95 flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Company
            </button>
          )}
        </div>
        
        <button 
          onClick={onClose} 
          className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 text-white rounded-full transition-all active:scale-90"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar">
        {/* Full Width Hero */}
        <div className="relative h-[60vh] md:h-[70vh] w-full">
          <img 
            src={supplier.imageUrl} 
            className="w-full h-full object-cover" 
            alt={`${supplier.name} Profile`} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent"></div>
          <div className="absolute bottom-12 left-8 md:left-20 right-8 md:left-20">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-blue-500/20">
                {isProductView ? 'Featured Item' : 'Verified Facility'}
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                {supplier.industry}
              </span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
              {supplier.name}
            </h2>
            <div className="flex items-center gap-3 text-white/70 text-lg md:text-xl font-bold">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {supplier.location}, Cambodia
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 md:px-20 py-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-20">
            {/* Description Section */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                  {isProductView ? 'Detailed Specifications' : 'Company Overview'}
                </h3>
              </div>
              <p className="text-2xl md:text-3xl text-slate-700 leading-snug font-medium whitespace-pre-line">
                {supplier.description}
              </p>
            </section>

            {/* Aggregated Products - only if not in single product view */}
            {!isProductView && (
              <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Product Ecosystem</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {supplier.products.map((product, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => onProductClick?.(product)}
                      className="group p-8 bg-slate-50 hover:bg-white rounded-[40px] border border-slate-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white group-hover:bg-blue-600 rounded-3xl flex items-center justify-center text-blue-600 group-hover:text-white transition-all shadow-sm">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-slate-900 font-black text-2xl block mb-1">{product.name}</span>
                          <span className="text-xs text-blue-500 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {isProductView && (
              <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 p-12 bg-slate-50 rounded-[50px] border border-slate-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-1 bg-green-500 rounded-full"></div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Commercial Stats</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="p-8 bg-white rounded-[32px] shadow-sm">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Target Price Point</div>
                    <div className="text-4xl font-black text-slate-900">{firstProduct?.price || 'Inquiry Only'}</div>
                  </div>
                  <div className="p-8 bg-white rounded-[32px] shadow-sm">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Minimum Wholesale Volume</div>
                    <div className="text-4xl font-black text-slate-900">{firstProduct?.moq || 'No MOQ'}</div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Fixed Right Sidebar for Trust & Contact */}
          <div className="space-y-12">
            <div className="bg-slate-900 rounded-[50px] p-12 text-white space-y-10 shadow-3xl shadow-slate-900/40">
              {!isProductView && (
                <>
                  <div className="space-y-3">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Performance Score</div>
                    <div className="text-5xl font-black text-white flex items-center gap-4">
                      {supplier.rating.toFixed(1)}
                      <svg className="w-10 h-10 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div className="pt-10 border-t border-slate-800">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Accreditations</div>
                    <div className="flex flex-wrap gap-3">
                      {supplier.certifications.map(cert => (
                        <span key={cert} className="bg-blue-600/20 text-blue-400 text-xs font-black px-4 py-2.5 rounded-2xl border border-blue-500/20 uppercase tracking-widest">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {isProductView && (
                <div className="space-y-8">
                  <h4 className="text-2xl font-black text-blue-400 leading-tight">Ready for export fulfillment.</h4>
                  <p className="text-lg text-slate-400 font-medium leading-relaxed">
                    This unit has passed internal quality controls and is available for immediate global shipping inquiry.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-600 rounded-[50px] p-12 text-white shadow-3xl shadow-blue-600/30">
              <h4 className="text-2xl font-black mb-6">Direct Sourcing</h4>
              <p className="text-blue-100 text-lg font-medium mb-10 leading-relaxed">
                Skip the middlemen. Connect directly with the factory export manager.
              </p>
              
              {!isContactRevealed ? (
                <button 
                  onClick={() => setIsContactRevealed(true)}
                  className="w-full py-6 bg-white text-blue-600 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-900 hover:text-white transition-all shadow-2xl active:scale-95"
                >
                  Request Access
                </button>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="p-6 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
                    <div className="text-lg font-black text-white break-all text-center">{supplier.contactEmail}</div>
                  </div>
                  <button 
                    onClick={() => onContact?.(supplier)}
                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl active:scale-95"
                  >
                    Start Conversation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierInfoModal;
