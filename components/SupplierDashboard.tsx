
import React from 'react';
import { Supplier } from '../types';
import SupplierCard from './SupplierCard';

interface SupplierDashboardProps {
  username: string; // This now holds the company name passed from App.tsx
  email: string;
  myListings: Supplier[];
  onAddListing: () => void;
  onEditListing: (s: Supplier) => void;
  onViewInfo: (s: Supplier) => void;
  onLogout: () => void;
}

const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ 
  username, 
  email, 
  myListings, 
  onAddListing, 
  onEditListing,
  onViewInfo,
  onLogout
}) => {
  return (
    <div className="container mx-auto px-4 py-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900 rounded-[40px] p-10 md:p-16 mb-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
              Verified Factory Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Welcome back, {username}</h1>
            <p className="text-slate-400 font-medium">{email}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onLogout}
              className="px-6 py-5 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-all active:scale-95"
            >
              Logout
            </button>
            <button 
              onClick={onAddListing}
              className="px-8 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Catalog Items</div>
          <div className="text-3xl font-black text-slate-900">{myListings.length}</div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Global Profile Views</div>
          <div className="text-3xl font-black text-slate-900">0</div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fulfillment Inquiries</div>
          <div className="text-3xl font-black text-slate-900">0</div>
        </div>
      </div>

      <div id="my-listings-section" className="mb-20 scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Stored Inventory</h2>
          <div className="h-px bg-slate-100 flex-grow mx-8"></div>
        </div>
        {myListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myListings.map(s => (
              <SupplierCard key={s.id} supplier={s} onManage={() => onEditListing(s)} onInfo={() => onViewInfo(s)} />
            ))}
          </div>
        ) : (
          <div className="bg-white py-20 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
            <h3 className="text-xl font-black text-slate-800 mb-2">Empty Showroom</h3>
            <button onClick={onAddListing} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all active:scale-95">Add Your First Product</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
