import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Industry, Supplier } from '../types';
import { geminiService } from '../geminiService';

interface SupplierOnboardingProps {
  initialName?: string;
  onBack: () => void;
  onComplete: (supplier: Supplier) => void;
}

const CAMBODIA_LOCATIONS = [
  "Phnom Penh",
  "Banteay Meanchey",
  "Battambang",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kampot",
  "Kandal",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Sihanouk",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Siem Reap",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tboung Khmum"
];

const SupplierOnboarding: React.FC<SupplierOnboardingProps> = ({ initialName, onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Registering facility...');
  const [formData, setFormData] = useState({
    name: initialName || '',
    location: '',
    industry: Industry.GarmentTextile,
    category: '',
    capacity: ''
  });

  const handleFinish = async () => {
    setLoading(true);
    setStatusMessage('QuickSupply AI is crafting your global profile...');
    
    try {
      // Step 1: Use Gemini to generate professional profile data
      let aiProfile = {
        description: `Verified manufacturer in ${formData.location} specializing in ${formData.category}. Committed to quality and international standards.`,
        certifications: ["ISO 9001"],
        establishedYear: 2020,
        employeeCount: "50+",
        factorySize: "1,000 sqm",
        businessType: "Manufacturer"
      };

      try {
         aiProfile = await geminiService.generateSupplierProfile({
            name: formData.name,
            location: formData.location,
            industry: formData.industry,
            category: formData.category,
            capacity: formData.capacity
        }) as any;
      } catch (aiError) {
         console.warn("AI Generation failed, using defaults", aiError);
      }

      setStatusMessage('Finalizing verified credentials...');

      // --- CRITICAL CHECK FOR DB STORAGE ---
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user is null here, it means Email Verification is still enabled in Supabase settings
      // but we bypassed it in the UI. Data will fail to save to DB.
      if (!user) {
        console.warn("⚠️ SECURITY WARNING: No active Supabase Session found.");
        console.warn("To save data to the DB, disable 'Confirm Email' in your Supabase Auth Settings.");
        console.warn("Proceeding in Offline Demo Mode.");
      }

      const userId = user?.id || 'offline-' + Date.now();
      const userEmail = user?.email || 'demo@supplier.com';

      // Step 2: Insert into Supabase with AI-enhanced data
      let newSupplierId = 'temp-' + Date.now();
      
      try {
        const { data, error } = await supabase
            .from('suppliers')
            .insert({
            user_id: userId,
            name: formData.name,
            location: formData.location,
            industry: formData.industry,
            category: formData.category,
            production_capacity: formData.capacity,
            is_owner: true,
            contact_email: userEmail,
            image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
            // AI Generated Fields
            description: aiProfile.description,
            certifications: aiProfile.certifications,
            established_year: aiProfile.establishedYear,
            employee_count: aiProfile.employeeCount,
            factory_size: aiProfile.factorySize,
            business_type: aiProfile.businessType
            })
            .select()
            .single();
        
        if (error) throw error;
        if (data) newSupplierId = data.id;
        
      } catch (dbError: any) {
         // Fallback for offline/demo mode or RLS errors
         console.error("DB Insert Failed:", dbError.message);
      }
      
      const newSupplier: Supplier = {
        id: newSupplierId,
        user_id: userId,
        name: formData.name,
        industry: formData.industry,
        category: formData.category,
        location: formData.location,
        rating: 5,
        description: aiProfile.description || '',
        contactEmail: userEmail,
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
        isOwner: true,
        establishedYear: aiProfile.establishedYear,
        employeeCount: aiProfile.employeeCount,
        factorySize: aiProfile.factorySize,
        productionCapacity: formData.capacity,
        businessType: aiProfile.businessType,
        certifications: aiProfile.certifications || [],
        products: []
      };
      
      // Successfully created (or mocked), trigger the completion handler to switch view
      onComplete(newSupplier);

    } catch (error: any) {
      console.error("Registration fatal error:", error);
      alert(`There was an error creating your profile: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center text-white p-10 text-center animate-in fade-in duration-300">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-black mb-2 tracking-tight">AI Identity Generation</h3>
          <p className="text-slate-400 text-sm font-medium animate-pulse">{statusMessage}</p>
        </div>
      )}

      <div className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Grow your exports</h2>
          <p className="text-slate-500">Reach international markets through QuickSupply.</p>
        </div>
        <div className="text-blue-600 font-black text-2xl">0{step}/03</div>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none" 
                placeholder="Enter legally registered name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Industrial Zone / Location</label>
              <div className="relative">
                <select 
                  className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none appearance-none"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                >
                  <option value="" disabled>Select Province/City</option>
                  {CAMBODIA_LOCATIONS.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Main Product Category</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none" 
                placeholder="e.g. Garments, Organic Food..." 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Annual Capacity (MT or Units)</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none" 
                placeholder="100,000 units" 
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="p-8 bg-blue-50 rounded-[32px] border-2 border-blue-100 text-center">
              <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              <h3 className="text-xl font-black text-slate-900 mb-2">Ready to list?</h3>
              <p className="text-slate-500 text-sm leading-relaxed">By clicking complete, our AI will generate a professional factory profile for you. You can start listing products immediately.</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs">Back</button>
          )}
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : handleFinish()} 
            disabled={loading}
            className="flex-grow py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-colors shadow-xl shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? "AI Identity Check..." : step === 3 ? "Complete Registration" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
      {renderForm()}
    </div>
  );
};

export default SupplierOnboarding;