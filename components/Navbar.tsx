
import React from 'react';

interface NavbarProps {
  onHome: () => void;
  onBecomeSupplier: () => void;
  onBecomeBuyer: () => void;
  onBuyerProfile: () => void;
  currentMode: string;
  isRegisteredSupplier?: boolean;
  isLoggedInBuyer?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onHome, onBecomeSupplier, onBecomeBuyer, onBuyerProfile, currentMode, isRegisteredSupplier, isLoggedInBuyer }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onHome}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
            Q
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 tracking-tight leading-none mb-0.5">
              QuickSupply
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Official B2B Portal
            </span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <button onClick={onBecomeBuyer} className={`text-sm font-black uppercase tracking-widest transition-colors ${currentMode === 'buyer' ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}>
            Buyer Directory
          </button>
          
          {/* Only show Supplier Hub if NOT a logged in buyer */}
          {!isLoggedInBuyer && (
            <button onClick={onBecomeSupplier} className={`text-sm font-black uppercase tracking-widest transition-colors ${currentMode.includes('supplier') ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}>
              {isRegisteredSupplier ? 'My Dashboard' : 'Supplier Hub'}
            </button>
          )}

          {isLoggedInBuyer && (
            <button onClick={onBuyerProfile} className={`text-sm font-black uppercase tracking-widest transition-colors ${currentMode === 'buyer_profile' ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}>
              My Profile
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isRegisteredSupplier && !isLoggedInBuyer && (
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl cursor-pointer" onClick={onBecomeSupplier}>
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Supplier active</span>
            </div>
          )}
          {isLoggedInBuyer && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-100 transition-colors" onClick={onBuyerProfile}>
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Buyer Mode</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
