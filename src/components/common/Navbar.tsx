import React, { useState, useEffect, useRef, FC, FormEvent } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X, ChevronDown, Sparkles, LogOut, PackageCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { parseProductImages, handleImageError } from '../../utils/imageUtils';

interface NavbarProps {
  onNavigate: (page: string, param?: string) => void;
  currentPage: string;
}

export const Navbar: FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getCategories().then((res: any) => {
      if (res.success) setCategories(res.categories || []);
    }).catch(() => { });
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const timer = setTimeout(() => {
        api.searchSuggestions(searchQuery).then((res: any) => {
          if (res.success) setSuggestions(res.suggestions || []);
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', `search=${encodeURIComponent(searchQuery.trim())}`);
      setSuggestions([]);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-syvora-ivory/95 backdrop-blur-md border-b border-syvora-border transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-syvora-charcoal text-syvora-ivory text-xs py-2 px-4 font-medium tracking-wide flex items-center justify-between gap-2">
        <div className="flex items-center justify-center gap-2 flex-1 text-center">
          <Sparkles className="w-3.5 h-3.5 text-syvora-rose animate-pulse" />
          <span>🇧🇩 সারা বাংলাদেশে ৩,০০০ টাকার অর্ডারে ফ্রি ডেলিভারি | কুপন কোড: <strong>WELCOME10</strong> (১০% ডিসকাউন্ট)</span>
        </div>
        <button
          onClick={() => onNavigate('admin')}
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-syvora-rose hover:text-white px-3 py-0.5 rounded-full bg-white/10 hover:bg-syvora-rose transition-all"
        >
          ⚙️ Admin Panel
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-syvora-charcoal hover:text-syvora-rose transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="text-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-syvora-charcoal block uppercase">
                Syvora
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-syvora-rose font-semibold block -mt-1">
                Beauty & Lifestyle
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide text-syvora-charcoal">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-syvora-rose transition-colors py-2 relative ${currentPage === 'home' ? 'text-syvora-rose font-semibold border-b-2 border-syvora-rose' : ''
                }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className={`hover:text-syvora-rose transition-colors py-2 relative ${currentPage === 'shop' ? 'text-syvora-rose font-semibold border-b-2 border-syvora-rose' : ''
                }`}
            >
              Shop
            </button>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-syvora-rose transition-colors py-2">
                Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 w-64 bg-syvora-ivory border border-syvora-border shadow-luxury rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="grid grid-cols-1 gap-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => onNavigate('shop', `category=${cat.slug}`)}
                      className="text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-syvora-champagne/50 hover:text-syvora-rose transition-colors flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-syvora-muted font-normal">({cat.product_count || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('shop', 'filter=new')}
              className="hover:text-syvora-rose transition-colors py-2"
            >
              New Arrivals
            </button>

            <button
              onClick={() => onNavigate('shop', 'filter=bestsellers')}
              className="hover:text-syvora-rose transition-colors py-2"
            >
              Best Sellers
            </button>

            <button
              onClick={() => onNavigate('about')}
              className={`hover:text-syvora-rose transition-colors py-2 ${currentPage === 'about' ? 'text-syvora-rose font-semibold' : ''
                }`}
            >
              About Us
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className={`hover:text-syvora-rose transition-colors py-2 ${currentPage === 'contact' ? 'text-syvora-rose font-semibold' : ''
                }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Toggle */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-syvora-charcoal hover:text-syvora-rose transition-colors"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Modal Input */}
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-96 bg-syvora-ivory border border-syvora-border shadow-luxury rounded-2xl p-3 z-50 animate-fade-in">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Search skincare, lipsticks, perfumes..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-syvora-champagne/40 text-syvora-charcoal placeholder-syvora-muted text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none border border-syvora-border focus:border-syvora-rose transition-all"
                      autoFocus
                    />
                    <Search className="w-4 h-4 text-syvora-muted absolute left-3" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 text-syvora-muted hover:text-syvora-charcoal"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>

                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="mt-3 border-t border-syvora-border pt-2 max-h-64 overflow-y-auto">
                      <div className="text-[10px] uppercase font-semibold text-syvora-muted tracking-wider px-2 mb-1">
                        Matching Products
                      </div>
                      {suggestions.map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            onNavigate('product', s.slug);
                            setSuggestions([]);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-syvora-champagne/50 rounded-lg cursor-pointer transition-colors"
                        >
                          <img
                            src={parseProductImages(s.images)[0]}
                            alt={s.name}
                            className="w-10 h-10 object-cover rounded-md"
                            onError={handleImageError}
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-medium text-syvora-charcoal truncate">{s.name}</h5>
                            <span className="text-[10px] text-syvora-muted">{s.brand}</span>
                          </div>
                          <span className="text-xs font-semibold text-syvora-rose">
                            {formatPrice(s.sale_price || s.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 text-syvora-charcoal hover:text-syvora-rose transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-syvora-rose text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Icon / Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (user) {
                    setIsUserMenuOpen(!isUserMenuOpen);
                  } else {
                    onNavigate('account');
                  }
                }}
                className="p-2 text-syvora-charcoal hover:text-syvora-rose transition-colors relative"
                title={user ? user.name : 'Account'}
              >
                <User className="w-5 h-5" />
              </button>

              {user && isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-syvora-ivory border border-syvora-border shadow-luxury rounded-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-syvora-border mb-1">
                    <p className="text-xs font-bold text-syvora-charcoal truncate">{user.name}</p>
                    <p className="text-[10px] text-syvora-muted truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('account');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-syvora-champagne/50 transition-colors flex items-center gap-2 text-syvora-charcoal"
                  >
                    <User className="w-3.5 h-3.5" /> My Account
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('account', 'tab=orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-syvora-champagne/50 transition-colors flex items-center gap-2 text-syvora-charcoal"
                  >
                    <PackageCheck className="w-3.5 h-3.5" /> My Orders
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-syvora-charcoal hover:text-syvora-ivory transition-colors flex items-center gap-2 text-syvora-rose font-semibold"
                    >
                      ★ Admin Dashboard
                    </button>
                  )}

                  <div className="border-t border-syvora-border mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 bg-syvora-charcoal text-syvora-ivory hover:bg-syvora-rose rounded-full transition-all relative flex items-center justify-center shadow-md"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-syvora-rose text-white text-[10px] font-bold w-4 h-4 rounded-full border-2 border-syvora-ivory flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-syvora-border bg-syvora-ivory p-4 animate-fade-in">
          <div className="flex flex-col space-y-3 font-medium text-sm">
            <button
              onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-syvora-rose"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('shop'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-syvora-rose"
            >
              Shop All Products
            </button>
            <button
              onClick={() => { onNavigate('shop', 'filter=new'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-syvora-rose"
            >
              New Arrivals
            </button>

            <div className="py-2">
              <div className="text-xs font-bold text-syvora-muted uppercase tracking-wider mb-2">Categories</div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { onNavigate('shop', `category=${c.slug}`); setIsMobileMenuOpen(false); }}
                    className="text-left text-xs py-1 text-syvora-charcoal hover:text-syvora-rose"
                  >
                    • {c.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { onNavigate('about'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-syvora-rose"
            >
              About Us
            </button>
            <button
              onClick={() => { onNavigate('contact'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-syvora-rose"
            >
              Contact Us
            </button>
            <button
              onClick={() => { onNavigate('faq'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-syvora-rose"
            >
              FAQ & Shipping
            </button>
            <button
              onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 text-syvora-rose font-bold flex items-center gap-1.5 border-t border-syvora-border pt-3 mt-1"
            >
              ⚙️ Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
