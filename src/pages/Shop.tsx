import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductGrid } from '../components/store/ProductGrid';
import { FilterSidebar } from '../components/store/FilterSidebar';
import { QuickViewModal } from '../components/store/QuickViewModal';
import { SlidersHorizontal, Search, RefreshCw } from 'lucide-react';

interface ShopProps {
  onNavigate: (page: string, param?: string) => void;
  initialParam?: string;
}

export const Shop: React.FC<ShopProps> = ({ onNavigate, initialParam }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 200,
    rating: 0,
    inStock: false,
    onSale: false,
    newArrival: false,
    bestSeller: false,
    sortBy: 'featured',
    page: 1,
    limit: 12
  });

  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Parse initial param passed from URL or Navbar (e.g. category=skincare, search=serum, filter=new)
  useEffect(() => {
    api.getCategories().then(res => {
      if (res.success) setCategories(res.categories || []);
    });

    if (initialParam) {
      if (initialParam.startsWith('category=')) {
        const catSlug = initialParam.replace('category=', '');
        setFilters(prev => ({ ...prev, category: catSlug }));
      } else if (initialParam.startsWith('search=')) {
        const query = decodeURIComponent(initialParam.replace('search=', ''));
        setFilters(prev => ({ ...prev, search: query }));
      } else if (initialParam === 'filter=new') {
        setFilters(prev => ({ ...prev, newArrival: true }));
      } else if (initialParam === 'filter=bestsellers') {
        setFilters(prev => ({ ...prev, bestSeller: true }));
      }
    }
  }, [initialParam]);

  // Fetch products whenever filters change
  useEffect(() => {
    setLoading(true);
    const queryParams: Record<string, any> = {
      search: filters.search,
      category: filters.category,
      brand: filters.brand,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice < 200 ? filters.maxPrice : undefined,
      rating: filters.rating > 0 ? filters.rating : undefined,
      inStock: filters.inStock ? 'true' : undefined,
      onSale: filters.onSale ? 'true' : undefined,
      featured: undefined,
      newArrival: filters.newArrival ? 'true' : undefined,
      bestSeller: filters.bestSeller ? 'true' : undefined,
      sortBy: filters.sortBy,
      page: filters.page,
      limit: filters.limit
    };

    api.getProducts(queryParams)
      .then(res => {
        if (res.success) {
          setProducts(res.products || []);
          if (res.pagination) setPagination(res.pagination);
        }
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 200,
      rating: 0,
      inStock: false,
      onSale: false,
      newArrival: false,
      bestSeller: false,
      sortBy: 'featured',
      page: 1,
      limit: 12
    });
  };

  const activeCategory = categories.find(c => c.slug === filters.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-syvora-champagne/40 border border-syvora-border p-8 rounded-3xl text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-syvora-rose block">
          {activeCategory ? activeCategory.name : 'Catalogue'}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-syvora-charcoal">
          {filters.search ? `Search Results for "${filters.search}"` : activeCategory ? activeCategory.name : 'Shop All Products'}
        </h1>
        <p className="text-xs text-syvora-muted max-w-lg mx-auto">
          {activeCategory ? activeCategory.description : 'Discover carefully selected beauty and lifestyle essentials designed to elevate your everyday self-care routine.'}
        </p>
      </div>

      {/* Active Filter Indicators & Mobile Filter Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/60 p-4 rounded-2xl border border-syvora-border">
        <div className="flex items-center gap-2 text-xs text-syvora-muted">
          <span>Showing <strong>{products.length}</strong> of <strong>{pagination.total}</strong> products</span>
          {(filters.category || filters.search || filters.brand || filters.onSale || filters.inStock) && (
            <button
              onClick={handleResetFilters}
              className="ml-2 text-syvora-rose font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>

        {/* Mobile Filter Trigger Button */}
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="lg:hidden bg-syvora-charcoal text-syvora-ivory px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4 text-syvora-rose" /> Filter & Sort
        </button>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="lg:hidden col-span-1 mb-4">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Products Grid Column */}
        <div className="lg:col-span-3 space-y-8">
          <ProductGrid
            products={products}
            loading={loading}
            onNavigate={onNavigate}
            onQuickView={setQuickViewProduct}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8 border-t border-syvora-border">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                    filters.page === i + 1
                      ? 'bg-syvora-rose text-white shadow-luxury'
                      : 'bg-white border border-syvora-border text-syvora-charcoal hover:bg-syvora-champagne'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
