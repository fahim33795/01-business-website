import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';

import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { CartDrawer } from './components/store/CartDrawer.tsx';

import { Home } from './pages/Home.tsx';
import { Shop } from './pages/Shop.tsx';
import { ProductDetail } from './pages/ProductDetail.tsx';
import { CheckoutSteps } from './components/checkout/CheckoutSteps.tsx';
import { OrderSuccessPage } from './pages/OrderSuccessPage.tsx';
import { OrderTrackingPage } from './pages/OrderTrackingPage.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { FAQPage } from './pages/FAQPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { AccountPage } from './pages/AccountPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { Order } from './types/index.ts';

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
