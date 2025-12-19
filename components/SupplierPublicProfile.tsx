
import React from 'react';
import { Supplier, Product } from '../types';

interface SupplierPublicProfileProps {
  supplier: Supplier;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onContact: (supplier: Supplier) => void;
  isOwnerView?: boolean;
  onEditDossier?: () => void;
}

const SupplierPublicProfile: React.FC<SupplierPublicProfileProps> = ({ 
  supplier, 
  onBack, 
  onProductClick, 
  onContact,
  isOwnerView = false,
  onEditDossier
}) => {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-1000 pb-24">
      {/* Floating Header */}
      <div className="fixed top-24 left-6 right-6 z-50 flex justify-between items-center pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 text-white rounded-full transition-all active:scale-95 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] shadow-2xl"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          {isOwnerView ? 'Return to Dashboard' : 'Back to Directory'}
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <img 
          src={supplier.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200'} 
          className="w-full h-full object-cover" 
          alt={supplier.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-20 left-8 md:left-24 right-8">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
              {isOwnerView ? 'My Company Dossier' : 'Verified Partner'}
            </span>
            <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {supplier.industry}
            </span>
            {supplier.businessType && (
              <span className="px-5 py-2.5 bg-indigo-600/40 backdrop-blur-md border border-indigo-400/30 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                {supplier.businessType}
              </span>
            )}
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none mb-6">
            {supplier.name}
          </h1>
          <div className="flex items-center gap-4 text-white/80 text-xl font-bold">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {supplier.location}, Cambodia
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-24 py-32 grid grid-cols-1 lg:grid-cols-3 gap-32">
        <div className="lg:col-span-2 space-y-32">
          
          {/* Corporate Profile Section */}
          <section>
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Corporate Profile</h3>
               </div>
               {isOwnerView && (
                  <button onClick={onEditDossier} className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all">Update Identity</button>
               )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
               <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry & Sector</div>
                  <div className="text-2xl font-black text-slate-900">{supplier.industry} - {supplier.category}</div>
               </div>
               <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Registered Type</div>
                  <div className="text-2xl font-black text-slate-900">{supplier.businessType || 'Manufacturer'}</div>
               </div>
            </div>

            <p className="text-3xl md:text-5xl text-slate-800 leading-tight tracking-tight font-medium">
              {supplier.description || 'Welcome to our official dossier. We provide high-quality manufacturing solutions and are fully registered with the Ministry of Commerce, Cambodia.'}
            </p>
          </section>

          {/* Dossier B2B Statistics */}
          <section className="p-12 md:p-16 bg-slate-900 rounded-[60px] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
               <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
               </svg>
            </div>
            <div className="flex items-center justify-between mb-16 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Operational Stored Data</h3>
               </div>
               {isOwnerView && (
                  <button onClick={onEditDossier} className="px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-slate-900 transition-all">Edit Operational Info</button>
               )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 relative z-10">
              {[
                { label: 'Year Established', value: supplier.establishedYear || 'N/A', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: 'Personnel Count', value: supplier.employeeCount || 'N/A', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                { label: 'Factory Area', value: supplier.factorySize || 'N/A', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { label: 'Monthly Output', value: supplier.productionCapacity || 'N/A', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-6 p-8 bg-white/5 backdrop-blur-lg rounded-[32px] border border-white/10">
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-[22px] flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{stat.label}</div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                  </div>
                </div>
              ))}
              
              <div className="sm:col-span-2 p-8 bg-white/5 backdrop-blur-lg rounded-[32px] border border-white/10">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Export Compliance Footprint</div>
                 <div className="flex flex-wrap gap-2">
                    {supplier.exportMarkets && supplier.exportMarkets.length > 0 ? supplier.exportMarkets.map(market => (
                      <span key={market} className="px-5 py-2.5 bg-blue-500/20 border border-blue-500/20 rounded-2xl text-xs font-black text-blue-300 uppercase tracking-widest">
                        {market}
                      </span>
                    )) : <span className="text-slate-500 text-xs font-medium italic">Domestic Market only. Update dossier for export activation.</span>}
                 </div>
              </div>
            </div>
          </section>

          {/* Factory Showroom */}
          <section>
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Factory Showroom</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {supplier.products.length > 0 ? supplier.products.map((product) => (
                <button 
                  key={product.id} 
                  onClick={() => onProductClick(product)}
                  className="group relative h-[400px] overflow-hidden rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col active:scale-[0.98]"
                >
                  <img src={product.images[0]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <div className="relative mt-auto p-8 text-white text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 block">{product.category}</span>
                    <h4 className="text-2xl font-black mb-4 line-clamp-1">{product.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 w-fit group-hover:bg-blue-600 transition-colors">
                      View Catalog Item
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              )) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[50px]">
                   <p className="text-slate-400 font-bold mb-4 italic">No products currently displayed in the dossier showroom.</p>
                   {isOwnerView && (
                     <p className="text-slate-400 text-xs">Add items from your main dashboard to populate this section.</p>
                   )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-16 lg:sticky lg:top-32 h-fit">
          <div className="bg-slate-50 rounded-[60px] p-12 space-y-12 border border-slate-100 shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Quality Audit</div>
              <div className="text-8xl font-black text-slate-900 flex items-center gap-4">
                {supplier.rating.toFixed(1)}
                <svg className="w-14 h-14 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <div className="pt-10 border-t border-slate-200">
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Factory Certifications</div>
              <div className="flex flex-wrap gap-3">
                {supplier.certifications.length > 0 ? supplier.certifications.map(cert => (
                  <span key={cert} className="bg-slate-900 text-white text-[10px] font-black px-6 py-3 rounded-2xl uppercase tracking-widest">
                    {cert}
                  </span>
                )) : <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest italic">Compliance Validation Pending</span>}
              </div>
            </div>
          </div>

          {!isOwnerView ? (
            <button 
              onClick={() => onContact(supplier)}
              className="w-full py-12 bg-blue-600 text-white rounded-[40px] font-black uppercase tracking-[0.3em] text-sm hover:bg-slate-900 transition-all shadow-3xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-4"
            >
              Request Quote
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          ) : (
            <div className="p-12 bg-blue-50 rounded-[60px] border border-blue-100 text-center">
               <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               </div>
               <p className="text-blue-700 font-black uppercase tracking-[0.2em] text-[11px] mb-6">Dossier Storage Active</p>
               <p className="text-slate-600 text-base font-medium leading-relaxed mb-8">Your company's B2B profile is securely stored and visible to international procurement agents.</p>
               <button onClick={onEditDossier} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">Modify Stored Profile</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierPublicProfile;
