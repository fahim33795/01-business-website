import React, { useState, useEffect } from 'react';
import { Search, Truck, CheckCircle2, Clock, MapPin, PackageCheck, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigate: (page: string, param?: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ initialOrderNumber, onNavigate }) => {
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { formatPrice } = useCurrency();

  const handleTrack = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumberInput.trim()) return;

    setLoading(true);
    setErrorMsg('');

    api.trackOrder(orderNumberInput.trim())
      .then(res => {
        if (res.success && res.order) {
          setOrder(res.order);
        }
      })
      .catch(err => {
        setOrder(null);
        setErrorMsg(err.message || 'Order not found. Please double-check your Order ID.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleTrack();
    }
  }, [initialOrderNumber]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-syvora-rose block">Parcel Logistics</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-syvora-charcoal">Track Your Order</h1>
        <p className="text-xs text-syvora-muted max-w-md mx-auto">
          Enter your Order ID (e.g. SYV-2026-12345) or Tracking Number to view real-time delivery status.
        </p>
      </div>

      {/* Tracking Input Form */}
      <form onSubmit={handleTrack} className="flex gap-2 max-w-lg mx-auto">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Order ID or Tracking #"
            value={orderNumberInput}
            onChange={e => setOrderNumberInput(e.target.value)}
            className="w-full bg-white text-syvora-charcoal text-xs rounded-xl pl-10 pr-4 py-3.5 border border-syvora-border outline-none focus:border-syvora-rose font-mono uppercase font-bold"
            required
          />
          <Search className="w-4 h-4 text-syvora-muted absolute left-3.5 top-4" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-2xl text-center max-w-lg mx-auto flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Progress Timeline Display */}
      {order && (
        <div className="bg-white/80 border border-syvora-border p-6 sm:p-10 rounded-3xl shadow-soft space-y-10 animate-fade-in">
          {/* Top Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-syvora-border pb-6">
            <div>
              <span className="text-[10px] text-syvora-muted uppercase font-bold tracking-wider block">ORDER NUMBER</span>
              <span className="font-mono text-base font-bold text-syvora-charcoal">{order.order_number}</span>
            </div>
            <div>
              <span className="text-[10px] text-syvora-muted uppercase font-bold tracking-wider block">CURRENT STATUS</span>
              <span className="inline-block bg-syvora-rose/10 text-syvora-rose-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {order.order_status}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-syvora-muted uppercase font-bold tracking-wider block">TRACKING NUMBER</span>
              <span className="font-mono text-xs font-semibold text-syvora-charcoal">{order.tracking_number || 'TRK-PENDING'}</span>
            </div>
          </div>

          {/* Delivery Timeline Graphic */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal">Delivery Progress Timeline</h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {order.timeline?.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-2 rounded-xl bg-syvora-champagne/20">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                      step.current
                        ? 'bg-syvora-rose text-white ring-4 ring-syvora-rose/20 shadow-md scale-110'
                        : step.completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-syvora-border text-syvora-muted'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold ${step.completed || step.current ? 'text-syvora-charcoal' : 'text-syvora-muted'}`}>
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-syvora-border text-xs">
            <div className="space-y-1">
              <h5 className="font-bold text-syvora-charcoal flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <MapPin className="w-4 h-4 text-syvora-rose" /> Delivery Address
              </h5>
              <p className="text-syvora-muted font-medium">{order.customer_name}</p>
              <p className="text-syvora-muted">{order.customer_phone}</p>
              <p className="text-syvora-muted">
                {typeof order.shipping_address === 'object'
                  ? `${order.shipping_address.full_address}, ${order.shipping_address.city}, ${order.shipping_address.country}`
                  : String(order.shipping_address)}
              </p>
            </div>

            <div className="space-y-1">
              <h5 className="font-bold text-syvora-charcoal uppercase tracking-wider text-[11px]">
                Payment & Total
              </h5>
              <p className="text-syvora-muted">Method: <strong className="uppercase">{order.payment_method}</strong></p>
              <p className="text-syvora-muted">Status: <strong className="uppercase text-emerald-700">{order.payment_status}</strong></p>
              <p className="text-syvora-rose font-bold text-sm">Grand Total: {formatPrice(order.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
