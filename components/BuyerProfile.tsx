
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Order, Profile } from '../types';

interface BuyerProfileProps {
  username: string;
  email: string;
  onBack: () => void;
  onLogout: () => void;
  onContactSupplier: (supplierId: string) => void;
}

type ProfileSubView = 'main' | 'history' | 'orders' | 'invoice';

const BuyerProfile: React.FC<BuyerProfileProps> = ({ username: initialUsername, email, onBack, onLogout, onContactSupplier }) => {
  const [subView, setSubView] = useState<ProfileSubView>('main');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdatingFocus, setIsUpdatingFocus] = useState(false);
  const [marketFocusTags, setMarketFocusTags] = useState(['Textiles', 'Organic Produce', 'Eco-Handicrafts', 'Electronics Assembly']);
  
  // Real Data State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileAndOrders();
  }, []);

  const fetchProfileAndOrders = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 1. Fetch Profile Details from 'profiles' table
        // Note: The profiles table schema provided only contains: id, username, role, email, updated_at
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        // 2. Construct full profile object, pulling extra fields from Auth Metadata 
        // because they are not in the profiles table schema
        const fullProfile: Profile = {
           id: user.id,
           email: user.email || '',
           username: profileData?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'User',
           role: profileData?.role || user.user_metadata?.role || 'buyer',
           updated_at: profileData?.updated_at,
           phone: user.user_metadata?.phone, // From auth meta
           company_role: user.user_metadata?.company_role // From auth meta
        };

        setProfile(fullProfile);

        // 3. Fetch Orders (History)
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*, supplier:suppliers(name, industry, location)')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });
        
        if (ordersData) {
          setOrders(ordersData);
        }
      }
    } catch (e) {
      console.error("Error fetching profile data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (orderId: string) => {
    setSelectedOrderId(orderId);
    setSubView('invoice');
  };

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      window.print();
    }, 2500);
  };

  const handleUpdateFocus = () => {
    setIsUpdatingFocus(true);
    setTimeout(() => {
      const newIndustryTrends = [
        ['Textiles', 'Organic Produce', 'Renewable Energy', 'Tech Logistics'],
        ['Eco-Handicrafts', 'Electronics Assembly', 'Sustainable Packaging', 'Agri-Tech'],
        ['Raw Silk', 'Precious Stones', 'Organic Pepper', 'Furniture Export']
      ];
      const randomTrend = newIndustryTrends[Math.floor(Math.random() * newIndustryTrends.length)];
      setMarketFocusTags(randomTrend);
      setIsUpdatingFocus(false);
    }, 3000);
  };

  // Derive display name from profile or props
  const displayName = profile?.username || initialUsername;
  // Fallback only if strictly necessary, avoiding planted titles like "Procurement Agent"
  const displayRole = profile?.company_role || (profile?.role === 'buyer' ? 'Verified Buyer' : 'User');

  const renderHistory = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <button 
        onClick={() => setSubView('main')}
        className="mb-8 flex items-center gap-2 text-blue-600 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-[0.3em]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Profile
      </button>
      <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Suppliers Contacted History</h2>
      
      {orders.length === 0 ? (
        <div className="p-12 bg-white rounded-[32px] border border-slate-100 text-center">
          <p className="text-slate-400 font-medium">No contact history found in database.</p>
          <button onClick={onBack} className="mt-4 text-blue-600 font-black text-xs uppercase tracking-widest">Browse Directory to Connect</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((item) => (
            <div key={item.id} className="group p-8 bg-white border border-slate-100 rounded-[32px] hover:shadow-2xl hover:shadow-blue-500/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-blue-600 text-xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {item.supplier?.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-1">{item.supplier?.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.supplier?.industry || 'General'}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Ref: {item.id.split('-')[0]}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  item.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                  item.status === 'Processing' ? 'bg-amber-50 text-amber-600' :
                  'bg-slate-50 text-slate-400'
                }`}>
                  {item.status}
                </span>
                <button 
                  onClick={() => onContactSupplier(item.supplier_id)}
                  className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg active:scale-90"
                  title="Message Supplier"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <button 
        onClick={() => setSubView('main')}
        className="mb-8 flex items-center gap-2 text-emerald-600 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-[0.3em]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Profile
      </button>
      <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Active Sourcing Orders</h2>
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Retrieving Logistics Data...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100">
          <p className="text-slate-400 font-medium">No active orders found in the Kingdom's system.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{order.id.split('-')[0]}</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                    <h4 className="text-2xl font-black text-slate-900">{order.supplier?.name || 'Loading Supplier...'}</h4>
                  </div>
                  <p className="text-sm font-medium text-slate-400">Estimated Delivery: {order.est_delivery || 'TBD'}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900 mb-1">{order.total}</div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{order.status}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Production Progress</span>
                  <span>{order.progress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${order.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${order.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50">
                <button 
                  onClick={() => handleViewInvoice(order.id)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10"
                >
                  View Digital Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInvoice = () => {
    const order = orders.find(o => o.id === selectedOrderId) || orders[0];
    if (!order) return null;
    
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto relative">
        {isGenerating && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
            <div className="w-24 h-24 mb-8 relative">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">Q</div>
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Generating Digital Asset...</h3>
            <p className="text-slate-400 font-medium">Compiling encrypted invoice for {order.id.split('-')[0]}</p>
          </div>
        )}

        <button 
          onClick={() => setSubView('orders')}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-[0.3em] print:hidden"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>

        <div className="bg-white border border-slate-200 rounded-[40px] shadow-2xl overflow-hidden print:shadow-none print:border-none print:m-0">
          <div className="p-12 md:p-16 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <div className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl mb-8">Q</div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Invoice</h2>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Sourcing Record</div>
            </div>
            <div className="text-right space-y-2">
              <div className="text-xl font-black text-slate-900">{order.id.split('-')[0]}</div>
              <div className="text-sm font-medium text-slate-500">Issued: {new Date(order.created_at).toLocaleDateString()}</div>
              <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block ${
                order.status === 'Shipped' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {order.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-12 md:p-16 bg-slate-50/50">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Supplier Information</div>
              <div className="space-y-1">
                <div className="text-lg font-black text-slate-900">{order.supplier?.name}</div>
                <div className="text-sm text-slate-600">{order.supplier?.location || 'Cambodia'}</div>
                <div className="text-sm text-slate-600">{order.supplier?.industry}</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Client Information</div>
              <div className="space-y-1">
                <div className="text-lg font-black text-slate-900">{displayName}</div>
                <div className="text-sm text-slate-600">{email}</div>
                {profile?.phone && <div className="text-sm text-slate-600">{profile.phone}</div>}
                <div className="text-sm text-slate-600">Verified Global Buyer Account</div>
              </div>
            </div>
          </div>

          <div className="p-12 md:p-16">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Industrial Asset / SKU</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Quantity</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr>
                  <td className="py-8">
                    <div className="text-sm font-black text-slate-900">Custom Wholesale Batch</div>
                    <div className="text-xs text-slate-400">Order ID Confirmation Ref: {order.id.split('-')[0]}</div>
                  </td>
                  <td className="py-8 text-sm font-bold text-slate-600 text-right">1 Unit</td>
                  <td className="py-8 text-sm font-bold text-slate-600 text-right">{order.total}</td>
                  <td className="py-8 text-sm font-black text-slate-900 text-right">{order.total}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-12 flex justify-end">
              <div className="w-full md:w-64 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-400">Subtotal</span>
                  <span className="font-black text-slate-900">{order.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-400">Export Duties (0%)</span>
                  <span className="font-black text-slate-900">$0.00</span>
                </div>
                <div className="pt-6 border-t-2 border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Due</span>
                  <span className="text-2xl font-black text-blue-600">{order.total}</span>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between print:hidden">
              <div className="text-xs text-slate-400 font-medium">Payment processed via QuickSupply Secure Gateway</div>
              <div className="flex gap-4">
                <button 
                  onClick={handleDownloadPDF}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg active:scale-95 flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PDF
                </button>
                <button className="px-8 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors">
                  Report Discrepancy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading secure profile...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="max-w-5xl mx-auto">
        {isUpdatingFocus && (
          <div className="fixed inset-0 z-[100] bg-blue-900/90 backdrop-blur-xl flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
            <div className="relative mb-12">
               <div className="w-32 h-32 border-4 border-blue-400/30 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-blue-400 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                 </svg>
               </div>
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">AI Industry Pulse Check</h3>
            <div className="text-center space-y-2">
              <p className="text-blue-200 font-medium animate-pulse text-lg">Scanning emerging procurement trends in SE Asia...</p>
              <p className="text-blue-400/60 text-xs font-black uppercase tracking-widest">Optimizing Supply Chain Focus for {displayName}</p>
            </div>
          </div>
        )}

        {subView === 'main' ? (
          <>
            <button 
              onClick={onBack} 
              className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-[0.3em]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Directory
            </button>

            <div className="bg-white rounded-[50px] border border-slate-100 shadow-2xl overflow-hidden">
              <div className="bg-slate-900 p-12 md:p-16 text-white relative">
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                          Verified Global Buyer
                        </span>
                        <span className="px-4 py-2 bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">
                          {displayRole}
                        </span>
                      </div>
                      <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
                        {displayName}
                      </h1>
                      <p className="text-xl text-slate-400 font-medium">{profile?.email}</p>
                      {profile?.phone && <p className="text-sm text-slate-500 font-medium mt-2">{profile.phone}</p>}
                    </div>
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-blue-500/20">
                      {displayName?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mb-32"></div>
              </div>

              <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-16">
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Activity Pipeline</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div 
                        onClick={() => setSubView('history')}
                        className="p-10 bg-blue-50 rounded-[40px] border border-blue-100 group hover:bg-blue-600 transition-all cursor-pointer"
                      >
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 group-hover:text-blue-100">Suppliers Contacted</div>
                        {/* We use orders length as a proxy for contacts in this MVP if contacts table doesn't exist */}
                        <div className="text-6xl font-black text-blue-700 group-hover:text-white">{orders.length}</div>
                        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:text-white">
                          View Contact History
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                      </div>
                      <div 
                        onClick={() => setSubView('orders')}
                        className="p-10 bg-emerald-50 rounded-[40px] border border-emerald-100 group hover:bg-emerald-600 transition-all cursor-pointer"
                      >
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 group-hover:text-emerald-100">Active Orders</div>
                        <div className="text-6xl font-black text-emerald-700 group-hover:text-white">{orders.length}</div>
                        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:text-white">
                          Track Shipments
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Market Focus</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {marketFocusTags.map(tag => (
                        <span key={tag} className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black text-slate-600 shadow-sm animate-in zoom-in duration-300">
                          {tag}
                        </span>
                      ))}
                      <button 
                        onClick={handleUpdateFocus}
                        className="px-8 py-4 border-2 border-dashed border-slate-200 rounded-3xl text-[10px] font-black text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all uppercase tracking-widest group active:scale-95"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                          Update Focus
                        </span>
                      </button>
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <div className="p-10 bg-slate-900 rounded-[40px] text-white shadow-xl shadow-slate-900/10">
                    <h4 className="text-xl font-black mb-10 text-blue-400">Buyer Dashboard</h4>
                    <div className="space-y-10">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Profile Verification</span>
                          <span className="text-xs font-black text-emerald-400">EXCELLENT</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[100%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-12 pt-10 border-t border-slate-800">
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Registered Since</div>
                        <div className="text-xl font-black text-white">
                           {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric'}) : 'August 2024'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={onLogout}
                    className="w-full py-6 bg-red-50 text-red-600 rounded-[32px] font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all active:scale-95 border border-red-100 shadow-sm"
                  >
                    Logout Account
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : subView === 'history' ? (
          renderHistory()
        ) : subView === 'orders' ? (
          renderOrders()
        ) : (
          renderInvoice()
        )}
      </div>
    </div>
  );
};

export default BuyerProfile;
