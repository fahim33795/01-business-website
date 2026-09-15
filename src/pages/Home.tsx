import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Star, Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/store/ProductCard';
import { QuickViewModal } from '../components/store/QuickViewModal';
import { useCurrency } from '../context/CurrencyContext';
import { handleImageError } from '../utils/imageUtils';

interface HomeProps {
  onNavigate: (page: string, param?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { formatPrice } = useCurrency();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCategories(),
      api.getProducts({ newArrival: 'true', limit: 4 }),
      api.getProducts({ bestSeller: 'true', limit: 4 })
    ]).then(([catRes, newRes, bestRes]) => {
      if (catRes.success) setCategories(catRes.categories || []);
      if (newRes.success) setNewArrivals(newRes.products || []);
      if (bestRes.success) setBestSellers(bestRes.products || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center bg-syvora-champagne/40 border-b border-syvora-border overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80"
            alt="Syvora Beauty Collection"
            className="w-full h-full object-cover opacity-90 scale-105 animate-pulse-slow"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-syvora-ivory via-syvora-ivory/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-24">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-syvora-rose/10 border border-syvora-rose/30 text-syvora-rose-dark text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Luxury Self-Care Reimagined
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-syvora-charcoal leading-[1.1] tracking-tight">
              Beauty That Feels Like <span className="italic font-normal text-syvora-rose">You</span>
            </h1>

            <p className="text-sm sm:text-base text-syvora-charcoal/80 leading-relaxed font-sans">
              Discover carefully selected beauty and lifestyle essentials designed to elevate your everyday self-care routine with Syvora.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all shadow-luxury flex items-center gap-2"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('shop', 'filter=bestsellers')}
                className="bg-white/80 hover:bg-white text-syvora-charcoal border border-syvora-border text-xs px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all shadow-xs backdrop-blur-xs"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-syvora-rose block">Curated Collections</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-syvora-charcoal">Explore By Category</h2>
          <p className="text-xs text-syvora-muted">Explore targeted botanical solutions for your skin, hair, and lifestyle.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', `category=${cat.slug}`)}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-soft hover:shadow-luxury transition-all duration-500 border border-syvora-border/60"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-syvora-charcoal/90 via-syvora-charcoal/30 to-transparent transition-opacity group-hover:opacity-90" />
              <div className="absolute bottom-6 left-6 right-6 text-syvora-ivory space-y-1">
                <h3 className="font-serif text-xl font-bold group-hover:text-syvora-champagne transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-syvora-ivory/80 line-clamp-1">{cat.description}</p>
                <div className="pt-2 text-[10px] font-bold uppercase tracking-widest text-syvora-rose flex items-center gap-1">
                  Explore Products <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS DYNAMIC SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-syvora-border pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-syvora-rose block">Just Landed</span>
            <h2 className="font-serif text-3xl font-bold text-syvora-charcoal">New Arrivals</h2>
          </div>
          <button
            onClick={() => onNavigate('shop', 'filter=new')}
            className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal hover:text-syvora-rose transition-colors flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onNavigate={onNavigate}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-syvora-charcoal text-syvora-ivory p-8 sm:p-16 border border-syvora-border shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&q=80"
              alt="Syvora Privé"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-syvora-charcoal via-syvora-charcoal/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-lg space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-syvora-rose block">
              Maison Syvora Fragrance
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Glow More. Feel Better. Live Beautifully.
            </h2>
            <p className="text-xs sm:text-sm text-syvora-ivory/80 leading-relaxed font-sans">
              Experience artisanal French perfumes and cold-pressed botanical oils formulated to transform your daily rituals into moments of pure indulgence.
            </p>
            <button
              onClick={() => onNavigate('shop', 'category=fragrance')}
              className="bg-syvora-rose hover:bg-syvora-rose-dark text-white text-xs px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury inline-flex items-center gap-2"
            >
              Explore Fragrance Collection <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* BEST SELLERS DYNAMIC SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-syvora-border pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-syvora-rose block">Most Loved</span>
            <h2 className="font-serif text-3xl font-bold text-syvora-charcoal">Best Sellers</h2>
          </div>
          <button
            onClick={() => onNavigate('shop', 'filter=bestsellers')}
            className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal hover:text-syvora-rose transition-colors flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onNavigate={onNavigate}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
