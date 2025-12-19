
import React, { useState } from 'react';
import { Supplier, Product } from '../types';

interface ProductDetailViewProps {
  product: Product;
  supplier: Supplier;
  onBack: () => void;
  onContact: (supplier: Supplier) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, supplier, onBack, onContact }) => {
  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div className="bg-white min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-700 pb-32">
      {/* Sticky Top Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="px-6 py-2.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-full transition-all active:scale-95 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            Back to {supplier.name}
          </button>
          
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200">
                <img src={supplier.imageUrl} className="w-full h-full object-cover" alt={supplier.name} />
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-slate-400">Authentic Factory SKU</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-8">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden bg-slate-50 shadow-3xl ring-1 ring-slate-100">
              <img src={activeImage} className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-1000" alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(img)} className={`shrink-0 w-32 h-32 rounded-3xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-600 scale-95 shadow-xl' : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'}`}>
                    <img src={img} className="w-full h-full object-cover" alt={`${product.name} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col pt-4">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">In Stock & Verified</span>
                <span className="px-4 py-2 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{product.category}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">{product.name}</h1>
              <div className="flex items-center gap-4 text-slate-400">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                <span className="text-xl font-bold">Fulfillment from {supplier.location}, Cambodia</span>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-6"><div className="w-12 h-1 bg-blue-600 rounded-full"></div><h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Item Intelligence</h3></div>
                <p className="text-2xl md:text-3xl text-slate-600 leading-relaxed font-medium">{product.description}</p>
              </section>
              <div className="grid grid-cols-2 gap-8 p-12 bg-slate-900 rounded-[40px] text-white shadow-2xl">
                <div><div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Factory Pricing</div><div className="text-4xl font-black text-blue-400">{product.price}</div></div>
                <div><div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Min. Commitment</div><div className="text-4xl font-black text-white">{product.moq}</div></div>
              </div>
              <div className="pt-10">
                <button onClick={() => onContact(supplier)} className="w-full py-10 bg-blue-600 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-900 transition-all shadow-3xl shadow-blue-500/20 active:scale-95 flex flex-col items-center justify-center gap-2 group">
                  <span className="flex items-center gap-3">Request Quote for {product.name}<svg className="w-5 h-5 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
                  <span className="text-[9px] opacity-60 font-black">Direct Factory Connection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
