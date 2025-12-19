
import React from 'react';

interface BuyerBottomNavProps {
  currentView: string;
  onViewExplore: () => void;
  onViewProfile: () => void;
}

const BuyerBottomNav: React.FC<BuyerBottomNavProps> = ({ 
  currentView, 
  onViewExplore, 
  onViewProfile 
}) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-full p-2 flex items-center justify-between gap-2 ring-1 ring-slate-900/5">
        <button 
          onClick={onViewExplore}
          className={`flex-1 py-4 px-6 rounded-full font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
            currentView === 'buyer' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explore
        </button>

        <button 
          onClick={onViewProfile}
          className={`flex-1 py-4 px-6 rounded-full font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
            currentView === 'buyer_profile' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </button>
      </div>
    </div>
  );
};

export default BuyerBottomNav;
