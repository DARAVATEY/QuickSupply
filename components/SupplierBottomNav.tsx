
import React from 'react';

interface SupplierBottomNavProps {
  currentView: string;
  onViewDashboard: () => void;
  onViewMarket: () => void;
  onAddProduct: () => void;
  onOpenDossier: () => void;
}

const SupplierBottomNav: React.FC<SupplierBottomNavProps> = ({ 
  currentView, 
  onViewDashboard, 
  onViewMarket, 
  onOpenDossier
}) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-lg animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-full p-2 flex items-center justify-between gap-2 ring-1 ring-slate-900/5">
        <button 
          onClick={onOpenDossier}
          className={`flex-1 py-4 px-3 md:px-6 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
            currentView.includes('profile') 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Dossier</span>
          <span className="sm:hidden">Dossier</span>
        </button>

        <button 
          onClick={onViewDashboard}
          className={`flex-1 py-4 px-3 md:px-6 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
            currentView === 'supplier_dashboard' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Admin</span>
        </button>
        
        <button 
          onClick={onViewMarket}
          className={`flex-1 py-4 px-3 md:px-6 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
            currentView === 'buyer' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Explore</span>
          <span className="sm:hidden">Explore</span>
        </button>
      </div>
    </div>
  );
};

export default SupplierBottomNav;
