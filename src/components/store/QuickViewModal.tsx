import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check, Plus, Minus, ArrowRight } from 'lucide-react';
import { Product, Variant } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { parseProductImages, handleImageError } from '../../utils/imageUtils';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigate: (page: string, param?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onNavigate }) => {
  if (!product) return null;

  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const images = parseProductImages(product.images);
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants && product.variants.length ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState<number>(1);

  const isWishlisted = wishlist.some(p => p.id === product.id);
  const activePrice = selectedVariant?.price || product.sale_price || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-syvora-charcoal/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-syvora-ivory border border-syvora-border shadow-2xl rounded-3xl max-w-3xl w-full p-6 sm:p-8 overflow-hidden z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-syvora-muted hover:text-syvora-charcoal bg-syvora-champagne/60 hover:bg-syvora-champagne rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Gallery Column */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-syvora-champagne/30 border border-syvora-border">
              <img
                src={selectedImage || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      (selectedImage || images[0]) === img
                        ? 'border-syvora-rose shadow-xs'
                        : 'border-syvora-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-syvora-rose">
                {product.brand || 'Syvora Beauty'}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-syvora-charcoal mt-1 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-syvora-charcoal">{product.rating || 5.0}</span>
                <span className="text-xs text-syvora-muted">({product.review_count || 0} reviews)</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-syvora-rose">
                {formatPrice(activePrice)}
              </span>
              {product.sale_price && product.sale_price < product.price && (
                <span className="text-sm text-syvora-muted line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="text-xs text-syvora-muted leading-relaxed line-clamp-3">
              {product.short_description || product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-syvora-charcoal uppercase tracking-wider block">
                  Select Option:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        selectedVariant?.name === v.name
                          ? 'border-syvora-rose bg-syvora-rose/10 text-syvora-rose-dark'
                          : 'border-syvora-border text-syvora-charcoal hover:bg-syvora-champagne/40'
                      }`}
                    >
                      {v.name} {v.size ? `(${v.size})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability */}
            <div className="text-xs">
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-rose-600 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-syvora-border rounded-xl bg-syvora-ivory">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-syvora-champagne text-syvora-charcoal rounded-l-xl"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-syvora-champagne text-syvora-charcoal rounded-r-xl"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'border-syvora-border text-syvora-charcoal hover:bg-syvora-champagne'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Full Details Link */}
            <div className="pt-3 border-t border-syvora-border text-center">
              <button
                onClick={() => {
                  onClose();
                  onNavigate('product', product.slug);
                }}
                className="text-xs text-syvora-rose font-bold hover:underline inline-flex items-center gap-1"
              >
                View Full Product Details & Ingredients <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
