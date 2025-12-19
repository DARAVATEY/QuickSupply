
import React, { useState, useEffect, useRef } from 'react';
import { Supplier, Industry } from '../types';

interface DossierModalProps {
  isOpen: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSubmit: (updates: Partial<Supplier>) => void;
}

const DossierModal: React.FC<DossierModalProps> = ({ isOpen, supplier, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    industry: Industry.GarmentTextile,
    category: '',
    location: '',
    description: '',
    imageUrl: '',
    establishedYear: undefined,
    employeeCount: '',
    factorySize: '',
    productionCapacity: '',
    businessType: '',
    exportMarkets: [],
  });

  const [marketInput, setMarketInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        industry: supplier.industry || Industry.GarmentTextile,
        category: supplier.category || '',
        location: supplier.location || '',
        description: supplier.description || '',
        imageUrl: supplier.imageUrl || '',
        establishedYear: supplier.establishedYear,
        employeeCount: supplier.employeeCount || '',
        factorySize: supplier.factorySize || '',
        productionCapacity: supplier.productionCapacity || '',
        businessType: supplier.businessType || '',
        exportMarkets: supplier.exportMarkets || [],
      });
    }
  }, [supplier, isOpen]);

  if (!isOpen || !supplier) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMarket = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && marketInput.trim()) {
      e.preventDefault();
      if (!formData.exportMarkets?.includes(marketInput.trim())) {
        setFormData({
          ...formData,
          exportMarkets: [...(formData.exportMarkets || []), marketInput.trim()]
        });
      }
      setMarketInput('');
    }
  };

  const removeMarket = (market: string) => {
    setFormData({
      ...formData,
      exportMarkets: formData.exportMarkets?.filter(m => m !== market)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 max-h-[90vh] flex flex-col">
        <div className="p-8 md:p-10 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Factory Profile</h2>
              <p className="text-slate-500 text-sm">Update your company identity and industrial metadata.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 pb-10">
            {/* Identity Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Public Identity</h3>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-48 w-full border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                  formData.imageUrl ? 'border-blue-500' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-black uppercase">Change Photo</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-400 text-xs font-bold">Upload facility photo</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Company Name</label>
                  <input required type="text" className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none transition-all font-bold" placeholder="e.g. Phnom Penh Silk" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Industry</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none appearance-none cursor-pointer font-bold" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value as Industry})}>
                    {Object.values(Industry).map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Category</label>
                  <input required type="text" className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none font-bold" placeholder="e.g. Accessories" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Location</label>
                  <input required type="text" className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none font-bold" placeholder="e.g. Siem Reap" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Company Bio</label>
                  <textarea rows={3} className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none font-medium text-sm leading-relaxed" placeholder="Describe your heritage and capabilities..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Industrial Metadata Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">B2B Metadata</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Established</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none font-bold" 
                    placeholder="2005"
                    value={formData.establishedYear || ''}
                    onChange={(e) => setFormData({...formData, establishedYear: parseInt(e.target.value) || undefined})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Business Type</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none font-bold" 
                    placeholder="e.g. Factory"
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Workforce</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none font-bold" 
                    placeholder="e.g. 250+"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Size (sqm)</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none font-bold" 
                    placeholder="e.g. 5,000"
                    value={formData.factorySize}
                    onChange={(e) => setFormData({...formData, factorySize: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Production Capacity</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none font-bold" 
                  placeholder="e.g. 15,000 pcs/mo"
                  value={formData.productionCapacity}
                  onChange={(e) => setFormData({...formData, productionCapacity: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Export Markets (Press Enter)</label>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none font-bold" 
                    placeholder="e.g. USA, Japan..."
                    value={marketInput}
                    onChange={(e) => setMarketInput(e.target.value)}
                    onKeyDown={handleAddMarket}
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.exportMarkets?.map(market => (
                      <span key={market} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold flex items-center gap-2 group">
                        {market}
                        <button type="button" onClick={() => removeMarket(market)} className="text-blue-300 hover:text-blue-600">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">
              Confirm & Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DossierModal;
