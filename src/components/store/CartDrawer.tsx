import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

interface CartDrawerProps {
  onNavigate: (page: string, param?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount
  } = useCart();

  const { currency, formatPrice } = useCurrency();
  const [couponCode, setCouponCode] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  if (!isCartOpen) return null;

  // Free shipping progress rule ($75 USD or ৳3000 BDT)
  const freeThresholdUSD = 75;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThresholdUSD) * 100));
  const remainingUSD = Math.max(0, freeThresholdUSD - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setLoadingCoupon(true);
    await applyCoupon(couponCode);
    setLoadingCoupon(false);
    setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-syvora-charcoal/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-syvora-ivory border-l border-syvora-border shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-syvora-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-syvora-rose" />
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Your Cart</h3>
              <span className="text-xs bg-syvora-champagne text-syvora-charcoal font-semibold px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-syvora-muted hover:text-syvora-charcoal rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-syvora-champagne/60 p-4 border-b border-syvora-border text-xs">
            {remainingUSD === 0 ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>🎉 Congratulations! You have unlocked FREE Express Shipping!</span>
              </div>
            ) : (
              <div>
                <p className="text-syvora-charcoal font-medium mb-1.5">
                  Add <strong className="text-syvora-rose">{formatPrice(remainingUSD)}</strong> more to unlock FREE Express Shipping!
                </p>
                <div className="w-full bg-syvora-border rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-syvora-rose h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-syvora-champagne/60 text-syvora-rose rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-syvora-charcoal">Your cart is empty</h4>
                <p className="text-xs text-syvora-muted max-w-xs mx-auto">
                  Explore our luxury skincare, makeup, and lifestyle collection to find your everyday self-care essentials.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="mt-2 bg-syvora-charcoal text-syvora-ivory text-xs px-6 py-3 rounded-xl font-semibold uppercase tracking-wider hover:bg-syvora-rose transition-colors inline-flex items-center gap-2"
                >
                  Start Shopping <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemPrice = item.selectedVariant?.price || item.product.sale_price || item.product.price;
                const itemImages = Array.isArray(item.product.images) ? item.product.images : [item.product.images];

                return (
                  <div key={`${item.id}-${index}`} className="flex gap-4 p-3 bg-white/60 border border-syvora-border/60 rounded-xl shadow-xs">
                    <img
                      src={itemImages[0] || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&q=80'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg shrink-0 border border-syvora-border"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-bold text-syvora-charcoal truncate pr-2">{item.product.name}</h5>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedVariant?.name)}
                            className="text-syvora-muted hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.selectedVariant && (
                          <span className="text-[10px] bg-syvora-champagne text-syvora-muted px-2 py-0.5 rounded font-medium inline-block mt-0.5">
                            {item.selectedVariant.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-syvora-border rounded-lg bg-syvora-ivory">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant?.name)}
                            className="p-1 hover:bg-syvora-champagne text-syvora-charcoal rounded-l-lg"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant?.name)}
                            className="p-1 hover:bg-syvora-champagne text-syvora-charcoal rounded-r-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-syvora-rose">
                          {formatPrice(itemPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-syvora-border bg-syvora-ivory space-y-4">
              {/* Promo Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-900 text-xs p-2.5 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied ({formatPrice(discountAmount)} OFF)</span>
                  </div>
                  <button onClick={removeCoupon} className="text-rose-600 font-bold hover:underline text-[10px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 bg-syvora-champagne/40 text-syvora-charcoal placeholder-syvora-muted text-xs rounded-xl px-3 py-2 outline-none border border-syvora-border focus:border-syvora-rose uppercase"
                  />
                  <button
                    type="submit"
                    disabled={loadingCoupon}
                    className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-4 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Subtotal Breakdown */}
              <div className="space-y-1.5 text-xs text-syvora-charcoal">
                <div className="flex justify-between">
                  <span className="text-syvora-muted">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-syvora-muted">Estimated Shipping</span>
                  <span className="font-semibold">
                    {remainingUSD === 0 ? 'FREE' : 'Calculated at checkout'}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-syvora-border text-sm font-bold text-syvora-charcoal">
                  <span>Grand Total</span>
                  <span className="text-syvora-rose text-base">{formatPrice(Math.max(0, subtotal - discountAmount))}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('checkout');
                }}
                className="w-full bg-syvora-charcoal text-syvora-ivory hover:bg-syvora-rose text-xs py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs text-syvora-muted hover:text-syvora-charcoal py-1"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
