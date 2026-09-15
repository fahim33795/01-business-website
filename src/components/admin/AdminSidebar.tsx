import React from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Ticket,
  Boxes,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateStore: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, onNavigateStore }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { id: 'customers', label: 'Customer Database', icon: Users },
    { id: 'coupons', label: 'Discount Coupons', icon: Ticket },
    { id: 'inventory', label: 'Inventory Control', icon: Boxes },
    { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-syvora-charcoal text-syvora-ivory min-h-screen p-4 flex flex-col justify-between shrink-0 shadow-2xl">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 mb-6">
          <span className="font-serif text-2xl font-bold tracking-wider text-syvora-ivory block uppercase">
            Syvora
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-syvora-rose font-bold block">
            Admin Management
          </span>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-syvora-rose text-white shadow-luxury'
                    : 'text-syvora-ivory/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-white/10 space-y-2">
        <button
          onClick={onNavigateStore}
          className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium text-syvora-rose hover:bg-white/5 transition-colors flex items-center justify-between"
        >
          <span>Visit Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={logout}
          className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>
    </aside>
  );
};
