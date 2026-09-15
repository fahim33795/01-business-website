import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/store/CartDrawer';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CheckoutSteps } from './components/checkout/CheckoutSteps';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { AboutPage } from './pages/AboutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { Order } from './types';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (window.location.hash === '#/admin' || window.location.pathname === '/admin') {
      return 'admin';
    }
    return 'home';
  });
  const [currentParam, setCurrentParam] = useState<string>('');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#admin') {
        setCurrentPage('admin');
      } else if (hash === '#/shop') {
        setCurrentPage('shop');
      } else if (hash === '#/account') {
        setCurrentPage('account');
      } else if (hash === '' || hash === '#/' || hash === '#home') {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string, param: string = '') => {
    setCurrentPage(page);
    setCurrentParam(param);
    if (page === 'admin') {
      window.location.hash = '#/admin';
    } else if (window.location.hash === '#/admin' || window.location.hash === '#admin') {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderData: Order) => {
    setLatestOrder(orderData);
    handleNavigate('success');
  };

  const isAdminPage = currentPage === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-syvora-ivory text-syvora-charcoal">
      {!isAdminPage && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      <main className="flex-1">
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'shop' && <Shop onNavigate={handleNavigate} initialParam={currentParam} />}
        {currentPage === 'product' && <ProductDetail slug={currentParam} onNavigate={handleNavigate} />}
        {currentPage === 'checkout' && <CheckoutSteps onOrderSuccess={handleOrderSuccess} onNavigate={handleNavigate} />}
        {currentPage === 'success' && <OrderSuccessPage order={latestOrder} onNavigate={handleNavigate} />}
        {currentPage === 'tracking' && <OrderTrackingPage initialOrderNumber={currentParam} onNavigate={handleNavigate} />}
        {currentPage === 'wishlist' && <WishlistPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'faq' && <FAQPage />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'account' && <AccountPage onNavigate={handleNavigate} initialTab={currentParam} />}
        {currentPage === 'admin' && <AdminPage onNavigateStore={() => handleNavigate('home')} />}
      </main>

      {!isAdminPage && <CartDrawer onNavigate={handleNavigate} />}
      {!isAdminPage && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <CurrencyProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ToastProvider>
  );
}
