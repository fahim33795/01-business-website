import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

interface WishlistPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const { formatPrice } = useCurrency();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-syvora-rose block">Saved Favorites</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-syvora-charcoal">My Wishlist</h1>
        <p className="text-xs text-syvora-muted max-w-md mx-auto">
          Keep track of your favorite beauty & lifestyle essentials for your next self-care haul.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-syvora-champagne/30 rounded-3xl border border-syvora-border max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Your Wishlist is Empty</h3>
          <p className="text-xs text-syvora-muted">
            Click the heart icon on any product card to save your favorite luxury products.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-syvora-charcoal text-syvora-ivory text-xs px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-syvora-rose transition-colors inline-flex items-center gap-2"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(product => {
            const activePrice = product.sale_price && product.sale_price < product.price ? product.sale_price : product.price;
            const images = Array.isArray(product.images) ? product.images : [product.images];

            return (
              <div key={product.id} className="bg-white/80 border border-syvora-border rounded-2xl overflow-hidden shadow-soft flex flex-col justify-between">
                <div className="relative aspect-square cursor-pointer" onClick={() => onNavigate('product', product.slug)}>
                  <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.id); }}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-rose-600 rounded-full shadow-xs"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-syvora-muted uppercase tracking-wider block">{product.brand}</span>
                    <h4
                      onClick={() => onNavigate('product', product.slug)}
                      className="text-xs font-bold text-syvora-charcoal hover:text-syvora-rose cursor-pointer line-clamp-2"
                    >
                      {product.name}
                    </h4>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-syvora-border">
                    <span className="text-sm font-bold text-syvora-rose">{formatPrice(activePrice)}</span>
                    <button
                      onClick={() => moveToCart(product)}
                      className="w-full bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
