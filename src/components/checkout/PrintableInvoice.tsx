import React from 'react';
import { Printer } from 'lucide-react';
import { Order } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';

interface PrintableInvoiceProps {
  order: Order;
  onClose?: () => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ order }) => {
  const { formatPrice } = useCurrency();

  const handlePrint = () => {
    window.print();
  };

  let address: any = {};
  if (typeof order.shipping_address === 'object' && order.shipping_address !== null) {
    address = order.shipping_address;
  } else if (typeof order.shipping_address === 'string') {
    try {
      address = JSON.parse(order.shipping_address);
    } catch (e) {
      address = { full_address: order.shipping_address };
    }
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const calculatedSubtotal = order.subtotal || items.reduce((acc, it) => acc + (it.subtotal || (it.price * it.quantity)), 0);

  return (
    <div className="bg-white text-stone-900 p-6 sm:p-10 rounded-3xl shadow-luxury border border-syvora-border max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-200 print:hidden">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Official Order Invoice</h2>
          <p className="text-xs text-stone-500">Order #{order.order_number}</p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-syvora-charcoal text-syvora-ivory hover:bg-syvora-rose px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Invoice
        </button>
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="font-serif text-3xl font-bold tracking-wider text-stone-900 block uppercase">
            Syvora
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-amber-600 font-bold block -mt-1">
            Beauty & Lifestyle
          </span>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            House #12, Road #5, Gulshan-2<br />
            Dhaka-1212, Bangladesh 🇧🇩<br />
            Email: concierge@syvora.com | Phone: +880 1700-000000
          </p>
        </div>

        <div className="text-right">
          <div className="bg-stone-100 text-stone-900 px-4 py-2 rounded-xl border border-stone-200 inline-block mb-2">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">INVOICE NUMBER</span>
            <span className="font-mono text-sm font-bold">{order.order_number}</span>
          </div>
          <p className="text-xs text-stone-500">
            Date: {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString()}
          </p>
          {order.tracking_number && (
            <p className="text-xs text-stone-500 mt-0.5">
              Tracking: <strong className="font-mono">{order.tracking_number}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Customer & Shipping Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-6 bg-stone-50 rounded-2xl border border-stone-200">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Billed & Shipped To:</h4>
          <p className="text-sm font-bold text-stone-900">{order.customer_name}</p>
          <p className="text-xs text-stone-600">{order.customer_email}</p>
          {order.customer_phone && <p className="text-xs text-stone-600">{order.customer_phone}</p>}
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            {address.full_address || ''} {address.area ? `, ${address.area}` : ''}<br />
            {address.city || ''}{address.state ? `, ${address.state}` : ''} {address.postal_code || ''}<br />
            {address.country || ''}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Payment Details:</h4>
          <p className="text-xs text-stone-700">
            Method: <strong className="uppercase">{order.payment_method || 'COD'}</strong>
          </p>
          <p className="text-xs text-stone-700 mt-1">
            Payment Status:{' '}
            <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
              order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {order.payment_status || 'pending'}
            </span>
          </p>
          <p className="text-xs text-stone-700 mt-1">
            Order Lifecycle Status:{' '}
            <span className="font-bold text-stone-900">{order.order_status || 'Confirmed'}</span>
          </p>
          <p className="text-xs text-stone-700 mt-1">
            Delivery Method: <strong>{order.delivery_method || 'Standard'} Shipping</strong>
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b-2 border-stone-900 uppercase text-[10px] tracking-wider text-stone-500">
              <th className="pb-3 font-bold">Product Description</th>
              <th className="pb-3 font-bold text-center">SKU</th>
              <th className="pb-3 font-bold text-center">Price</th>
              <th className="pb-3 font-bold text-center">Qty</th>
              <th className="pb-3 font-bold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {items.map((item, idx) => (
              <tr key={idx} className="py-3">
                <td className="py-3">
                  <span className="font-bold text-stone-900 block">{item.name}</span>
                  {item.variant && (
                    <span className="text-[10px] text-stone-500">Option: {item.variant.name}</span>
                  )}
                </td>
                <td className="py-3 text-center font-mono text-[11px]">{item.sku || 'N/A'}</td>
                <td className="py-3 text-center">{formatPrice(item.price)}</td>
                <td className="py-3 text-center font-bold">{item.quantity}</td>
                <td className="py-3 text-right font-bold text-stone-900">{formatPrice(item.subtotal || (item.price * item.quantity))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(calculatedSubtotal)}</span>
          </div>

          {(order.discount || 0) > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Promo Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-stone-600">
            <span>Shipping Fee</span>
            <span className="font-semibold">{(order.shipping_fee || 0) === 0 ? 'FREE' : formatPrice(order.shipping_fee)}</span>
          </div>

          <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t-2 border-stone-900">
            <span>Grand Total</span>
            <span>{formatPrice(order.total || calculatedSubtotal)}</span>
          </div>
        </div>
      </div>

      {/* Invoice Footer */}
      <div className="border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
        <p className="font-serif italic text-sm text-stone-700 mb-1">Thank you for choosing Syvora Beauty & Lifestyle.</p>
        <p className="text-[10px]">For any questions regarding your invoice or shipment, please email concierge@syvora.com</p>
      </div>
    </div>
  );
};
