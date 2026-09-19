import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck, Truck, CreditCard, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

interface CheckoutStepsProps {
  onOrderSuccess: (orderData: any) => void;
  onNavigate: (page: string, param?: string) => void;
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ onOrderSuccess, onNavigate }) => {
  const { cart, subtotal, discountAmount, appliedCoupon, clearCart } = useCart();
  const { currency, formatPrice } = useCurrency();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Customer Contact (Full Name * & Mobile Phone Number * ONLY - Always start completely blank)
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Shipping Address (Division/District *, City/Thana *, Full Delivery Address * ONLY)
  const [country] = useState<'Bangladesh'>('Bangladesh');
  const [state, setState] = useState('Dhaka');
  const [city, setCity] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  // Delivery Method (Inside Dhaka: 80 Taka | Outside Dhaka: 130 Taka)
  const [deliveryMethod, setDeliveryMethod] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');

  // Payment Method (bKash, Nagad, Rocket, COD - SSLCommerz removed)
  const [paymentMethod, setPaymentMethod] = useState<string>('bkash');

  // Calculate Shipping (BDT)
  const shippingFee = deliveryMethod === 'Inside Dhaka' ? 80 : 130;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const validateStep = (currentStep: number): boolean => {
    if (currentStep >= 1) {
      if (!customerName.trim()) {
        showToast('Full Name (আপনার নাম) পূরণ করা আবশ্যক!', 'warning');
        return false;
      }
      if (!customerPhone.trim()) {
        showToast('Mobile Phone Number (মোবাইল নম্বর) পূরণ করা আবশ্যক!', 'warning');
        return false;
      }
    }
    if (currentStep >= 2) {
      if (!state.trim()) {
        showToast('Division / District সিলেক্ট করা আবশ্যক!', 'warning');
        return false;
      }
      if (!city.trim()) {
        showToast('City / Thana (থানা বা এলাকা) পূরণ করা আবশ্যক!', 'warning');
        return false;
      }
      if (!fullAddress.trim()) {
        showToast('Full Delivery Address (সম্পূর্ণ ঠিকানা) দেওয়া আবশ্যক!', 'warning');
        return false;
      }
    }
    if (currentStep >= 3) {
      if (!deliveryMethod) {
        showToast('Delivery Method সিলেক্ট করা আবশ্যক!', 'warning');
        return false;
      }
    }
    return true;
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep < step) {
      // Going backwards to previous steps is allowed
      setStep(targetStep);
      return;
    }

    // To move forward to targetStep, all preceding steps must be valid
    for (let i = 1; i < targetStep; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }

    setStep(targetStep);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(step)) {
      return;
    }

    setStep(prev => Math.min(prev + 1, 4));
  };

  const handlePlaceOrder = async () => {
    // Strict mandatory check for all steps
    if (!validateStep(3)) {
      return;
    }
    if (!paymentMethod) {
      showToast('Payment Method বেছে দেওয়া আবশ্যক!', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const emailToUse = customerEmail || (user?.email) || `${customerPhone.replace(/[^0-9]/g, '') || 'customer'}@syvora.com`;
      const orderPayload = {
        customer_name: customerName,
        customer_email: emailToUse,
        customer_phone: customerPhone,
        shipping_address: {
          country,
          state,
          city,
          full_address: fullAddress
        },
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        items: cart.map(item => {
          const itemPrice = item.product.sale_price && item.product.sale_price < item.product.price ? item.product.sale_price : item.product.price;
          return {
            id: item.product.id,
            name: item.product.name,
            price: itemPrice,
            original_price: item.product.price,
            quantity: item.quantity,
            variant: item.selectedVariant || null,
            image: Array.isArray(item.product.images) ? item.product.images[0] : item.product.images || '',
            sku: item.product.sku || `SYV-PROD-${item.product.id}`,
            subtotal: itemPrice * item.quantity
          };
        }),
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        currency
      };

      const res = await api.createOrder(orderPayload);

      if (res.success) {
        const orderData = res.order || {
          id: Date.now(),
          order_number: res.orderNumber || `SYV-${Date.now()}`,
          customer_name: customerName,
          customer_email: emailToUse,
          customer_phone: customerPhone,
          shipping_address: { country, state, city, full_address: fullAddress },
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
          payment_status: 'pending',
          order_status: 'pending',
          items: cart,
          subtotal,
          shipping_fee: shippingFee,
          total: grandTotal,
          created_at: new Date().toISOString()
        };

        // Trigger celebratory confetti burst!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        clearCart();
        showToast('Your order has been placed successfully!', 'success');
        onOrderSuccess(orderData);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to process order.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Checkout Progress Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { id: 1, title: 'Contact' },
            { id: 2, title: 'Address' },
            { id: 3, title: 'Delivery' },
            { id: 4, title: 'Payment' }
          ].map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleStepClick(s.id)}
              className="flex flex-col items-center relative z-10 cursor-pointer focus:outline-none group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.id
                    ? 'bg-syvora-rose text-white shadow-luxury ring-4 ring-syvora-rose/20 scale-110'
                    : step > s.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-syvora-champagne text-syvora-muted group-hover:bg-syvora-border'
                }`}
              >
                {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
              </div>
              <span className={`text-[11px] font-semibold mt-2 transition-colors ${step >= s.id ? 'text-syvora-charcoal font-bold' : 'text-syvora-muted'}`}>
                {s.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Forms (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white/80 border border-syvora-border p-6 sm:p-8 rounded-3xl shadow-soft space-y-6">
          {/* STEP 1: Customer Contact */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Step 1: Customer Information</h3>
              <p className="text-xs text-syvora-muted">Enter your name and mobile number to proceed with order delivery.</p>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Write your name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01700-000000"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center gap-2"
                >
                  Continue to Address <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Shipping Address */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Step 2: Shipping Address</h3>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Division / District *
                </label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
                >
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                  <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                  <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                  <option value="Khulna">Khulna (খুলনা)</option>
                  <option value="Barishal">Barishal (বরিশাল)</option>
                  <option value="Rangpur">Rangpur (রংপুর)</option>
                  <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  City / Thana *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uttara, Mirpur, Dhanmondi..."
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Full Delivery Address *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="House #, Road #, Flat/Apartment #, Landmark..."
                  value={fullAddress}
                  onChange={e => setFullAddress(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-syvora-muted hover:text-syvora-charcoal flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Contact
                </button>
                <button
                  type="submit"
                  className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center gap-2"
                >
                  Continue to Delivery <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Delivery Options */}
          {step === 3 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Delivery Method</h3>

              <div className="space-y-3">
                <label
                  onClick={() => setDeliveryMethod('Inside Dhaka')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    deliveryMethod === 'Inside Dhaka'
                      ? 'border-syvora-rose bg-syvora-rose/10 shadow-xs'
                      : 'border-syvora-border hover:bg-syvora-champagne/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-syvora-rose" />
                    <div>
                      <h4 className="text-xs font-bold text-syvora-charcoal">Inside Dhaka</h4>
                      <p className="text-[11px] text-syvora-muted">Fast delivery within Dhaka city area</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-syvora-rose">80 Taka</span>
                </label>

                <label
                  onClick={() => setDeliveryMethod('Outside Dhaka')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    deliveryMethod === 'Outside Dhaka'
                      ? 'border-syvora-rose bg-syvora-rose/10 shadow-xs'
                      : 'border-syvora-border hover:bg-syvora-champagne/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-xs font-bold text-syvora-charcoal">Outside Dhaka</h4>
                      <p className="text-[11px] text-syvora-muted">Courier delivery across outer districts of Bangladesh</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-syvora-rose">130 Taka</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-syvora-muted hover:text-syvora-charcoal flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Address
                </button>
                <button
                  type="submit"
                  className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center gap-2"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Payment Method Selection */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Step 4: Payment Method</h3>

              <div className="space-y-3">
                {[
                  { id: 'bkash', name: 'bKash (বিকাশ)', desc: 'Instant payment via bKash App or Personal/Merchant Cash In', color: 'bg-pink-50 border-pink-300 text-pink-900' },
                  { id: 'nagad', name: 'Nagad (নগদ)', desc: 'Instant payment via Nagad App or USSD (*167#)', color: 'bg-orange-50 border-orange-300 text-orange-900' },
                  { id: 'rocket', name: 'Rocket (রকেট)', desc: 'Dutch-Bangla Bank Rocket Wallet payment', color: 'bg-purple-50 border-purple-300 text-purple-900' },
                  { id: 'cod', name: 'Cash on Delivery (ক্যাশ অন ডেলিভারি)', desc: 'পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে টাকা দিন', color: 'bg-emerald-50 border-emerald-300 text-emerald-900' }
                ].map(p => (
                  <label
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === p.id ? p.color : 'border-syvora-border hover:bg-syvora-champagne/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold">{p.name}</h4>
                        <p className="text-[11px] opacity-80">{p.desc}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === p.id}
                      onChange={() => setPaymentMethod(p.id)}
                      className="accent-syvora-rose"
                    />
                  </label>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-semibold text-syvora-muted hover:text-syvora-charcoal flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Delivery
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="bg-syvora-rose hover:bg-syvora-rose-dark text-white text-xs px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Processing Order...' : `Confirm & Place Order (${formatPrice(grandTotal)})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-syvora-champagne/30 border border-syvora-border p-6 rounded-3xl space-y-6">
          <h4 className="font-serif text-lg font-bold text-syvora-charcoal border-b border-syvora-border pb-3">
            Order Summary ({cart.length} items)
          </h4>

          {/* Cart Item Mini List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map((item, idx) => {
              const itemPrice = item.selectedVariant?.price || item.product.sale_price || item.product.price;
              const img = Array.isArray(item.product.images) ? item.product.images[0] : item.product.images;

              return (
                <div key={idx} className="flex items-center gap-3 bg-white/70 p-2.5 rounded-xl border border-syvora-border/60">
                  <img src={img} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0 border border-syvora-border" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-syvora-charcoal truncate">{item.product.name}</h5>
                    <div className="text-[10px] text-syvora-muted">
                      Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-syvora-rose shrink-0">
                    {formatPrice(itemPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Subtotals Breakdown */}
          <div className="space-y-2 text-xs border-t border-syvora-border pt-4">
            <div className="flex justify-between text-syvora-charcoal">
              <span className="text-syvora-muted">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({appliedCoupon.code})</span>
                <span className="font-semibold">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-syvora-charcoal">
              <span className="text-syvora-muted">Shipping Fee</span>
              <span className="font-semibold">
                {formatPrice(shippingFee)}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-syvora-charcoal pt-3 border-t border-syvora-border">
              <span>Total Amount</span>
              <span className="text-syvora-rose">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Security Guarantee Badge */}
          <div className="flex items-center gap-2 p-3 bg-syvora-ivory/80 rounded-xl border border-syvora-border text-xs text-syvora-muted">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-[11px] leading-snug">
              Encrypted & Secure Checkout. Your order details are safe with Syvora Beauty.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

