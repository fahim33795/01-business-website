import React from 'react';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, Truck } from 'lucide-react';
import { Order } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { PrintableInvoice } from '../components/checkout/PrintableInvoice';

interface OrderSuccessPageProps {
  order: Order | null;
  onNavigate: (page: string, param?: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order, onNavigate }) => {
  const { formatPrice } = useCurrency();
  const [showInvoice, setShowInvoice] = React.useState(false);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-syvora-charcoal">No Order Found</h2>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-syvora-charcoal text-white text-xs px-6 py-3 rounded-xl font-bold uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  if (showInvoice) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <button
          onClick={() => setShowInvoice(false)}
          className="text-xs font-semibold text-syvora-muted hover:text-syvora-charcoal underline"
        >
          ← Back to Order Summary
        </button>
        <PrintableInvoice order={order} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8 text-center">
      {/* Celebration Icon */}
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-luxury border-4 border-emerald-50 animate-bounce-short">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block">Order Confirmed!</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-syvora-charcoal">
          Thank You, {order.customer_name}!
        </h1>
        <p className="text-xs sm:text-sm text-syvora-muted max-w-md mx-auto">
          Your order <strong>#{order.order_number}</strong> has been received and is being prepared by our beauty concierge.
        </p>
      </div>

      {/* Order Status Box */}
      <div className="bg-white/80 border border-syvora-border p-6 rounded-3xl shadow-soft text-left space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-syvora-border pb-4 text-xs">
          <div>
            <span className="text-syvora-muted block">Order ID:</span>
            <strong className="font-mono text-sm text-syvora-charcoal">{order.order_number}</strong>
          </div>
          <div>
            <span className="text-syvora-muted block">Tracking Number:</span>
            <strong className="font-mono text-sm text-syvora-rose">{order.tracking_number || 'Pending'}</strong>
          </div>
          <div>
            <span className="text-syvora-muted block">Total Amount:</span>
            <strong className="text-sm text-syvora-rose">{formatPrice(order.total)}</strong>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-syvora-charcoal">Order Items</h4>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-syvora-champagne/30 rounded-xl">
              <div className="flex items-center gap-3">
                {item.image && <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg" />}
                <div>
                  <h5 className="font-bold text-syvora-charcoal">{item.name}</h5>
                  <span className="text-[10px] text-syvora-muted">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="font-bold text-syvora-rose">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setShowInvoice(true)}
          className="bg-white hover:bg-syvora-champagne/40 text-syvora-charcoal border border-syvora-border text-xs px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print Order Invoice
        </button>

        <button
          onClick={() => onNavigate('tracking', order.order_number)}
          className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center gap-2"
        >
          <Truck className="w-4 h-4" /> Track Order Progress
        </button>
      </div>
    </div>
  );
};
