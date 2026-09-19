import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Variant, Coupon } from '../types';
import { useToast } from './ToastContext';
import { api } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: Variant | null) => void;
  updateQuantity: (productId: number, quantity: number, variantName?: string) => void;
  removeFromCart: (productId: number, variantName?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('syvora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('syvora_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('syvora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('syvora_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('syvora_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity: number = 1, selectedVariant: Variant | null = null) => {
    if (product.stock <= 0) {
      showToast(`Sorry, "${product.name}" is currently out of stock.`, 'warning');
      return;
    }

    setCart(prev => {
      const variantKey = selectedVariant ? selectedVariant.name : 'default';
      const existingIndex = prev.findIndex(
        item => item.id === product.id && (item.selectedVariant ? item.selectedVariant.name : 'default') === variantKey
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        const newQty = newCart[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Only ${product.stock} items available in stock.`, 'warning');
          return prev;
        }
        newCart[existingIndex].quantity = newQty;
        return newCart;
      } else {
        return [...prev, { id: product.id, product, quantity, selectedVariant }];
      }
    });

    showToast(`Added ${product.name} to your cart.`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, quantity: number, variantName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantName);
      return;
    }

    setCart(prev => {
      return prev.map(item => {
        const matchesProduct = item.id === productId;
        const matchesVariant = variantName
          ? item.selectedVariant?.name === variantName
          : !item.selectedVariant;

        if (matchesProduct && matchesVariant) {
          if (quantity > item.product.stock) {
            showToast(`Only ${item.product.stock} items available.`, 'warning');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: number, variantName?: string) => {
    setCart(prev =>
      prev.filter(item => {
        const matchesProduct = item.id === productId;
        const matchesVariant = variantName
          ? item.selectedVariant?.name === variantName
          : !item.selectedVariant;
        return !(matchesProduct && matchesVariant);
      })
    );
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.selectedVariant?.price || item.product.sale_price || item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        showToast(res.message, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Invalid coupon code.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  let discountAmount = 0;
  if (appliedCoupon) {
    const couponType = appliedCoupon.discount_type || appliedCoupon.type || 'percent';
    const couponValue = Number(appliedCoupon.discount_value ?? appliedCoupon.value ?? 0);

    if (couponType === 'percent') {
      discountAmount = (subtotal * couponValue) / 100;
      if (appliedCoupon.max_discount && discountAmount > appliedCoupon.max_discount) {
        discountAmount = appliedCoupon.max_discount;
      }
    } else {
      discountAmount = couponValue;
    }
  }

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
