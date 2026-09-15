import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been sent to our concierge team!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-syvora-rose block">Beauty Concierge</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-syvora-charcoal">Get in Touch</h1>
        <p className="text-xs text-syvora-muted max-w-md mx-auto">
          Have a question about a formula, shade recommendation, or your order? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Side */}
        <div className="lg:col-span-5 bg-syvora-charcoal text-syvora-ivory p-8 rounded-3xl shadow-2xl space-y-8">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold">Syvora Concierge</h3>
            <p className="text-xs text-syvora-ivory/80 leading-relaxed">
              Our beauty specialists are available 24/7 to assist with product inquiries, shade matching, and shipment updates.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-syvora-rose shrink-0" />
              <div>
                <strong className="block text-syvora-rose">Global Headquarters</strong>
                <span>100 Luxury Avenue, Suite 500, San Francisco, CA 94115, USA</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-syvora-rose shrink-0" />
              <div>
                <strong className="block text-syvora-rose">Phone Support</strong>
                <span>+1 (800) 555-SYVORA / +880 1700-000000</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-syvora-rose shrink-0" />
              <div>
                <strong className="block text-syvora-rose">Email Support</strong>
                <span>concierge@syvora.com / help@syvora.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-syvora-rose shrink-0" />
              <div>
                <strong className="block text-syvora-rose">Working Hours</strong>
                <span>Mon - Sun: 24/7 Online Concierge Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Side */}
        <div className="lg:col-span-7 bg-white/80 border border-syvora-border p-8 rounded-3xl shadow-soft">
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-syvora-charcoal">Message Delivered!</h3>
              <p className="text-xs text-syvora-muted max-w-sm mx-auto">
                Thank you for contacting Syvora Beauty. One of our concierges will respond to your email within 2 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-syvora-charcoal text-syvora-ivory text-xs px-6 py-3 rounded-xl font-bold uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-serif text-xl font-bold text-syvora-charcoal">Send Us a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophia Thorne"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sophia@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (415) 889-1234"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                    Subject Topic
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose font-medium"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status">Order Status Inquiry</option>
                    <option value="Product Advice">Shade / Product Advice</option>
                    <option value="Returns">Return / Refund Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-syvora-charcoal block mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you today?"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-syvora-ivory text-syvora-charcoal text-xs rounded-xl p-3 border border-syvora-border outline-none focus:border-syvora-rose"
                />
              </div>

              <button
                type="submit"
                className="bg-syvora-charcoal hover:bg-syvora-rose text-syvora-ivory text-xs px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-luxury flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
