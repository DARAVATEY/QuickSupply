
import React from 'react';
import { Supplier } from '../types';

interface SupplierCardProps {
  supplier: Supplier;
  onManage?: () => void;
  onInfo?: () => void;
  onContact?: () => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onManage, onInfo, onContact }) => {
  const firstProduct = supplier.products[0];

  return (
    <div className={`bg-white rounded-[32px] overflow-hidden border transition-all duration-500 group flex flex-col h-full ${
      supplier.isOwner ? 'border-indigo-200 shadow-xl shadow-indigo-500/5' : 'border-slate-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10'
    }`}>
      {/* Visual Header */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={supplier.imageUrl} 
          alt={supplier.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
        
        {/* Rating or Owner Floating Label */}
        {supplier.isOwner ? (
          <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest shadow-xl">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            My Listing
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-black text-slate-800 shadow-xl">
            <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {supplier.rating.toFixed(1)}
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex gap-2">
           {supplier.certifications.slice(0, 1).map(cert => (
              <span key={cert} className="bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                {cert}
              </span>
           ))}
        </div>
      </div>
      
      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{supplier.category}</div>
          <h3 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
            {supplier.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {supplier.location}
          </div>
        </div>

        {/* Price and MOQ Specs */}
        <div className="flex gap-4 mb-4 py-3 border-y border-slate-50">
          <div className="flex-1">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price Start</div>
            <div className="text-sm font-black text-slate-800">{firstProduct?.price || 'Contact'}</div>
          </div>
          <div className="flex-1">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">MOQ</div>
            <div className="text-sm font-black text-slate-800">{firstProduct?.moq || 'None'}</div>
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
          {supplier.description}
        </p>

        <div className="mt-auto space-y-6">
          <div className="flex flex-wrap gap-2">
            {supplier.products.slice(0, 3).map(p => (
              <span key={p.id} className="text-[10px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                {p.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={supplier.isOwner ? onManage : onContact}
              className={`py-3 px-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 ${
              supplier.isOwner ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}>
              {supplier.isOwner ? 'Manage' : 'Contact'}
            </button>
            <button 
              onClick={onInfo}
              className="py-3 px-4 bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
            >
              Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;
