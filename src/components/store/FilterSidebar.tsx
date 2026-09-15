import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Star } from 'lucide-react';
import { Category } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';

interface FilterState {
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  inStock: boolean;
  onSale: boolean;
  sortBy: string;
}

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset
}) => {
  const { formatPrice } = useCurrency();

  const brands = ['Syvora Beauty', 'Syvora Cosmetics', 'Syvora Hair Care', 'Maison Syvora', 'Syvora Tools', 'Syvora Body'];

  return (
    <div className="bg-white/60 border border-syvora-border p-6 rounded-3xl shadow-soft space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-syvora-border pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-syvora-rose" />
          <h3 className="font-serif text-base font-bold text-syvora-charcoal">Filter Products</h3>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-semibold text-syvora-muted hover:text-syvora-rose flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={e => onFilterChange({ sortBy: e.target.value })}
          className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl px-3 py-2.5 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
        >
          <option value="featured">Featured Collection</option>
          <option value="newest">Newest Arrivals</option>
          <option value="bestseller">Best Sellers</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Customer Rated</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block">
          Categories
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange({ category: '' })}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-between ${
              !filters.category ? 'bg-syvora-rose text-white font-semibold' : 'text-syvora-charcoal hover:bg-syvora-champagne/40'
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.slug })}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-between ${
                filters.category === cat.slug ? 'bg-syvora-rose text-white font-semibold' : 'text-syvora-charcoal hover:bg-syvora-champagne/40'
              }`}
            >
              <span>{cat.name}</span>
              <span className="opacity-70 text-[10px]">({cat.product_count || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-2 border-t border-syvora-border">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold uppercase tracking-wider text-syvora-charcoal">
            Max Price
          </label>
          <span className="font-bold text-syvora-rose">{formatPrice(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={filters.maxPrice}
          onChange={e => onFilterChange({ maxPrice: parseFloat(e.target.value) })}
          className="w-full accent-syvora-rose cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-syvora-muted">
          <span>{formatPrice(100)}</span>
          <span>{formatPrice(5000)}</span>
        </div>
      </div>

      {/* Brands Filter */}
      <div className="space-y-2 pt-2 border-t border-syvora-border">
        <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block">
          Brand
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ brand: '' })}
            className={`w-full text-left px-3 py-1 rounded-lg text-xs font-medium ${
              !filters.brand ? 'bg-syvora-champagne text-syvora-rose font-bold' : 'text-syvora-charcoal hover:bg-syvora-champagne/30'
            }`}
          >
            All Brands
          </button>
          {brands.map(b => (
            <button
              key={b}
              onClick={() => onFilterChange({ brand: filters.brand === b ? '' : b })}
              className={`w-full text-left px-3 py-1 rounded-lg text-xs font-medium ${
                filters.brand === b ? 'bg-syvora-rose text-white font-bold' : 'text-syvora-charcoal hover:bg-syvora-champagne/30'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Options (Stock & Sale) */}
      <div className="space-y-3 pt-2 border-t border-syvora-border text-xs font-semibold text-syvora-charcoal">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={e => onFilterChange({ inStock: e.target.checked })}
            className="w-4 h-4 rounded border-syvora-border accent-syvora-rose cursor-pointer"
          />
          <span>In Stock Only</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={e => onFilterChange({ onSale: e.target.checked })}
            className="w-4 h-4 rounded border-syvora-border accent-syvora-rose cursor-pointer"
          />
          <span>On Sale Items</span>
        </label>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2 pt-2 border-t border-syvora-border">
        <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block">
          Minimum Rating
        </label>
        <div className="flex gap-1">
          {[4, 4.5, 4.8].map(r => (
            <button
              key={r}
              onClick={() => onFilterChange({ rating: filters.rating === r ? 0 : r })}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 ${
                filters.rating === r
                  ? 'border-syvora-rose bg-syvora-rose/10 text-syvora-rose-dark'
                  : 'border-syvora-border text-syvora-muted hover:bg-syvora-champagne/30'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {r}+
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
