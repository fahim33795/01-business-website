import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, Plus, Minus, ArrowRight } from 'lucide-react';
import { Product, Variant } from '../types';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ReviewSection } from '../components/store/ReviewSection';
import { ProductCard } from '../components/store/ProductCard';
import { QuickViewModal } from '../components/store/QuickViewModal';
import { parseProductImages, handleImageError } from '../utils/imageUtils';

interface ProductDetailProps {
  slug: string;
  onNavigate: (page: string, param?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ slug, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'benefits' | 'howToUse'>('description');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { formatPrice } = useCurrency();
  const { addToCart, setIsCartOpen } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    api.getProduct(slug)
      .then(res => {
        if (res.success && res.product) {
          setProduct(res.product);
          const imgs = parseProductImages(res.product.images);
          setSelectedImage(imgs[0]);
          if (res.product.variants && res.product.variants.length) {
            setSelectedVariant(res.product.variants[0]);
          } else {
            setSelectedVariant(null);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-syvora-muted">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-syvora-charcoal">Product Not Found</h2>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-syvora-charcoal text-syvora-ivory text-xs px-6 py-3 rounded-xl font-bold uppercase tracking-wider"
        >
          Back To Shop
        </button>
      </div>
    );
  }

  const images = parseProductImages(product.images);
  const isWishlisted = wishlist.some(p => p.id === product.id);
  const activePrice = selectedVariant?.price || product.sale_price || product.price;

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    onNavigate('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Product Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-syvora-champagne/30 border border-syvora-border shadow-soft relative group">
            <img
              src={selectedImage || images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    (selectedImage || images[0]) === img
                      ? 'border-syvora-rose shadow-md scale-105'
                      : 'border-syvora-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-syvora-rose">
                {product.brand || 'Syvora Beauty'}
              </span>
              <span className="text-xs text-syvora-muted font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-syvora-charcoal mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-syvora-charcoal">{product.rating || 5.0}</span>
              <span className="text-xs text-syvora-muted">({product.review_count || 0} reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-2 border-t border-syvora-border">
            <span className="text-3xl font-bold text-syvora-rose">
              {formatPrice(activePrice)}
            </span>
            {product.sale_price && product.sale_price < product.price && (
              <span className="text-base text-syvora-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-syvora-charcoal/80 leading-relaxed font-sans">
            {product.short_description || product.description}
          </p>

          {/* Variant Picker */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block">
                Select Size / Shade Option:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      selectedVariant?.name === v.name
                        ? 'border-syvora-rose bg-syvora-rose/10 text-syvora-rose-dark shadow-xs'
                        : 'border-syvora-border text-syvora-charcoal hover:bg-syvora-champagne/40'
                    }`}
                  >
                    {v.name} {v.size ? `(${v.size})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="text-xs">
            {product.stock > 0 ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> In Stock ({product.stock} items ready to ship)
              </span>
            ) : (
              <span className="text-rose-600 font-semibold">Currently Out of Stock</span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-4 border-t border-syvora-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-syvora-border rounded-xl bg-syvora-ivory">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-syvora-champagne text-syvora-charcoal rounded-l-xl"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-syvora-champagne text-syvora-charcoal rounded-r-xl"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity, selectedVariant)}
                disabled={product.stock <= 0}
                className="flex-1 bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'border-syvora-border text-syvora-charcoal hover:bg-syvora-champagne'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full bg-syvora-rose hover:bg-syvora-rose-dark text-white text-xs py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Buy Now (Express Checkout)
            </button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-syvora-border text-[11px] text-center text-syvora-muted">
            <div className="p-2 rounded-xl bg-syvora-champagne/40">
              <Truck className="w-4 h-4 mx-auto mb-1 text-syvora-rose" />
              <span>Fast Shipping</span>
            </div>
            <div className="p-2 rounded-xl bg-syvora-champagne/40">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-syvora-rose" />
              <span>100% Authentic</span>
            </div>
            <div className="p-2 rounded-xl bg-syvora-champagne/40">
              <RefreshCw className="w-4 h-4 mx-auto mb-1 text-syvora-rose" />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Product Details (Description, Ingredients, Benefits, How to Use) */}
      <div className="bg-white/70 border border-syvora-border p-6 sm:p-10 rounded-3xl shadow-soft space-y-6">
        <div className="flex border-b border-syvora-border space-x-6 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 transition-colors ${
              activeTab === 'description' ? 'border-b-2 border-syvora-rose text-syvora-rose' : 'text-syvora-muted hover:text-syvora-charcoal'
            }`}
          >
            Full Description
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 transition-colors ${
              activeTab === 'ingredients' ? 'border-b-2 border-syvora-rose text-syvora-rose' : 'text-syvora-muted hover:text-syvora-charcoal'
            }`}
          >
            Botanical Ingredients
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 transition-colors ${
              activeTab === 'benefits' ? 'border-b-2 border-syvora-rose text-syvora-rose' : 'text-syvora-muted hover:text-syvora-charcoal'
            }`}
          >
            Key Benefits
          </button>
          <button
            onClick={() => setActiveTab('howToUse')}
            className={`pb-3 transition-colors ${
              activeTab === 'howToUse' ? 'border-b-2 border-syvora-rose text-syvora-rose' : 'text-syvora-muted hover:text-syvora-charcoal'
            }`}
          >
            How to Use
          </button>
        </div>

        <div className="text-xs sm:text-sm text-syvora-charcoal/90 leading-relaxed">
          {activeTab === 'description' && (
            <p className="whitespace-pre-line">{product.description}</p>
          )}
          {activeTab === 'ingredients' && (
            <div className="space-y-2">
              <p className="font-mono text-xs bg-syvora-champagne/40 p-4 rounded-2xl border border-syvora-border">
                {product.ingredients || 'Aqua/Water, Botanical Extracts, Hyaluronic Acid, Tocopherol, Essential Botanical Fragrance Oils.'}
              </p>
              <p className="text-[11px] text-syvora-muted italic">Formulated without parabens, sulfates, phthalates, or synthetic dyes. Cruelty-free.</p>
            </div>
          )}
          {activeTab === 'benefits' && (
            <div className="whitespace-pre-line leading-loose font-medium">
              {product.benefits || '• Restores radiant glow\n• Deeply hydrates skin barrier\n• Lightweight non-comedogenic formula'}
            </div>
          )}
          {activeTab === 'howToUse' && (
            <div className="whitespace-pre-line leading-relaxed">
              {product.how_to_use || 'Apply 2-3 drops to clean skin morning and night. Smooth gently over face and neck until absorbed.'}
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection productId={product.id} />

      {/* Related Products Carousel */}
      {product.related && product.related.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-syvora-border">
          <h3 className="font-serif text-2xl font-bold text-syvora-charcoal">You May Also Love</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {product.related.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                onNavigate={onNavigate}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
