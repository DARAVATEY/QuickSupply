
import React, { useState, useMemo, useEffect } from 'react';
import { Supplier, Industry, Product } from './types';
import { MOCK_SUPPLIERS } from './data/suppliers';
import { geminiService } from './geminiService';
import { supabase } from './supabaseClient';

// Components
import Navbar from './components/Navbar';
import SupplierCard from './components/SupplierCard';
import ChatInterface from './components/ChatInterface';
import SupplierOnboarding from './components/SupplierOnboarding';
import AddItemModal from './components/AddItemModal';
import DossierModal from './components/DossierModal';
import SupplierLogin from './components/SupplierLogin';
import BuyerLogin from './components/BuyerLogin';
import BuyerProfile from './components/BuyerProfile';
import SupplierDashboard from './components/SupplierDashboard';
import SupplierBottomNav from './components/SupplierBottomNav';
import BuyerBottomNav from './components/BuyerBottomNav';
import ProductDetailView from './components/ProductDetailView';
import SupplierPublicProfile from './components/SupplierPublicProfile';

type ViewMode = 'landing' | 'buyer' | 'buyer_login' | 'buyer_profile' | 'supplier_login' | 'supplier_dashboard' | 'supplier_onboarding' | 'supplier_profile' | 'product_detail' | 'supplier_own_profile';

// Helper to check if an ID is a valid Postgres UUID
const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSector, setActiveSector] = useState<string>('All');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<Supplier | null>(null);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastViewBeforeDetail, setLastViewBeforeDetail] = useState<ViewMode>('buyer');

  const [matchingIds, setMatchingIds] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<{ name: string, reason: string }[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  
  const [isRegisteredSupplier, setIsRegisteredSupplier] = useState(false);
  const [isLoggedInBuyer, setIsLoggedInBuyer] = useState(false);
  
  const [supplierProfile, setSupplierProfile] = useState<{username: string, email: string} | null>(null);
  const [buyerProfile, setBuyerProfile] = useState<{username: string, email: string} | null>(null);

  const mapSupplierData = (s: any): Supplier => ({
    id: s.id,
    user_id: s.user_id,
    name: s.name,
    industry: s.industry,
    category: s.category,
    location: s.location,
    rating: Number(s.rating),
    description: s.description,
    contactEmail: s.contact_email,
    imageUrl: s.image_url,
    isOwner: s.is_owner,
    belongsToOwner: s.belongs_to_owner,
    establishedYear: s.established_year,
    employeeCount: s.employee_count,
    factorySize: s.factory_size,
    productionCapacity: s.production_capacity,
    businessType: s.business_type,
    exportMarkets: s.export_markets || [],
    certifications: s.certifications || [],
    products: s.products?.map((p: any) => ({
      id: p.id,
      supplier_id: p.supplier_id,
      name: p.name,
      description: p.description,
      price: p.price,
      moq: p.moq,
      category: p.category,
      images: p.images || []
    })) || []
  });

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      
      try {
        // Attempt to fetch from Supabase
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('*, products(*)');
        
        let loadedSuppliers = MOCK_SUPPLIERS;
        
        if (!supplierError && supplierData) {
          const mappedData: Supplier[] = supplierData.map(mapSupplierData);
          const dbIds = new Set(mappedData.map(d => d.id));
          loadedSuppliers = [...mappedData, ...MOCK_SUPPLIERS.filter(m => !dbIds.has(m.id))];
          setSuppliers(loadedSuppliers);
        } else if (supplierError) {
          console.warn("Using Offline Data due to connection error:", supplierError.message);
        }

        // Attempt to get Session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!sessionError && session) {
          const role = session.user.user_metadata?.role;
          const email = session.user.email!;
          const username = session.user.user_metadata?.username || email.split('@')[0];

          if (role === 'supplier') {
            setSupplierProfile({ username, email });
            setIsRegisteredSupplier(true);
            const hasFactory = loadedSuppliers.some(s => s.isOwner && s.user_id === session.user.id);
            if (hasFactory) {
              setViewMode('supplier_dashboard');
            } else {
              setViewMode('supplier_onboarding');
            }
          } else {
            setBuyerProfile({ username, email });
            setIsLoggedInBuyer(true);
            setViewMode('buyer');
          }
        }
      } catch (e) {
        console.warn("Offline Mode Active: Could not connect to backend.", e);
        // Fallback to MOCK_SUPPLIERS is already default state
      }

      setLoading(false);
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        // Only reset if we are not in a manual offline login session
        // (We don't strictly track offline session here, so this might trigger on load if offline, 
        // but handleLogout handles the explicit clear)
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*, products(*)');
      
      if (!error && data) {
        const mappedData: Supplier[] = data.map(mapSupplierData);
        setSuppliers(prev => {
          const dbIds = new Set(mappedData.map(d => d.id));
          return [...mappedData, ...MOCK_SUPPLIERS.filter(m => !dbIds.has(m.id))];
        });
      }
    } catch (e) {
      console.log("Fetch skipped (Offline Mode)");
    }
  };

  const myOwnDossier = useMemo(() => {
    // We check based on the current user's email or user_id if we have it
    return suppliers.find(s => s.isOwner && (s.contactEmail === supplierProfile?.email));
  }, [suppliers, supplierProfile]);

  const myListings = useMemo(() => 
    suppliers.filter(s => s.belongsToOwner && !s.isOwner && s.contactEmail === supplierProfile?.email), 
    [suppliers, supplierProfile]
  );

  // Determine the active supplier to show in profile view safely
  // If showing own profile, we Aggregate all dashboard listings into the products array
  // so the Dossier shows a full catalog, not just the company details.
  const activeProfileSupplier = useMemo(() => {
    if (viewMode === 'supplier_own_profile' && myOwnDossier) {
        // Convert independent "Listings" from dashboard into "Products" for the profile view
        const aggregatedProducts: Product[] = myListings.map(l => {
            const baseProduct = l.products[0];
            return {
                id: l.id, // Use listing ID
                supplier_id: myOwnDossier.id,
                name: l.name, // Use the Listing Name as the Product Name
                description: l.description,
                price: baseProduct?.price || 'Inquire',
                moq: baseProduct?.moq || 'N/A',
                category: l.category,
                images: [l.imageUrl, ...(baseProduct?.images?.slice(1) || [])]
            };
        });

        return {
            ...myOwnDossier,
            products: [...aggregatedProducts, ...myOwnDossier.products] // Merge aggregated items with any native items
        };
    }
    return selectedSupplier;
  }, [viewMode, myOwnDossier, selectedSupplier, myListings]);


  const handleSupplierLogin = (username: string, email: string) => {
    setSupplierProfile({ username, email });
    setIsRegisteredSupplier(true);
    setIsLoggedInBuyer(false);
    
    // Check if we have a local mock dossier matching this email
    const profileExists = suppliers.some(s => s.isOwner && s.contactEmail === email);
    setViewMode(profileExists ? 'supplier_dashboard' : 'supplier_onboarding');
  };

  const handleBuyerLogin = (username: string, email: string) => {
    setBuyerProfile({ username, email });
    setIsLoggedInBuyer(true);
    setIsRegisteredSupplier(false);
    setViewMode('buyer');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.log("Local signout");
    }
    setIsLoggedInBuyer(false);
    setIsRegisteredSupplier(false);
    setBuyerProfile(null);
    setSupplierProfile(null);
    setViewMode('landing');
  };

  const handleSupplierRegistrationComplete = (newSupplier: Supplier) => {
    setSuppliers(prev => [newSupplier, ...prev]);
    setIsRegisteredSupplier(true);
    setSupplierProfile(prev => prev ? { ...prev, username: newSupplier.name } : { username: newSupplier.name, email: newSupplier.contactEmail });
    setViewMode('supplier_dashboard');
    // Only try to fetch if we think we are online, otherwise we just trust the local state update above
    fetchData(); 
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsAddItemOpen(true);
  };

  const handleContactSupplier = (supplier: Supplier) => {
    const contextMsg = `Hello, I'm interested in your ${supplier.category} products. Could you provide more details about lead times and wholesale pricing?`;
    setChatRecipient(supplier);
    setChatInitialMessage(contextMsg);
    setChatOpen(true);
  };

  const handleExitDM = () => {
    setChatRecipient(null);
    setChatInitialMessage(null);
  };

  const handleOpenSupplierProfile = (name: string) => {
    const company = suppliers.find(s => s.name === name);
    if (company) {
      setSelectedSupplier(company);
      setViewMode('supplier_profile');
    }
  };

  const handleOpenProductDetail = (product: Product, supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSelectedProduct(product);
    setLastViewBeforeDetail(viewMode);
    setViewMode('product_detail');
  };

  const handleViewOwnProfile = () => {
    setViewMode('supplier_own_profile');
  };

  const handleAIMatch = async () => {
    if (!searchTerm) return;
    setIsMatching(true);
    setAiAnalysis([]);
    const result = await geminiService.matchSuppliers(searchTerm, suppliers.filter(s => !s.isOwner));
    setMatchingIds(result.ids);
    setAiAnalysis(result.analysis);
    setIsMatching(false);
    setViewMode('buyer');
    
    setTimeout(() => {
      document.getElementById('directory-main')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddNewItem = async (newItem: Partial<Supplier>) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // If offline/no user, create a fake ID
        const userId = user?.id || 'offline-user-' + Math.random();

        // If editingSupplier HAS an ID, we are updating an existing listing.
        // We must check if ID is a valid UUID before trying to update DB to avoid crashes with Mock data.
        if (editingSupplier && editingSupplier.id) {
          if (isValidUUID(editingSupplier.id)) {
            // Attempt DB update
            try {
                const { error: supplierError } = await supabase
                    .from('suppliers')
                    .update({
                    name: newItem.name,
                    industry: newItem.industry,
                    category: newItem.category,
                    description: newItem.description,
                    location: newItem.location,
                    image_url: newItem.imageUrl,
                    contact_email: newItem.contactEmail
                    })
                    .eq('id', editingSupplier.id);
                
                if (supplierError) throw supplierError;

                // Delete existing products for this listing before inserting updated ones
                await supabase.from('products').delete().eq('supplier_id', editingSupplier.id);
                
                if (newItem.products && newItem.products.length > 0) {
                    const productsToInsert = newItem.products.map(p => ({
                        supplier_id: editingSupplier.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        moq: p.moq,
                        category: p.category,
                        images: p.images || [] // Ensure array format for Postgres
                    }));
                    await supabase.from('products').insert(productsToInsert);
                }
            } catch (e) {
                console.warn("Offline/Mock update: Updating local state only.");
            }
          }

          // Update Local State (handles both Real and Mock)
          setSuppliers(prev => prev.map(s => {
            if (s.id === editingSupplier.id) {
                return { ...s, ...newItem, products: newItem.products as Product[] };
            }
            return s;
          }));

        } else {
            // New Insert (Add Product Flow)
            let newId = 'temp-' + Date.now();
            let dbSuccess = false;
            
            try {
                const { data, error } = await supabase
                    .from('suppliers')
                    .insert({
                    user_id: userId,
                    name: newItem.name || myOwnDossier?.name || 'Factory Listing',
                    industry: newItem.industry || Industry.GarmentTextile,
                    category: newItem.category || 'General',
                    location: newItem.location || 'Phnom Penh',
                    description: newItem.description || 'Verified market listing.',
                    contact_email: supplierProfile?.email || newItem.contactEmail || '',
                    image_url: newItem.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
                    is_owner: false,
                    belongs_to_owner: true
                    })
                    .select()
                    .single();
                
                if (error) throw error;
                if (data) {
                    newId = data.id;
                    dbSuccess = true;
                }
            } catch (e) {
                console.warn("Offline insert: Creating local item.");
            }

            // Only insert products if the parent supplier insert succeeded (so we have a valid foreign key)
            if (dbSuccess && newItem.products && newItem.products.length > 0) {
                 const productsToInsert = newItem.products.map(p => ({
                    supplier_id: newId,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    moq: p.moq,
                    category: p.category,
                    images: p.images || []
                }));
                await supabase.from('products').insert(productsToInsert);
            }

            const newProductEntry: Supplier = {
                id: newId,
                name: newItem.name || 'New Item',
                industry: newItem.industry || Industry.GarmentTextile,
                category: newItem.category || 'General',
                location: newItem.location || 'Phnom Penh',
                description: newItem.description || '',
                contactEmail: supplierProfile?.email || '',
                imageUrl: newItem.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
                isOwner: false,
                belongsToOwner: true,
                rating: 5,
                certifications: [],
                products: (newItem.products || []).map(p => ({...p, supplier_id: newId}))
            };
            setSuppliers(prev => [newProductEntry, ...prev]);
        }
    } catch (e) {
        console.error("Operation failed", e);
    }

    setIsAddItemOpen(false);
    setEditingSupplier(null);
    setViewMode('supplier_dashboard');
  };

  const handleUpdateDossier = async (updates: Partial<Supplier>) => {
    if (myOwnDossier) {
      if (isValidUUID(myOwnDossier.id)) {
        try {
            const { error } = await supabase
                .from('suppliers')
                .update({
                name: updates.name,
                industry: updates.industry,
                category: updates.category,
                location: updates.location,
                description: updates.description,
                image_url: updates.imageUrl,
                established_year: updates.establishedYear,
                employee_count: updates.employeeCount,
                factory_size: updates.factorySize,
                production_capacity: updates.productionCapacity,
                business_type: updates.businessType,
                export_markets: updates.exportMarkets,
                certifications: updates.certifications
                })
                .eq('id', myOwnDossier.id);
            
            if (error) throw error;
        } catch (e) {
            console.warn("Offline/Error updating dossier DB:", e);
        }
      }

      // Update local state regardless of DB success for demo purposes
      setSuppliers(prev => prev.map(s => s.id === myOwnDossier.id ? { ...s, ...updates } : s));
    }
    setIsDossierOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setActiveSector('All');
    setMatchingIds([]);
    setAiAnalysis([]);
  };

  const groupedSuppliers = useMemo(() => {
    let filtered = suppliers.filter(s => !s.isOwner);
    
    if (matchingIds.length > 0) {
      filtered = filtered.filter(s => matchingIds.includes(s.id));
    } else if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.category.toLowerCase().includes(term) ||
        s.products.some(p => p.name.toLowerCase().includes(term)) ||
        s.description.toLowerCase().includes(term)
      );
    }
    if (activeSector !== 'All') {
      filtered = filtered.filter(s => s.industry === activeSector);
    }
    const structure: Record<string, Record<string, Supplier[]>> = {};
    filtered.forEach(s => {
      const industryKey = s.industry;
      if (!structure[industryKey]) structure[industryKey] = {};
      const catKey = s.category || 'General';
      if (!structure[industryKey][catKey]) structure[industryKey][catKey] = [];
      structure[industryKey][catKey].push(s);
    });
    return structure;
  }, [suppliers, searchTerm, activeSector, matchingIds]);
  
  const sectorsList = Object.values(Industry);

  const handleBecomeSupplier = () => {
    if (isRegisteredSupplier && myOwnDossier) {
      setViewMode('supplier_dashboard');
    } else if (supplierProfile) {
      setViewMode('supplier_onboarding');
    } else {
      setViewMode('supplier_login');
    }
  };

  // Pre-fill Add Product Modal with Dossier info but ensure ID is blank to trigger "New Item" logic
  const handleOpenAddListing = () => {
    if (myOwnDossier) {
      setEditingSupplier({
        ...myOwnDossier,
        id: '', // Empty ID tells handleAddNewItem this is a new entry
        products: [], // Start with empty product list
        isOwner: false,
        belongsToOwner: true
      });
    } else {
      setEditingSupplier(null);
    }
    setIsAddItemOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar 
        onHome={() => { setViewMode('landing'); resetFilters(); }} 
        onBecomeSupplier={handleBecomeSupplier} 
        onBecomeBuyer={() => setViewMode(isLoggedInBuyer ? 'buyer' : 'buyer_login')} 
        onBuyerProfile={() => setViewMode('buyer_profile')} 
        currentMode={viewMode} 
        isRegisteredSupplier={isRegisteredSupplier && !!myOwnDossier} 
        isLoggedInBuyer={isLoggedInBuyer} 
      />
      
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Synchronizing Supply Chain Data...</p>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'landing' && (
            <div className="container mx-auto px-4 py-20 animate-in fade-in duration-700">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">
                  Cambodia's Digital <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">B2B Gateway</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  The official platform for global trade. Direct access to verified manufacturers, agriculture producers, and craft collectives.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <button 
                  onClick={() => setViewMode(isLoggedInBuyer ? 'buyer' : 'buyer_login')}
                  className="group relative bg-white p-10 rounded-[40px] border-2 border-slate-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all text-left overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">I am a Buyer</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                      Find verified suppliers, browse industrial categories, and use our AI to match with the perfect manufacturing partners.
                    </p>
                    <div className="inline-flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-xs">
                      {isLoggedInBuyer ? 'Explore Directory' : 'Sign In to Access'} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={handleBecomeSupplier}
                  className="group relative bg-slate-900 p-10 rounded-[40px] border-2 border-slate-900 hover:shadow-2xl transition-all text-left overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white text-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">I am a Supplier</h2>
                    <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                      List your factory, showcase your products to global buyers, and get verified leads from international companies.
                    </p>
                    <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs">
                      {isRegisteredSupplier && myOwnDossier ? 'Go to Dashboard' : 'Join the Network'} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {viewMode === 'buyer' && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 pb-24">
              <header className="bg-white border-b border-slate-200 pt-12 pb-20 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                  <button 
                    onClick={() => setViewMode(isRegisteredSupplier && myOwnDossier ? 'supplier_dashboard' : 'buyer_profile')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-black uppercase tracking-widest mb-6 hover:bg-blue-100 transition-colors"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Welcome back, {isRegisteredSupplier && myOwnDossier ? (myOwnDossier.name) : (buyerProfile?.username || 'Buyer')}
                  </button>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                    Explore Directory
                  </h1>
                  <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
                    <div className="relative flex-grow group">
                      <input
                        type="text"
                        placeholder="Silk, Rice, Electronics..."
                        className="w-full pl-14 pr-4 py-5 bg-white border-2 border-slate-100 group-hover:border-blue-200 focus:border-blue-500 rounded-full shadow-xl shadow-slate-200/50 transition-all outline-none text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAIMatch()}
                      />
                      <svg className="absolute left-7 top-5 h-7 w-7 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      onClick={handleAIMatch}
                      disabled={isMatching || !searchTerm}
                      className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-blue-600 transition-all active:scale-95 disabled:bg-slate-300 flex items-center justify-center min-w-[160px]"
                    >
                      {isMatching ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full"></div>
                          <span>Matching...</span>
                        </div>
                      ) : "AI Match"}
                    </button>
                  </div>
                </div>
              </header>

              <main id="directory-main" className="container mx-auto px-4 -mt-10 pb-20 relative z-20">
                {aiAnalysis.length > 0 && !isMatching && (
                  <div className="mb-10 animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-8 md:p-10 shadow-2xl shadow-blue-500/20 text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Top AI Matches</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          {aiAnalysis.map((item, index) => (
                            <div 
                              key={index} 
                              onClick={() => handleOpenSupplierProfile(item.name)}
                              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative group hover:bg-white/30 cursor-pointer transition-all active:scale-95"
                            >
                              <div className="absolute -top-3 -left-3 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                                {index + 1}
                              </div>
                              <h4 className="text-lg font-black mb-2 tracking-tight group-hover:text-blue-200 transition-colors">{item.name}</h4>
                              <p className="text-sm text-blue-50 font-medium leading-relaxed mb-4">{item.reason}</p>
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-300">
                                View Dossier
                                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                          <button onClick={resetFilters} className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 rounded-full border border-white/20">Clear Search</button>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Showing {matchingIds.length} expert recommendations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
                    <button onClick={() => setActiveSector('All')} className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all ${activeSector === 'All' && !matchingIds.length ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-100'}`}>All Categories</button>
                    {sectorsList.map(sector => (
                      <button key={sector} onClick={() => { setActiveSector(sector); setMatchingIds([]); setAiAnalysis([]); }} className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all ${activeSector === sector ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-100'}`}>{sector}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-16">
                  {Object.keys(groupedSuppliers).length > 0 ? (
                    Object.entries(groupedSuppliers).map(([sector, categories]) => (
                      <div key={sector}>
                        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{sector}</h2>
                        <div className="space-y-12">
                          {Object.entries(categories).map(([category, suppliersList]) => (
                            <div key={category}>
                              <div className="flex items-center gap-3 mb-6">
                                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{category}</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {suppliersList.map(s => (
                                  <SupplierCard 
                                    key={s.id} 
                                    supplier={s} 
                                    onManage={() => handleOpenEdit(s)} 
                                    onInfo={() => handleOpenSupplierProfile(s.name)} 
                                    onContact={() => handleContactSupplier(s)} 
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center bg-white rounded-[40px] shadow-sm border border-slate-100">
                      <h3 className="text-2xl font-black text-slate-800">No results found</h3>
                      <button onClick={resetFilters} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-bold">Reset Exploration</button>
                    </div>
                  )}
                </div>
              </main>
            </div>
          )}

          {viewMode === 'buyer_login' && <BuyerLogin onLogin={handleBuyerLogin} onBack={() => setViewMode('landing')} />}
          {viewMode === 'buyer_profile' && buyerProfile && (
            <BuyerProfile 
              username={buyerProfile.username} 
              email={buyerProfile.email} 
              onBack={() => setViewMode('buyer')} 
              onLogout={handleLogout} 
              onContactSupplier={(id) => {
                const s = suppliers.find(sup => sup.id === id);
                if (s) handleContactSupplier(s);
              }}
            />
          )}
          {viewMode === 'supplier_login' && <SupplierLogin onLogin={handleSupplierLogin} onBack={() => setViewMode('landing')} />}
          {viewMode === 'supplier_dashboard' && <SupplierDashboard username={myOwnDossier?.name || supplierProfile?.username || 'Supplier'} email={supplierProfile?.email || ''} myListings={myListings} onAddListing={handleOpenAddListing} onEditListing={handleOpenEdit} onViewInfo={(s) => handleOpenSupplierProfile(s.name)} onLogout={handleLogout} />}
          {viewMode === 'supplier_onboarding' && <SupplierOnboarding initialName={supplierProfile?.username} onBack={() => setViewMode('landing')} onComplete={handleSupplierRegistrationComplete} />}
          
          {(viewMode === 'supplier_profile' || viewMode === 'supplier_own_profile') && activeProfileSupplier && (
            <SupplierPublicProfile 
              supplier={activeProfileSupplier} 
              onBack={() => setViewMode(viewMode === 'supplier_own_profile' ? 'supplier_dashboard' : 'buyer')} 
              onProductClick={(p) => handleOpenProductDetail(p, activeProfileSupplier)} 
              onContact={handleContactSupplier}
              isOwnerView={viewMode === 'supplier_own_profile'}
              onEditDossier={() => setIsDossierOpen(true)}
            />
          )}
          {viewMode === 'product_detail' && selectedSupplier && selectedProduct && (
            <ProductDetailView 
              product={selectedProduct} 
              supplier={selectedSupplier} 
              onBack={() => setViewMode(lastViewBeforeDetail)} 
              onContact={handleContactSupplier}
            />
          )}

          {isLoggedInBuyer && (viewMode === 'buyer' || viewMode === 'buyer_profile' || viewMode === 'product_detail' || viewMode === 'supplier_profile') && (
            <BuyerBottomNav 
              currentView={viewMode} 
              onViewExplore={() => setViewMode('buyer')} 
              onViewProfile={() => setViewMode('buyer_profile')} 
            />
          )}

          {isRegisteredSupplier && !isLoggedInBuyer && (viewMode === 'buyer' || viewMode === 'supplier_dashboard' || viewMode.includes('profile')) && (
            <SupplierBottomNav 
              currentView={viewMode} 
              onViewDashboard={() => setViewMode('supplier_dashboard')} 
              onViewMarket={() => setViewMode('buyer')} 
              onAddProduct={handleOpenAddListing}
              onOpenDossier={handleViewOwnProfile}
            />
          )}

          <footer className="bg-slate-50 py-12 border-t border-slate-100 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-6 cursor-pointer" onClick={() => { setViewMode('landing'); resetFilters(); }}>
                <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
                <span className="font-black text-slate-900">QuickSupply</span>
              </div>
              <p className="text-slate-400 text-sm font-medium">Official Sourcing Portal of Cambodia. Connecting the Kingdom to Global Markets.</p>
            </div>
          </footer>

          {(viewMode === 'buyer' || viewMode === 'supplier_dashboard' || viewMode === 'buyer_profile' || viewMode === 'supplier_profile' || viewMode === 'product_detail' || viewMode === 'supplier_own_profile') && (
            <ChatInterface 
              isOpen={chatOpen} 
              onToggle={() => { setChatOpen(!chatOpen); if (chatOpen) { setChatInitialMessage(null); setChatRecipient(null); } }} 
              availableSuppliers={suppliers}
              recipient={chatRecipient}
              initialMessage={chatInitialMessage}
              onExitDM={handleExitDM}
            />
          )}

          <AddItemModal 
            isOpen={isAddItemOpen} 
            initialData={editingSupplier || undefined} 
            onClose={() => { setIsAddItemOpen(false); setEditingSupplier(null); }} 
            onSubmit={handleAddNewItem} 
          />

          <DossierModal 
            isOpen={isDossierOpen} 
            supplier={myOwnDossier || {
              id: 'temp-setup',
              name: supplierProfile?.username || 'Owner',
              industry: Industry.GarmentTextile,
              category: '',
              location: 'Phnom Penh',
              rating: 5,
              description: '',
              products: [],
              certifications: [],
              contactEmail: supplierProfile?.email || '',
              imageUrl: '',
              isOwner: true
            }} 
            onClose={() => setIsDossierOpen(false)} 
            onSubmit={handleUpdateDossier} 
          />
        </>
      )}
    </div>
  );
};

export default App;
