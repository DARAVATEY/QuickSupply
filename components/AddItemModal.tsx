
import React, { useState, useRef, useEffect } from 'react';
import { Industry, Supplier, Product } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  initialData?: Supplier;
  onClose: () => void;
  onSubmit: (item: Partial<Supplier>) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    industry: Industry.GarmentTextile,
    category: '',
    description: '',
    products: [],
    location: 'Phnom Penh',
    imageUrl: '',
  });

  const [productNameInput, setProductNameInput] = useState('');
  const [productPriceInput, setProductPriceInput] = useState('');
  const [productMoqInput, setProductMoqInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        name: '',
        industry: Industry.GarmentTextile,
        category: '',
        description: '',
        products: [],
        location: 'Phnom Penh',
        imageUrl: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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

  const addProduct = () => {
    if (productNameInput) {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        // Added supplier_id to satisfy Product type requirements.
        // It will be correctly associated during the final save in App.tsx
        supplier_id: formData.id || '',
        name: productNameInput,
        description: '',
        price: productPriceInput || 'Contact for price',
        moq: productMoqInput || 'N/A',
        category: formData.category || 'General',
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158']
      };
      setFormData({ ...formData, products: [...(formData.products || []), newProduct] });
      setProductNameInput('');
      setProductPriceInput('');
      setProductMoqInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Determine if this is an Edit or a New Add (pre-filled from Dossier)
  const isEditingExisting = initialData && initialData.id && initialData.id.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 max-h-[90vh] flex flex-col">
        <div className="p-8 md:p-10 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {isEditingExisting ? 'Edit Listing' : 'Add New Listing'}
              </h2>
              <p className="text-slate-500">Update your factory profile or specific product details.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cover Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-48 w-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
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
                    <p className="text-slate-400 text-xs font-bold">Upload cover photo</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Supplier Name</label>
                <input required type="text" className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none transition-all" placeholder="e.g. Mekong Silk" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Industry</label>
                <select className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none appearance-none cursor-pointer" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value as Industry})}>
                  {Object.values(Industry).map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <input required type="text" className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none" placeholder="e.g. Raw Silk" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Catalog</label>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none text-sm" placeholder="Product Name..." value={productNameInput} onChange={(e) => setProductNameInput(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" className="px-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl outline-none text-sm" placeholder="Price..." value={productPriceInput} onChange={(e) => setProductPriceInput(e.target.value)} />
                  <input type="text" className="px-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl outline-none text-sm" placeholder="MOQ..." value={productMoqInput} onChange={(e) => setProductMoqInput(e.target.value)} />
                </div>
                <button type="button" onClick={addProduct} className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 text-xs uppercase tracking-widest">Add Product</button>
              </div>
              <div className="space-y-2">
                {formData.products?.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <div>
                      <span className="text-sm font-black text-slate-700 block">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{p.price} | {p.moq}</span>
                    </div>
                    <button type="button" onClick={() => setFormData({...formData, products: formData.products?.filter(item => item.id !== p.id)})} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
              {isEditingExisting ? 'Update Profile' : 'Confirm Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
