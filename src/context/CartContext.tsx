'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Template, EditableFields, DesignConfig } from '@/types';
import { templatesData } from '@/data/templates';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    template: Template,
    customization?: EditableFields,
    designConfig?: DesignConfig,
    draftId?: string,
    customizedId?: string
  ) => void;
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

// Collapses duplicate items of the same template into 1
const deduplicateCart = (items: CartItem[]): CartItem[] => {
  const seenTemplateIds = new Set<string>();
  const result: CartItem[] = [];

  for (const item of items) {
    if (!item?.template?.id) continue;
    // Filter out dummy seeds
    if (item.customizedId === 'cart-init-1' || item.customizedId === 'cart-init-2') continue;

    if (!seenTemplateIds.has(item.template.id)) {
      seenTemplateIds.add(item.template.id);
      result.push({ ...item, quantity: 1 });
    }
  }
  return result;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('you_are_mine_cart') ||
        localStorage.getItem('ink_ivory_cart') ||
        localStorage.getItem('cardly_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = deduplicateCart(parsed);
          setCart(clean);
          localStorage.setItem('you_are_mine_cart', JSON.stringify(clean));
          localStorage.setItem('ink_ivory_cart', JSON.stringify(clean));
        }
      }
    } catch {
      // fallback
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage whenever cart changes (including when emptied!)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('you_are_mine_cart', JSON.stringify(cart));
      localStorage.setItem('ink_ivory_cart', JSON.stringify(cart));
      localStorage.removeItem('cardly_cart');
    } catch {}
  }, [cart, isLoaded]);

  const addToCart = (
    template: Template,
    customization?: EditableFields,
    designConfig?: DesignConfig,
    draftId?: string,
    customizedId?: string
  ) => {
    setCart((prev) => {
      // Find if this item already exists in the cart (by customizedId, draftId, or template.id)
      const existingIndex = prev.findIndex(
        (item) =>
          (customizedId && item.customizedId === customizedId) ||
          (draftId && item.draftId && item.draftId === draftId) ||
          item.template.id === template.id
      );

      let nextCart: CartItem[];

      if (existingIndex >= 0) {
        // Update existing item in-place!
        const existing = prev[existingIndex];
        const updatedItem: CartItem = {
          ...existing,
          template,
          customization: customization || template.defaultFields,
          designConfig: designConfig || template.designConfig,
          draftId: draftId || existing.draftId,
          quantity: 1,
        };
        nextCart = [...prev];
        nextCart[existingIndex] = updatedItem;
      } else {
        // Add new unique item to cart
        const newItem: CartItem = {
          template,
          customization: customization || template.defaultFields,
          designConfig: designConfig || template.designConfig,
          customizedId:
            customizedId || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          quantity: 1,
          draftId,
        };
        nextCart = [...prev, newItem];
      }

      try {
        localStorage.setItem('you_are_mine_cart', JSON.stringify(nextCart));
        localStorage.setItem('ink_ivory_cart', JSON.stringify(nextCart));
      } catch {}
      return nextCart;
    });
  };

  const removeFromCart = (customizedId: string) => {
    setCart((prev) => {
      const nextCart = prev.filter((item) => item.customizedId !== customizedId);
      try {
        localStorage.setItem('you_are_mine_cart', JSON.stringify(nextCart));
        localStorage.setItem('ink_ivory_cart', JSON.stringify(nextCart));
      } catch {}
      return nextCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.setItem('you_are_mine_cart', JSON.stringify([]));
      localStorage.setItem('ink_ivory_cart', JSON.stringify([]));
      localStorage.removeItem('cardly_cart');
    } catch {}
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

