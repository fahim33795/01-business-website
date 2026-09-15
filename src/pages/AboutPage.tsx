import React from 'react';
import { Sparkles, ShieldCheck, Heart, Leaf, Award } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Banner */}
      <section className="relative py-20 bg-syvora-champagne/40 border-b border-syvora-border overflow-hidden text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4 relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-syvora-rose block">Our Story</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-syvora-charcoal">
            Elevating Everyday Self-Care Rituals
          </h1>
          <p className="text-sm text-syvora-charcoal/80 max-w-xl mx-auto leading-relaxed">
            At Syvora, we believe beauty is an intimate form of self-love. Our formulations blend high-performance botanical ingredients with sensory textures to awaken skin radiance and inner confidence.
          </p>
        </div>
      </section>

      {/* Brand Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/80 border border-syvora-border p-8 rounded-3xl shadow-soft text-center space-y-3">
            <div className="w-12 h-12 bg-syvora-rose/10 text-syvora-rose rounded-full flex items-center justify-center mx-auto mb-2">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Clean Botanical Formulations</h3>
            <p className="text-xs text-syvora-muted leading-relaxed">
              Formulated with cold-pressed botanical oils, plant hydrosols, and multi-weight Hyaluronic Acid. Free of parabens, sulfates, and synthetic irritants.
            </p>
          </div>

          <div className="bg-white/80 border border-syvora-border p-8 rounded-3xl shadow-soft text-center space-y-3">
            <div className="w-12 h-12 bg-syvora-rose/10 text-syvora-rose rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-syvora-charcoal">100% Authentic & Cruelty-Free</h3>
            <p className="text-xs text-syvora-muted leading-relaxed">
              We never test on animals and ethically source every raw ingredient directly from sustainable global cosmetic laboratories.
            </p>
          </div>

          <div className="bg-white/80 border border-syvora-border p-8 rounded-3xl shadow-soft text-center space-y-3">
            <div className="w-12 h-12 bg-syvora-rose/10 text-syvora-rose rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Uncompromising Quality</h3>
            <p className="text-xs text-syvora-muted leading-relaxed">
              Every batch undergoes strict safety checks to ensure maximum purity, stability, and luxurious application.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="font-serif text-3xl font-bold text-syvora-charcoal">Ready to Experience Syvora?</h2>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury"
        >
          Explore Luxury Catalog
        </button>
      </section>
    </div>
  );
};
