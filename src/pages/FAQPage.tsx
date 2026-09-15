import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: 'ordering',
      question: 'How do I place an order with Syvora?',
      answer: 'Placing an order is simple! Browse our catalog, select your desired product variants, add them to your shopping cart, and proceed to checkout. Enter your shipping address and select your preferred payment method (bKash, Nagad, Card, PayPal, or Cash on Delivery) to confirm.'
    },
    {
      category: 'payments',
      question: 'What payment methods are supported?',
      answer: 'For customers in Bangladesh, we support bKash, Nagad, Rocket, SSLCommerz card payments, and Cash on Delivery (COD). For international & US customers, we support Visa, MasterCard, American Express, Stripe, and PayPal.'
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally and to Bangladesh?',
      answer: 'Yes! We offer worldwide international shipping as well as nationwide delivery across all 64 districts in Bangladesh. Express local delivery takes 1-2 days, while standard international shipping takes 5-7 business days.'
    },
    {
      category: 'returns',
      question: 'What is your return & exchange policy?',
      answer: 'We offer a 30-day return policy for unopened or lightly tested products. If you are unsatisfied with your formula, contact concierge@syvora.com for a prepaid return label and full refund.'
    },
    {
      category: 'security',
      question: 'Are your products authentic and safe for sensitive skin?',
      answer: 'All Syvora formulas are 100% authentic, dermatologically tested, cruelty-free, and formulated without harsh parabens or sulfates.'
    },
    {
      category: 'shipping',
      question: 'How can I track my order after purchasing?',
      answer: 'Once your order is confirmed, you will receive an Order ID and Tracking Number. You can enter this anytime on our "Track Order" page to see real-time status updates.'
    }
  ];

  const filteredFaqs = activeCategory === 'all' ? faqs : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-syvora-rose block">Help Center</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-syvora-charcoal">Frequently Asked Questions</h1>
        <p className="text-xs text-syvora-muted max-w-md mx-auto">
          Find instant answers to common questions about ordering, payments, shipping, and returns.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-2 flex-wrap text-xs font-semibold">
        {[
          { id: 'all', label: 'All FAQs' },
          { id: 'ordering', label: 'Ordering' },
          { id: 'payments', label: 'Payments' },
          { id: 'shipping', label: 'Shipping' },
          { id: 'returns', label: 'Returns' },
          { id: 'security', label: 'Authenticity & Safety' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeCategory === cat.id
                ? 'bg-syvora-rose text-white border-syvora-rose shadow-xs'
                : 'bg-white border-syvora-border text-syvora-charcoal hover:bg-syvora-champagne/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white/80 border border-syvora-border rounded-2xl overflow-hidden shadow-soft transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between font-serif text-base font-bold text-syvora-charcoal hover:text-syvora-rose transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-syvora-rose transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="p-5 pt-0 text-xs text-syvora-charcoal/80 leading-relaxed border-t border-syvora-border/40 font-sans">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
