'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Template, EditableFields, DesignConfig } from '@/types';
import { templatesData } from '@/data/templates';

interface CartContextType {
  cart: CartItem[];
  addToCart: (template: Template, customization?: EditableFields, designConfig?: DesignConfig) => void;
  removeFromCart: (customizedId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  discount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with initial items to match the screenshot showing 2 items in cart!
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('ink_ivory_cart') || localStorage.getItem('cardly_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        // fallback
      }
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('ink_ivory_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (template: Template, customization?: EditableFields, designConfig?: DesignConfig) => {
    const newItem: CartItem = {
      template,
      customization: customization || template.defaultFields,
      designConfig: designConfig || template.designConfig,
      customizedId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      quantity: 1,
    };
    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (customizedId: string) => {
    setCart((prev) => prev.filter((item) => item.customizedId !== customizedId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ink_ivory_cart');
    localStorage.removeItem('cardly_cart');
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'INK10' || normalized === 'INKIVORY10' || normalized === 'IVORY10' || normalized === 'CARDLY10' || normalized === 'WELCOME10') {
      setAppliedCoupon(normalized);
      setDiscountPercent(10);
      return true;
    }
    if (normalized === 'WEDDING20' || normalized === 'SAVE20') {
      setAppliedCoupon(normalized);
      setDiscountPercent(20);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  const totalRaw = cart.reduce((sum, item) => sum + item.template.price, 0);
  const discount = Math.round((totalRaw * discountPercent) / 100);
  const totalPrice = Math.max(0, totalRaw - discount);
  const totalItems = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
        discount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

