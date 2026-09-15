import React, { useState, useEffect, FC, FormEvent } from 'react';
import {
  DollarSign, ShoppingBag, Users, User, Package, AlertTriangle, Plus, Edit, Edit3, Trash2, Printer, Eye, Check, X, Tag, RefreshCw, FolderTree, Ticket, Boxes, MessageSquare, MapPin, Phone, Mail, Truck, CreditCard, Save, FileText, Shield, Lock, ArrowLeft, Key
} from 'lucide-react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { PrintableInvoice } from '../components/checkout/PrintableInvoice';
import { api } from '../services/api';
import { Product, Category, Order, Coupon, Review } from '../types';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

interface AdminPageProps {
  onNavigateStore: () => void;
}

export const AdminPage: FC<AdminPageProps> = ({ onNavigateStore }) => {
  const { user, isAdmin, login } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { showToast } = useToast();
  const { formatPrice } = useCurrency();

  // Admin Login Screen States
  const [adminEmail, setAdminEmail] = useState('Fahim');
  const [adminPass, setAdminPass] = useState('156258');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Dashboard Overview Stats
  const [stats, setStats] = useState<any>(null);

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  // Modals & Selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<any | null>(null);

  // Editable Order Details State
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerEmail, setEditCustomerEmail] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editAddressText, setEditAddressText] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('');
  const [editOrderStatus, setEditOrderStatus] = useState('');
  const [editTotal, setEditTotal] = useState<number>(0);

  // Internal Notes State
  const [internalNotes, setInternalNotes] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percent' | 'fixed'>('percent');
  const [couponVal, setCouponVal] = useState<number>(10);
  const [couponMinSpend, setCouponMinSpend] = useState<number>(0);
  const [couponMaxDisc, setCouponMaxDisc] = useState<string>('');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Inventory Editing State
  const [inventoryStockMap, setInventoryStockMap] = useState<Record<number, number>>({});

  // Settings State
  const [settings, setSettings] = useState<any>({
    storeName: 'Syvora Beauty & Lifestyle',
    storeEmail: 'contact@syvora.com',
    usdToBdtRate: 120,
    freeShippingThresholdUSD: 75,
    freeShippingThresholdBDT: 3000,
    announcementBarText: '✨ Free Shipping on Orders Over $75 / ৳3000 | Code WELCOME10'
  });

  const [loading, setLoading] = useState(false);

  // Master Data Fetcher
  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      api.getAdminStats(),
      api.getProducts({ limit: 200 }),
      api.getCategories(true),
      api.getAllOrders(),
      api.getAdminCustomers(),
      api.getCoupons(),
      api.getAllReviews(),
      api.getAdminInventory(),
      api.getSettings()
    ]).then(([statsRes, prodRes, catRes, ordRes, custRes, coupRes, revRes, invRes, setRes]) => {
      if (statsRes.success) setStats(statsRes.stats);
      if (prodRes.success) setProducts(prodRes.products || []);
      if (catRes.success) setCategories(catRes.categories || []);
      if (ordRes.success) setOrders(ordRes.orders || []);
      if (custRes.success) setCustomers(custRes.customers || []);
      if (coupRes.success) setCoupons(coupRes.coupons || []);
      if (revRes.success) setReviews(revRes.reviews || []);
      if (invRes.success) {
        const invList = invRes.inventory || [];
        setInventory(invList);
        const map: Record<number, number> = {};
        invList.forEach((item: any) => { map[item.id] = item.stock; });
        setInventoryStockMap(map);
      }
      if (setRes.success) setSettings(setRes.settings || {});
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const handleAdminLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);
    try {
      await login(adminEmail, adminPass);
      showToast('Admin portal access granted.', 'success');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrative credentials.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-syvora-charcoal text-syvora-ivory flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-syvora-rose/20 text-syvora-rose rounded-2xl mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-wider uppercase text-syvora-ivory">
              Syvora Admin Portal
            </h1>
            <p className="text-xs text-syvora-muted">
              Administrative Control Center & Business Operations
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-md shadow-2xl space-y-5">
            {loginError && (
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider block mb-1.5 text-syvora-ivory/80">
                  Admin Email / Username *
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-syvora-muted absolute left-3" />
                  <input
                    type="text"
                    required
                    placeholder="Fahim or fahim@syvora.com"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    className="w-full bg-white/10 text-white placeholder-syvora-muted rounded-xl pl-9 pr-3 py-3 border border-white/10 outline-none focus:border-syvora-rose transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider block mb-1.5 text-syvora-ivory/80">
                  Password *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-syvora-muted absolute left-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPass}
                    onChange={e => setAdminPass(e.target.value)}
                    className="w-full bg-white/10 text-white placeholder-syvora-muted rounded-xl pl-9 pr-3 py-3 border border-white/10 outline-none focus:border-syvora-rose transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full bg-syvora-rose hover:bg-syvora-rose-dark text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-luxury flex items-center justify-center gap-2"
              >
                {isSubmittingLogin ? 'Authenticating...' : 'Sign In to Admin Portal'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminEmail('Fahim');
                  setAdminPass('156258');
                  login('Fahim', '156258');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-luxury flex items-center justify-center gap-2"
              >
                ⚡ One-Click Quick Login as Fahim
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center space-y-2">
              <div className="p-3 bg-syvora-rose/10 border border-syvora-rose/20 rounded-xl text-[11px] text-syvora-rose font-medium">
                <p className="font-bold uppercase tracking-wider text-[10px]">🔑 Admin Access Credentials</p>
                <p className="mt-0.5 font-mono">Username: <strong>Fahim</strong> | Password: <strong>156258</strong></p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onNavigateStore}
              className="text-xs text-syvora-muted hover:text-syvora-ivory transition-colors inline-flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Web Panel
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-syvora-muted py-4 border-t border-white/5">
          © {new Date().getFullYear()} Syvora Beauty & Lifestyle • Confidential Admin Portal System
        </div>
      </div>
    );
  }

  // Handlers
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        showToast('Product deleted.', 'info');
        loadDashboardData();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete product.', 'error');
      }
    }
  };

  const handleOpenOrderDetails = (ord: Order) => {
    setSelectedOrderDetails(ord);
    setInternalNotes(ord.internal_notes || '');
    setIsEditingOrder(false);
    setEditCustomerName(ord.customer_name || '');
    setEditCustomerEmail(ord.customer_email || '');
    setEditCustomerPhone(ord.customer_phone || '');
    setEditAddressText(renderAddressText(ord.shipping_address));
    setEditTrackingNumber(ord.tracking_number || '');
    setEditPaymentStatus(ord.payment_status || 'pending');
    setEditOrderStatus(ord.order_status || 'Pending');
    setEditTotal(ord.total || 0);
  };

  const handleSaveOrderEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderDetails) return;
    try {
      await api.updateOrderStatus(selectedOrderDetails.id, {
        customer_name: editCustomerName,
        customer_email: editCustomerEmail,
        customer_phone: editCustomerPhone,
        shipping_address: editAddressText,
        tracking_number: editTrackingNumber,
        payment_status: editPaymentStatus,
        order_status: editOrderStatus,
        total: editTotal
      });
      showToast('Order & customer details updated successfully!', 'success');
      const updated = {
        ...selectedOrderDetails,
        customer_name: editCustomerName,
        customer_email: editCustomerEmail,
        customer_phone: editCustomerPhone,
        shipping_address: editAddressText,
        tracking_number: editTrackingNumber,
        payment_status: editPaymentStatus,
        order_status: editOrderStatus,
        total: editTotal
      };
      setSelectedOrderDetails(updated);
      setIsEditingOrder(false);
      loadDashboardData();
    } catch (err: any) {
      showToast('Failed to save order updates.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.updateOrderStatus(orderId, { order_status: status });
      showToast(`Order status updated to "${status}"`, 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleSaveInternalNotes = async (orderId: number) => {
    try {
      await api.updateOrderStatus(orderId, { internal_notes: internalNotes });
      showToast('Internal notes saved!', 'success');
      if (selectedOrderDetails) {
        setSelectedOrderDetails({ ...selectedOrderDetails, internal_notes: internalNotes });
      }
      loadDashboardData();
    } catch (err: any) {
      showToast('Failed to save notes.', 'error');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.createCategory({
        name: newCatName,
        image: newCatImage || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        description: newCatDesc
      });
      showToast('New category added!', 'success');
      setNewCatName('');
      setNewCatImage('');
      setNewCatDesc('');
      setIsCatModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast('Failed to create category.', 'error');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(id);
        showToast('Category deleted.', 'info');
        loadDashboardData();
      } catch (err: any) {
        showToast('Failed to delete category.', 'error');
      }
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      await api.createCoupon({
        code: couponCode,
        discount_type: couponType,
        discount_value: couponVal,
        min_spend: couponMinSpend,
        max_discount: couponMaxDisc ? parseFloat(couponMaxDisc) : null
      });
      showToast(`Coupon "${couponCode}" created!`, 'success');
      setCouponCode('');
      setIsCouponModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create coupon.', 'error');
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (window.confirm('Delete coupon code?')) {
      try {
        await api.deleteCoupon(id);
        showToast('Coupon removed.', 'info');
        loadDashboardData();
      } catch (err: any) {
        showToast('Failed to delete coupon.', 'error');
      }
    }
  };

  const handleSaveBulkStock = async () => {
    try {
      const updates = Object.keys(inventoryStockMap).map(idStr => ({
        id: parseInt(idStr),
        stock: inventoryStockMap[parseInt(idStr)]
      }));
      await api.updateStockBulk(updates);
      showToast('Bulk stock levels updated successfully!', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast('Failed to update inventory stock.', 'error');
    }
  };

  const handleModerateReview = async (id: number, status: 'approved' | 'hidden' | 'deleted') => {
    try {
      await api.updateReviewStatus(id, { status });
      showToast(`Review ${status}!`, 'info');
      loadDashboardData();
    } catch (err: any) {
      showToast('Failed to update review.', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      showToast('Store settings saved successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save settings.', 'error');
    }
  };

  // Address Helper Formatter
  const renderAddressText = (addrObj: any) => {
    if (!addrObj) return 'N/A';
    if (typeof addrObj === 'string') {
      try {
        addrObj = JSON.parse(addrObj);
      } catch (e) {
        return addrObj;
      }
    }
    const parts = [
      addrObj.full_address,
      addrObj.area,
      addrObj.city,
      addrObj.state,
      addrObj.postal_code,
      addrObj.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="flex min-h-screen bg-syvora-ivory text-syvora-charcoal">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigateStore={onNavigateStore}
      />

      {/* Main Admin Panel Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-syvora-border pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold capitalize text-syvora-charcoal">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-xs text-syvora-muted">Syvora Beauty & Lifestyle E-Commerce Control Center</p>
          </div>

          <button
            onClick={loadDashboardData}
            className="bg-white border border-syvora-border hover:bg-syvora-champagne text-syvora-charcoal text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        {/* 1. DASHBOARD OVERVIEW TAB */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white/90 border border-syvora-border p-6 rounded-3xl shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-syvora-muted">Total Revenue</span>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-syvora-charcoal">{formatPrice(stats.totalRevenue || 0)}</div>
                <span className="text-[10px] text-emerald-600 font-semibold">Today: {formatPrice(stats.todaySales || 0)}</span>
              </div>

              <div className="bg-white/90 border border-syvora-border p-6 rounded-3xl shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-syvora-muted">Total Orders</span>
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><ShoppingBag className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-syvora-charcoal">{stats.totalOrders || 0}</div>
                <span className="text-[10px] text-amber-600 font-semibold">{stats.pendingOrders || 0} Pending Fulfillment</span>
              </div>

              <div className="bg-white/90 border border-syvora-border p-6 rounded-3xl shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-syvora-muted">Total Customers</span>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-syvora-charcoal">{stats.totalCustomers || 0}</div>
                <span className="text-[10px] text-syvora-muted font-medium">Registered User Profiles</span>
              </div>

              <div className="bg-white/90 border border-syvora-border p-6 rounded-3xl shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-syvora-muted">Low Stock Alert</span>
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
                </div>
                <div className="text-2xl font-bold text-rose-600">{stats.lowStockCount || 0}</div>
                <span className="text-[10px] text-rose-700 font-medium">Products below threshold</span>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white/90 border border-syvora-border p-6 rounded-3xl shadow-soft space-y-4">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Recent Customer Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-syvora-border text-syvora-muted uppercase text-[10px] font-bold">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer Info</th>
                      <th className="pb-3">Shipping Address</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Order Status</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-syvora-border/60">
                    {stats.recentOrders?.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-syvora-champagne/20">
                        <td className="py-3 font-mono font-bold text-syvora-charcoal">#{ord.order_number}</td>
                        <td className="py-3">
                          <strong className="block text-syvora-charcoal">{ord.customer_name}</strong>
                          <span className="text-[10px] text-syvora-muted">{ord.customer_email}</span>
                          {ord.customer_phone && <span className="text-[10px] text-syvora-muted block">{ord.customer_phone}</span>}
                        </td>
                        <td className="py-3 text-[11px] text-syvora-muted max-w-xs truncate">
                          {renderAddressText(ord.shipping_address)}
                        </td>
                        <td className="py-3 font-bold text-syvora-rose">{formatPrice(ord.total)}</td>
                        <td className="py-3">
                          <span className="bg-syvora-rose/10 text-syvora-rose-dark px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            {ord.order_status}
                          </span>
                        </td>
                        <td className="py-3 uppercase font-semibold text-[10px]">{ord.payment_method}</td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenOrderDetails(ord)}
                            className="p-1 text-indigo-600 hover:text-indigo-800 font-bold"
                            title="View Customer Details"
                          >
                            <Eye className="w-4 h-4 inline" /> Details
                          </button>
                          <button
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            className="p-1 text-syvora-rose hover:underline font-bold"
                          >
                            Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS CATALOG TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Product Catalog ({products.length})</h3>
              <button
                onClick={() => { setSelectedProduct(null); setIsProductModalOpen(true); }}
                className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            <div className="bg-white/90 border border-syvora-border rounded-3xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-syvora-champagne/30 border-b border-syvora-border text-syvora-muted uppercase text-[10px] font-bold">
                      <th className="p-4">Product</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-syvora-border/60">
                    {products.map(prod => {
                      const imgs = Array.isArray(prod.images) ? prod.images : [prod.images];
                      return (
                        <tr key={prod.id} className="hover:bg-syvora-champagne/20">
                          <td className="p-4 flex items-center gap-3">
                            <img src={imgs[0]} alt="" className="w-10 h-10 object-cover rounded-lg border border-syvora-border" />
                            <div>
                              <h4 className="font-bold text-syvora-charcoal">{prod.name}</h4>
                              <span className="text-[10px] text-syvora-muted">{prod.brand}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[11px]">{prod.sku}</td>
                          <td className="p-4 font-medium">{prod.category_name || 'General'}</td>
                          <td className="p-4 font-bold text-syvora-rose">{formatPrice(prod.sale_price || prod.price)}</td>
                          <td className="p-4 font-bold">
                            <span className={prod.stock <= prod.low_stock_threshold ? 'text-rose-600 font-extrabold' : 'text-emerald-700'}>
                              {prod.stock} items
                            </span>
                          </td>
                          <td className="p-4 uppercase text-[10px] font-bold">{prod.status}</td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => { setSelectedProduct(prod); setIsProductModalOpen(true); }} className="p-1.5 text-syvora-charcoal hover:text-syvora-rose">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteProduct(prod.id)} className="p-1.5 text-rose-600 hover:text-rose-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. CATEGORIES BUILDER TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Categories Management ({categories.length})</h3>
              <button
                onClick={() => setIsCatModalOpen(true)}
                className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white/90 border border-syvora-border p-5 rounded-3xl shadow-soft flex items-center gap-4">
                  <img src={cat.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80'} alt="" className="w-16 h-16 object-cover rounded-2xl border border-syvora-border" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg font-bold text-syvora-charcoal truncate">{cat.name}</h4>
                    <p className="text-[10px] text-syvora-muted line-clamp-1">{cat.description}</p>
                    <span className="text-[10px] text-syvora-rose font-bold block mt-1">{cat.product_count || 0} Products</span>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-rose-600 hover:text-rose-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Category Form Modal */}
            {isCatModalOpen && (
              <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-syvora-charcoal/60 backdrop-blur-xs">
                <div className="bg-syvora-ivory border border-syvora-border p-6 rounded-3xl max-w-md w-full space-y-4">
                  <div className="flex justify-between items-center border-b border-syvora-border pb-3">
                    <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Add New Category</h3>
                    <button onClick={() => setIsCatModalOpen(false)}><X className="w-5 h-5 text-syvora-muted" /></button>
                  </div>
                  <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Category Name *</label>
                      <input type="text" required value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full p-3 bg-white border border-syvora-border rounded-xl outline-none" />
                    </div>
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Image URL</label>
                      <input type="url" placeholder="https://images.unsplash.com/..." value={newCatImage} onChange={e => setNewCatImage(e.target.value)} className="w-full p-3 bg-white border border-syvora-border rounded-xl outline-none" />
                    </div>
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Description</label>
                      <textarea rows={2} value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} className="w-full p-3 bg-white border border-syvora-border rounded-xl outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-syvora-charcoal hover:bg-syvora-rose text-white py-3 rounded-xl font-bold uppercase tracking-wider">Save Category</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. ORDERS & CUSTOMER DETAILS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-syvora-charcoal">All Orders & Customer Information ({orders.length})</h3>
            <div className="bg-white/90 border border-syvora-border rounded-3xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-syvora-champagne/30 border-b border-syvora-border text-syvora-muted uppercase text-[10px] font-bold">
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer Info</th>
                      <th className="p-4">Full Shipping Address</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Lifecycle Status</th>
                      <th className="p-4 text-right">Customer Info & Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-syvora-border/60">
                    {orders.map(ord => (
                      <tr key={ord.id} className="hover:bg-syvora-champagne/20">
                        <td className="p-4 font-mono font-bold">{ord.order_number}</td>
                        <td className="p-4">
                          <strong className="block text-syvora-charcoal">{ord.customer_name}</strong>
                          <span className="text-[10px] text-syvora-muted block">{ord.customer_email}</span>
                          <span className="text-[10px] text-syvora-rose font-bold block">{ord.customer_phone}</span>
                        </td>
                        <td className="p-4 max-w-xs text-[11px] text-syvora-charcoal/80">
                          {renderAddressText(ord.shipping_address)}
                        </td>
                        <td className="p-4 font-bold text-syvora-rose">{formatPrice(ord.total)}</td>
                        <td className="p-4 uppercase text-[10px] font-semibold">{ord.payment_method}</td>
                        <td className="p-4">
                          <select
                            value={ord.order_status}
                            onChange={e => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-syvora-ivory text-syvora-charcoal text-xs font-bold rounded-xl p-2 border border-syvora-border outline-none focus:border-syvora-rose"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenOrderDetails(ord)}
                            className="px-2.5 py-1.5 bg-syvora-charcoal text-syvora-ivory rounded-xl font-bold text-[11px] hover:bg-syvora-rose transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Full Info
                          </button>
                          <button
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            className="p-1.5 text-syvora-rose hover:underline font-bold text-[11px]"
                          >
                            Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. CUSTOMERS DATABASE TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Customer Directory ({customers.length})</h3>
            <div className="bg-white/90 border border-syvora-border rounded-3xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-syvora-champagne/30 border-b border-syvora-border text-syvora-muted uppercase text-[10px] font-bold">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Total Orders</th>
                      <th className="p-4">Lifetime Spend</th>
                      <th className="p-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-syvora-border/60">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-syvora-champagne/20">
                        <td className="p-4 font-bold text-syvora-charcoal">{c.name}</td>
                        <td className="p-4 text-syvora-muted">{c.email}</td>
                        <td className="p-4 font-semibold">{c.phone || 'N/A'}</td>
                        <td className="p-4 font-bold">{c.total_orders || 0}</td>
                        <td className="p-4 font-bold text-syvora-rose">{formatPrice(c.total_spent || 0)}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedCustomerDetails(c)}
                            className="px-3 py-1.5 bg-syvora-champagne hover:bg-syvora-rose hover:text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            View Customer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Discount Coupons ({coupons.length})</h3>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-6 py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 shadow-luxury"
              >
                <Plus className="w-4 h-4" /> Create Coupon
              </button>
            </div>

            <div className="bg-white/90 border border-syvora-border rounded-3xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-syvora-champagne/30 border-b border-syvora-border text-syvora-muted uppercase text-[10px] font-bold">
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Discount Type</th>
                      <th className="p-4">Value</th>
                      <th className="p-4">Min Spend</th>
                      <th className="p-4">Usage Limit</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-syvora-border/60">
                    {coupons.map(coup => (
                      <tr key={coup.id} className="hover:bg-syvora-champagne/20">
                        <td className="p-4 font-mono font-bold text-syvora-rose">{coup.code}</td>
                        <td className="p-4 capitalize">{coup.discount_type}</td>
                        <td className="p-4 font-bold">{coup.discount_type === 'percent' ? `${coup.discount_value}%` : `$${coup.discount_value}`}</td>
                        <td className="p-4">${coup.min_spend || 0}</td>
                        <td className="p-4">{coup.used_count} / {coup.usage_limit} used</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDeleteCoupon(coup.id!)} className="p-1.5 text-rose-600 hover:text-rose-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Coupon Modal */}
            {isCouponModalOpen && (
              <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-syvora-charcoal/60 backdrop-blur-xs">
                <div className="bg-syvora-ivory border border-syvora-border p-6 rounded-3xl max-w-md w-full space-y-4">
                  <div className="flex justify-between items-center border-b border-syvora-border pb-3">
                    <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Create Discount Coupon</h3>
                    <button onClick={() => setIsCouponModalOpen(false)}><X className="w-5 h-5 text-syvora-muted" /></button>
                  </div>
                  <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Coupon Code *</label>
                      <input type="text" required placeholder="e.g. GLOW25" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} className="w-full p-3 bg-white border border-syvora-border rounded-xl font-mono uppercase font-bold outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold uppercase tracking-wider block mb-1">Type</label>
                        <select value={couponType} onChange={e => setCouponType(e.target.value as any)} className="w-full p-3 bg-white border border-syvora-border rounded-xl outline-none font-bold">
                          <option value="percent">Percentage (%)</option>
                          <option value="fixed">Fixed Amount ($)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold uppercase tracking-wider block mb-1">Discount Value *</label>
                        <input type="number" required value={couponVal} onChange={e => setCouponVal(parseFloat(e.target.value))} className="w-full p-3 bg-white border border-syvora-border rounded-xl font-bold outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold uppercase tracking-wider block mb-1">Minimum Order Spend ($)</label>
                      <input type="number" value={couponMinSpend} onChange={e => setCouponMinSpend(parseFloat(e.target.value))} className="w-full p-3 bg-white border border-syvora-border rounded-xl outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-syvora-charcoal hover:bg-syvora-rose text-white py-3 rounded-xl font-bold uppercase tracking-wider">Save Promo Code</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. INVENTORY CONTROL TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Stock Level Controls</h3>
              <button
                onClick={handleSaveBulkStock}
                className="bg-syvora-rose hover:bg-syvora-rose-dark text-white text-xs px-6 py-3 rounded-xl font-bold uppercase tracking-wider shadow-luxury"
              >
                Save Bulk Stock Updates
              </button>
            </div>

            <div className="bg-white/90 border border-syvora-border rounded-3xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-syvora-champagne/30 border-b border-syvora-border text-syvora-muted uppercase text-[10px] font-bold">
                      <th className="p-4">Product</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Low Stock Threshold</th>
                      <th className="p-4">Current Stock Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-syvora-border/60">
                    {inventory.map(item => (
                      <tr key={item.id} className="hover:bg-syvora-champagne/20">
                        <td className="p-4 font-bold text-syvora-charcoal">{item.name}</td>
                        <td className="p-4 font-mono text-[11px]">{item.sku}</td>
                        <td className="p-4">{item.category_name}</td>
                        <td className="p-4 text-syvora-muted">{item.low_stock_threshold} items</td>
                        <td className="p-4">
                          <input
                            type="number"
                            value={inventoryStockMap[item.id] !== undefined ? inventoryStockMap[item.id] : item.stock}
                            onChange={e => setInventoryStockMap({ ...inventoryStockMap, [item.id]: parseInt(e.target.value) || 0 })}
                            className="w-24 bg-syvora-ivory border border-syvora-border rounded-xl p-2 font-bold text-center outline-none focus:border-syvora-rose"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 8. REVIEWS MODERATION TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Customer Review Moderation ({reviews.length})</h3>
            <div className="bg-white/90 border border-syvora-border rounded-3xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-syvora-champagne/30 border-b border-syvora-border text-syvora-muted uppercase text-[10px] font-bold">
                      <th className="p-4">Product</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Comment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-syvora-border/60">
                    {reviews.map(rev => (
                      <tr key={rev.id} className="hover:bg-syvora-champagne/20">
                        <td className="p-4 font-bold text-syvora-charcoal">{rev.product_name}</td>
                        <td className="p-4">{rev.user_name}</td>
                        <td className="p-4 font-bold text-amber-500">★ {rev.rating}</td>
                        <td className="p-4 max-w-xs truncate">{rev.comment}</td>
                        <td className="p-4 uppercase text-[10px] font-bold">{rev.status}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleModerateReview(rev.id, 'approved')} className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded font-bold text-[10px]">Approve</button>
                          <button onClick={() => handleModerateReview(rev.id, 'hidden')} className="px-2 py-1 bg-amber-50 text-amber-800 rounded font-bold text-[10px]">Hide</button>
                          <button onClick={() => handleModerateReview(rev.id, 'deleted')} className="p-1 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 9. STORE SETTINGS TAB */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white/90 border border-syvora-border p-8 rounded-3xl shadow-soft space-y-6 text-xs max-w-2xl">
            <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Store Configuration & Payment Rules</h3>

            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none font-medium"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">USD to BDT Exchange Rate (1 USD = ? BDT)</label>
              <input
                type="number"
                value={settings.usdToBdtRate || 120}
                onChange={e => setSettings({ ...settings, usdToBdtRate: parseFloat(e.target.value) })}
                className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none font-bold"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Announcement Bar Message</label>
              <input
                type="text"
                value={settings.announcementBarText || ''}
                onChange={e => setSettings({ ...settings, announcementBarText: e.target.value })}
                className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury"
            >
              Save Store Settings
            </button>
          </form>
        )}
      </main>

      {/* Product Form Modal */}
      {isProductModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          categories={categories}
          onClose={() => setIsProductModalOpen(false)}
          onSuccess={loadDashboardData}
        />
      )}

      {/* Full Customer Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-syvora-charcoal/80 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-syvora-ivory border border-syvora-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-syvora-border pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-syvora-rose block tracking-wider">Full Order & Customer Details</span>
                <h3 className="font-serif text-2xl font-bold text-syvora-charcoal">Order #{selectedOrderDetails.order_number}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingOrder(!isEditingOrder)}
                  className="px-3 py-1.5 bg-syvora-rose text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md hover:bg-syvora-rose-dark transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {isEditingOrder ? 'Cancel Edit' : 'Edit Customer & Order Info'}
                </button>
                <button onClick={() => setSelectedOrderDetails(null)} className="p-2 text-syvora-muted hover:text-syvora-charcoal bg-syvora-champagne/60 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isEditingOrder ? (
              <form onSubmit={handleSaveOrderEdits} className="space-y-4 bg-white/90 p-5 rounded-2xl border border-syvora-border text-xs">
                <h4 className="font-bold text-syvora-charcoal uppercase tracking-wider text-[11px] text-syvora-rose flex items-center gap-1 border-b border-syvora-border pb-2">
                  <Edit3 className="w-4 h-4" /> Admin Edit Customer Information & Order Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editCustomerName}
                      onChange={e => setEditCustomerName(e.target.value)}
                      className="w-full bg-syvora-ivory text-syvora-charcoal p-2.5 rounded-xl border border-syvora-border font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Customer Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={editCustomerPhone}
                      onChange={e => setEditCustomerPhone(e.target.value)}
                      className="w-full bg-syvora-ivory text-syvora-charcoal p-2.5 rounded-xl border border-syvora-border font-bold text-syvora-rose outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Customer Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editCustomerEmail}
                      onChange={e => setEditCustomerEmail(e.target.value)}
                      className="w-full bg-syvora-ivory text-syvora-charcoal p-2.5 rounded-xl border border-syvora-border outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={editTrackingNumber}
                      onChange={e => setEditTrackingNumber(e.target.value)}
                      className="w-full bg-syvora-ivory text-syvora-charcoal p-2.5 rounded-xl border border-syvora-border font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider block mb-1">Full Shipping Destination Address *</label>
                  <textarea
                    rows={2}
                    required
                    value={editAddressText}
                    onChange={e => setEditAddressText(e.target.value)}
                    className="w-full bg-syvora-ivory text-syvora-charcoal p-2.5 rounded-xl border border-syvora-border font-medium outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Order Status</label>
                    <select
                      value={editOrderStatus}
                      onChange={e => setEditOrderStatus(e.target.value)}
                      className="w-full bg-syvora-ivory text-syvora-charcoal p-2.5 rounded-xl border border-syvora-border font-bold outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Payment Status</label>
                    <select
                      value={editPaymentStatus}
                      onChange={e => setEditPaymentStatus(e.target.value)}
                      className="w-full bg-syvora-ivory text-syvora-charcoal p-2.5 rounded-xl border border-syvora-border font-bold outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider block mb-1">Order Total Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editTotal}
                      onChange={e => setEditTotal(parseFloat(e.target.value))}
                      className="w-full bg-syvora-ivory text-syvora-charcoal p-2.5 rounded-xl border border-syvora-border font-bold text-syvora-rose outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-syvora-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingOrder(false)}
                    className="px-4 py-2 bg-syvora-champagne text-syvora-charcoal rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-syvora-charcoal text-syvora-ivory hover:bg-syvora-rose transition-colors rounded-xl font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save Order Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Customer & Shipping Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/90 p-5 rounded-2xl border border-syvora-border">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-syvora-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <User className="w-4 h-4 text-syvora-rose" /> Customer Contact Info
                    </h4>
                    <p className="font-bold text-sm text-syvora-charcoal">{selectedOrderDetails.customer_name}</p>
                    <p className="text-syvora-muted flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-syvora-muted" /> {selectedOrderDetails.customer_email}</p>
                    <p className="text-syvora-rose font-bold flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-syvora-rose" /> {selectedOrderDetails.customer_phone}</p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-syvora-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-syvora-rose" /> Shipping Destination Address
                    </h4>
                    <p className="text-syvora-charcoal/90 leading-relaxed font-medium">
                      {renderAddressText(selectedOrderDetails.shipping_address)}
                    </p>
                    <div className="pt-1 flex gap-2 text-[10px] font-bold">
                      <span className="bg-syvora-champagne text-syvora-charcoal px-2 py-0.5 rounded">
                        Method: {selectedOrderDetails.delivery_method} Shipping
                      </span>
                      <span className="bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded uppercase">
                        Payment: {selectedOrderDetails.payment_method} ({selectedOrderDetails.payment_status})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <h4 className="font-bold text-syvora-charcoal uppercase tracking-wider text-[11px]">Ordered Product Items</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Array.isArray(selectedOrderDetails.items) && selectedOrderDetails.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-syvora-border">
                        <div className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg border border-syvora-border" />}
                          <div>
                            <h5 className="font-bold text-syvora-charcoal">{item.name}</h5>
                            <div className="text-[10px] text-syvora-muted">
                              SKU: {item.sku || 'N/A'} {item.variant ? `• Option: ${item.variant.name}` : ''}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-syvora-rose">{formatPrice(item.subtotal || (item.price * item.quantity))}</span>
                          <span className="text-[10px] text-syvora-muted block">Qty: {item.quantity} × {formatPrice(item.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotal Breakdown */}
                <div className="bg-syvora-champagne/30 p-4 rounded-2xl border border-syvora-border space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(selectedOrderDetails.subtotal)}</span>
                  </div>
                  {selectedOrderDetails.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span className="font-semibold">-{formatPrice(selectedOrderDetails.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-semibold">{formatPrice(selectedOrderDetails.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-syvora-charcoal pt-2 border-t border-syvora-border">
                    <span>Grand Total</span>
                    <span className="text-syvora-rose">{formatPrice(selectedOrderDetails.total)}</span>
                  </div>
                </div>

                {/* Internal Admin Notes */}
                <div className="space-y-2 pt-2 border-t border-syvora-border">
                  <label className="font-bold uppercase tracking-wider text-syvora-charcoal block text-[11px] flex items-center gap-1">
                    <FileText className="w-4 h-4 text-syvora-rose" /> Internal Admin Notes
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type internal notes regarding this order (e.g. Special gift message requested)..."
                      value={internalNotes}
                      onChange={e => setInternalNotes(e.target.value)}
                      className="flex-1 bg-white text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveInternalNotes(selectedOrderDetails.id)}
                      className="bg-syvora-charcoal hover:bg-syvora-rose text-white text-xs px-4 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setSelectedOrderForInvoice(selectedOrderDetails)}
                className="bg-white border border-syvora-border hover:bg-syvora-champagne text-syvora-rose font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Full Invoice
              </button>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="bg-syvora-charcoal text-white text-xs px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Profile Details Modal */}
      {selectedCustomerDetails && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-syvora-charcoal/70 backdrop-blur-xs">
          <div className="bg-syvora-ivory border border-syvora-border p-6 rounded-3xl max-w-lg w-full space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-syvora-border pb-3">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Customer Profile Info</h3>
              <button onClick={() => setSelectedCustomerDetails(null)}><X className="w-5 h-5 text-syvora-muted" /></button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-syvora-border space-y-2">
              <p><strong className="text-syvora-charcoal">Name:</strong> {selectedCustomerDetails.name}</p>
              <p><strong className="text-syvora-charcoal">Email:</strong> {selectedCustomerDetails.email}</p>
              <p><strong className="text-syvora-charcoal">Phone:</strong> {selectedCustomerDetails.phone || 'N/A'}</p>
              <p><strong className="text-syvora-charcoal">Total Lifetime Spend:</strong> <span className="text-syvora-rose font-bold">{formatPrice(selectedCustomerDetails.total_spent || 0)}</span></p>
              <p><strong className="text-syvora-charcoal">Total Orders Placed:</strong> {selectedCustomerDetails.total_orders || 0}</p>
            </div>

            <button
              onClick={() => setSelectedCustomerDetails(null)}
              className="w-full bg-syvora-charcoal text-white py-3 rounded-xl font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Printable Invoice View Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-syvora-charcoal/80">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-4">
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="absolute top-4 right-4 bg-stone-200 p-2 rounded-full font-bold text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <PrintableInvoice order={selectedOrderForInvoice} />
          </div>
        </div>
      )}
    </div>
  );
};
