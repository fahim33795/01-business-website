import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Instagram, Facebook, Youtube } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onNavigate: (page: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      showToast('Thank you for subscribing to Syvora VIP Club!', 'success');
      setEmail('');
    } else {
      showToast('Please enter a valid email address.', 'warning');
    }
  };

  return (
    <footer className="bg-syvora-charcoal text-syvora-ivory pt-16 pb-12 border-t border-syvora-border/20">
      {/* Brand Value Pillars / Why Choose Syvora */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-syvora-rose/10 flex items-center justify-center text-syvora-rose mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold tracking-wide mb-1">100% Authentic</h4>
            <p className="text-xs text-syvora-muted">Directly sourced luxury formulas</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-syvora-rose/10 flex items-center justify-center text-syvora-rose mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold tracking-wide mb-1">Express Delivery</h4>
            <p className="text-xs text-syvora-muted">Fast worldwide & BD shipping</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-syvora-rose/10 flex items-center justify-center text-syvora-rose mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold tracking-wide mb-1">Easy Returns</h4>
            <p className="text-xs text-syvora-muted">30-day hassle-free policy</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-syvora-rose/10 flex items-center justify-center text-syvora-rose mb-3">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold tracking-wide mb-1">24/7 Dedicated Support</h4>
            <p className="text-xs text-syvora-muted">Beauty concierge assistance</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="font-serif text-3xl font-bold tracking-wider text-syvora-ivory block uppercase">
                Syvora
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-syvora-rose font-semibold block -mt-1">
                Beauty & Lifestyle
              </span>
            </div>

            <p className="text-xs text-syvora-muted leading-relaxed max-w-sm">
              Discover carefully selected luxury beauty and lifestyle essentials designed to elevate your everyday self-care routine with Syvora.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-syvora-rose mb-2">
                Join the Syvora Privé Club
              </h5>
              {subscribed ? (
                <div className="bg-syvora-rose/20 text-syvora-rose text-xs p-3 rounded-xl border border-syvora-rose/30">
                  ✨ Welcome to the VIP list! Check your inbox for your 10% welcome coupon code.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/5 text-syvora-ivory placeholder-syvora-muted text-xs rounded-l-xl px-4 py-3 border border-white/10 outline-none focus:border-syvora-rose transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-syvora-rose hover:bg-syvora-rose-dark text-syvora-ivory px-5 rounded-r-xl transition-colors flex items-center justify-center text-xs font-semibold uppercase tracking-wider"
                  >
                    Subscribe <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-syvora-ivory">Explore Shop</h4>
            <ul className="space-y-2 text-xs text-syvora-muted">
              <li><button onClick={() => onNavigate('shop', 'category=skincare')} className="hover:text-syvora-rose transition-colors">Skincare</button></li>
              <li><button onClick={() => onNavigate('shop', 'category=makeup')} className="hover:text-syvora-rose transition-colors">Makeup</button></li>
              <li><button onClick={() => onNavigate('shop', 'category=haircare')} className="hover:text-syvora-rose transition-colors">Haircare</button></li>
              <li><button onClick={() => onNavigate('shop', 'category=body-care')} className="hover:text-syvora-rose transition-colors">Body Care</button></li>
              <li><button onClick={() => onNavigate('shop', 'category=fragrance')} className="hover:text-syvora-rose transition-colors">Fragrance</button></li>
              <li><button onClick={() => onNavigate('shop', 'category=beauty-tools')} className="hover:text-syvora-rose transition-colors">Beauty Tools</button></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-syvora-ivory">Customer Care</h4>
            <ul className="space-y-2 text-xs text-syvora-muted">
              <li><button onClick={() => onNavigate('contact')} className="hover:text-syvora-rose transition-colors">Contact Concierge</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-syvora-rose transition-colors">FAQ & Help Center</button></li>
              <li><button onClick={() => onNavigate('tracking')} className="hover:text-syvora-rose transition-colors">Track Your Order</button></li>
              <li><button onClick={() => onNavigate('faq', 'tab=shipping')} className="hover:text-syvora-rose transition-colors">Shipping Policy</button></li>
              <li><button onClick={() => onNavigate('faq', 'tab=returns')} className="hover:text-syvora-rose transition-colors">Return & Refund Policy</button></li>
            </ul>
          </div>

          {/* Company & Socials Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-syvora-ivory">Company</h4>
            <ul className="space-y-2 text-xs text-syvora-muted">
              <li><button onClick={() => onNavigate('about')} className="hover:text-syvora-rose transition-colors">About Syvora</button></li>
              <li><button onClick={() => onNavigate('faq', 'tab=privacy')} className="hover:text-syvora-rose transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('faq', 'tab=terms')} className="hover:text-syvora-rose transition-colors">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('admin')} className="hover:text-syvora-rose transition-colors">Admin Portal</button></li>
            </ul>

            <div className="pt-4">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-syvora-ivory mb-2">Follow Us</h5>
              <div className="flex items-center space-x-3 text-syvora-muted">
                <a href="#instagram" onClick={e => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/5 hover:bg-syvora-rose hover:text-white flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#facebook" onClick={e => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/5 hover:bg-syvora-rose hover:text-white flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#youtube" onClick={e => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/5 hover:bg-syvora-rose hover:text-white flex items-center justify-center transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Payment Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-syvora-muted gap-4">
        <div>
          © {new Date().getFullYear()} <strong>Syvora Beauty & Lifestyle</strong>. All rights reserved. Bangladesh's Premier Beauty Commerce.
        </div>

        {/* Accepted Payment Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider mr-2 text-syvora-muted">Supported Gateways:</span>
          <span className="px-2 py-1 bg-pink-900/50 text-pink-200 border border-pink-700/50 text-[10px] font-bold rounded">bKash (বিকাশ)</span>
          <span className="px-2 py-1 bg-orange-900/50 text-orange-200 border border-orange-700/50 text-[10px] font-bold rounded">Nagad (নগদ)</span>
          <span className="px-2 py-1 bg-purple-900/50 text-purple-200 border border-purple-700/50 text-[10px] font-bold rounded">Rocket (রকেট)</span>
          <span className="px-2 py-1 bg-blue-900/50 text-blue-200 border border-blue-700/50 text-[10px] font-bold rounded">SSLCommerz (Cards)</span>
          <span className="px-2 py-1 bg-emerald-900/50 text-emerald-200 border border-emerald-700/50 text-[10px] font-bold rounded">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
        </div>
      </div>
    </footer>
  );
};
