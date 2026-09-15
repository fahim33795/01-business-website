import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { parseProductImages } from '../../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, param?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, onQuickView }) => {
  const { formatPrice } = useCurrency();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const images = parseProductImages(product.images);
  const primaryImage = images[0];
  const secondaryImage = images[1] || primaryImage;

  const isWishlisted = wishlist.some(p => p.id === product.id);

  const activePrice = product.sale_price && product.sale_price < product.price ? product.sale_price : product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0;

  return (
    <div
      className="group relative bg-white/70 border border-syvora-border/60 rounded-2xl overflow-hidden shadow-soft hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-square overflow-hidden bg-syvora-champagne/30 cursor-pointer" onClick={() => onNavigate('product', product.slug)}>
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.new_arrival && (
            <span className="bg-syvora-charcoal text-syvora-ivory text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              NEW
            </span>
          )}
          {product.best_seller && (
            <span className="bg-syvora-rose text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> BEST SELLER
            </span>
          )}
          {hasDiscount && (
            <span className="bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-stone-800 text-stone-300 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md scale-110'
              : 'bg-white/80 backdrop-blur-xs text-syvora-charcoal hover:bg-white hover:text-syvora-rose shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-syvora-ivory/90 hover:bg-syvora-ivory text-syvora-charcoal text-xs font-semibold py-2.5 px-4 rounded-xl shadow-luxury backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors border border-syvora-border"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-syvora-muted uppercase tracking-wider mb-1">
            <span>{product.brand || 'Syvora'}</span>
            <div className="flex items-center text-amber-500 gap-0.5 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              <span className="text-syvora-muted text-[9px]">({product.review_count || 0})</span>
            </div>
          </div>

          <h3
            onClick={() => onNavigate('product', product.slug)}
            className="font-sans text-xs font-bold text-syvora-charcoal line-clamp-2 hover:text-syvora-rose cursor-pointer transition-colors leading-snug mb-2"
          >
            {product.name}
          </h3>
        </div>

        {/* Price and Add to Cart Button */}
        <div className="pt-2 border-t border-syvora-border/40 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-syvora-rose">
              {formatPrice(activePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-syvora-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold ${
              product.stock > 0
                ? 'bg-syvora-charcoal text-syvora-ivory hover:bg-syvora-rose hover:shadow-md'
                : 'bg-syvora-border text-syvora-muted cursor-not-allowed'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
