import React, { useState, useEffect } from 'react';
import { User, PackageCheck, MapPin, Key, LogOut, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { Order, ShippingAddress } from '../types';

interface AccountPageProps {
  onNavigate: (page: string, param?: string) => void;
  initialTab?: string;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, initialTab }) => {
  const { user, login, register, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const { formatPrice } = useCurrency();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'password'>('profile');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Profile Edit
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Passwords
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');

      setLoadingOrders(true);
      api.getMyOrders()
        .then(res => {
          if (res.success) setOrders(res.orders || []);
        })
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
    } catch (e) {}
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(regName, regEmail, regPassword, regPhone);
    } catch (e) {}
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateProfile({ name: profileName, phone: profilePhone });
      if (res.success && res.user) {
        updateUser(res.user);
        showToast('Profile updated!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.changePassword({ currentPassword: currentPass, newPassword: newPass });
      if (res.success) {
        showToast(res.message, 'success');
        setCurrentPass('');
        setNewPass('');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to change password.', 'error');
    }
  };

  // If Not Logged In -> Show Auth Forms
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-syvora-rose block">Account Portal</span>
          <h1 className="font-serif text-3xl font-bold text-syvora-charcoal">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
        </div>

        {/* Auth Box */}
        <div className="bg-white/80 border border-syvora-border p-6 sm:p-8 rounded-3xl shadow-soft space-y-6">
          <div className="flex border-b border-syvora-border text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 pb-3 transition-colors ${
                mode === 'login' ? 'border-b-2 border-syvora-rose text-syvora-rose' : 'text-syvora-muted'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 pb-3 transition-colors ${
                mode === 'register' ? 'border-b-2 border-syvora-rose text-syvora-rose' : 'text-syvora-muted'
              }`}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Email Address or Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="admin@syvora.com or your@email.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <div className="bg-syvora-champagne/40 p-3 rounded-xl text-[11px] text-syvora-muted border border-syvora-border space-y-1">
                <span className="font-bold text-syvora-charcoal block uppercase tracking-wider text-[10px]">✨ Development Admin Credentials:</span>
                <span>Username: <strong className="text-syvora-rose font-mono">admin</strong></span> | <span>Password: <strong className="text-syvora-rose font-mono">12345</strong></span>
              </div>

              <button
                type="submit"
                className="w-full bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center justify-center gap-2"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sophia Thorne"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (415) 889-1234"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center justify-center gap-2"
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Logged-In Account Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Account Overview Header */}
      <div className="bg-syvora-charcoal text-syvora-ivory p-8 rounded-3xl flex flex-wrap items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-syvora-rose block mb-1">Customer Dashboard</span>
          <h1 className="font-serif text-3xl font-bold">{user.name}</h1>
          <p className="text-xs text-syvora-ivory/70">{user.email} {user.phone ? `• ${user.phone}` : ''}</p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="bg-syvora-rose hover:bg-syvora-rose-dark text-white text-xs px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-luxury"
            >
              ★ Admin Dashboard
            </button>
          )}
          <button
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Tabs Menu (3 cols) */}
        <div className="lg:col-span-3 bg-white/80 border border-syvora-border p-3 rounded-2xl space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'profile' ? 'bg-syvora-rose text-white' : 'text-syvora-charcoal hover:bg-syvora-champagne/40'
            }`}
          >
            <User className="w-4 h-4" /> Profile Info
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'orders' ? 'bg-syvora-rose text-white' : 'text-syvora-charcoal hover:bg-syvora-champagne/40'
            }`}
          >
            <PackageCheck className="w-4 h-4" /> Order History ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'password' ? 'bg-syvora-rose text-white' : 'text-syvora-charcoal hover:bg-syvora-champagne/40'
            }`}
          >
            <Key className="w-4 h-4" /> Security & Password
          </button>
        </div>

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 bg-white/80 border border-syvora-border p-6 sm:p-8 rounded-3xl shadow-soft">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Profile Information</h3>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-syvora-champagne/40 text-syvora-muted rounded-xl p-3 border border-syvora-border cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <button
                type="submit"
                className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
              >
                Save Profile Changes
              </button>
            </form>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">My Orders</h3>

              {loadingOrders ? (
                <p className="text-xs text-syvora-muted">Loading your past orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-xs text-syvora-muted space-y-2">
                  <p>You haven't placed any orders yet.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="text-syvora-rose font-bold hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(ord => (
                    <div key={ord.id} className="bg-syvora-champagne/20 border border-syvora-border p-4 rounded-2xl space-y-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-syvora-border/60 pb-2">
                        <div>
                          <span className="font-bold font-mono text-syvora-charcoal">#{ord.order_number}</span>
                          <span className="text-[10px] text-syvora-muted block">{new Date(ord.created_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="bg-syvora-rose/10 text-syvora-rose-dark px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px]">
                            {ord.order_status}
                          </span>
                        </div>
                        <button
                          onClick={() => onNavigate('tracking', ord.order_number)}
                          className="text-syvora-rose font-bold hover:underline text-[11px]"
                        >
                          Track Parcel →
                        </button>
                      </div>

                      <div className="flex items-center justify-between font-semibold">
                        <span>Total: {formatPrice(ord.total)}</span>
                        <span className="uppercase text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                          {ord.payment_method} ({ord.payment_status})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PASSWORD TAB */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Change Password</h3>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <button
                type="submit"
                className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
