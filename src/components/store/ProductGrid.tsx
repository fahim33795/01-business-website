import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Sparkles, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onNavigate: (page: string, param?: string) => void;
  onQuickView: (product: Product) => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  onNavigate,
  onQuickView,
  onResetFilters
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-syvora-champagne/40 rounded-2xl p-4 animate-pulse h-80 flex flex-col justify-between">
            <div className="w-full h-48 bg-syvora-border/60 rounded-xl" />
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-syvora-border/60 rounded w-1/3" />
              <div className="h-4 bg-syvora-border/60 rounded w-3/4" />
              <div className="h-4 bg-syvora-border/60 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-syvora-champagne/30 rounded-3xl border border-syvora-border max-w-lg mx-auto">
        <div className="w-16 h-16 bg-syvora-rose/10 text-syvora-rose rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-bold text-syvora-charcoal mb-2">No matching products found</h3>
        <p className="text-xs text-syvora-muted mb-6 leading-relaxed">
          We couldn't find any products matching your selected search or filter criteria. Try adjusting your price range or category filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="bg-syvora-charcoal text-syvora-ivory text-xs px-6 py-3 rounded-xl font-semibold uppercase tracking-wider hover:bg-syvora-rose transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onNavigate={onNavigate}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
