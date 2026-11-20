'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Template } from '@/types';
import { templatesData } from '@/data/templates';

interface WishlistContextType {
  wishlist: Template[];
  toggleWishlist: (template: Template) => void;
  isInWishlist: (templateId: string) => boolean;
  totalWishlist: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Template[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ink_ivory_wishlist') || localStorage.getItem('cardly_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch {
        // fallback
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ink_ivory_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (template: Template) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === template.id);
      if (exists) {
        return prev.filter((item) => item.id !== template.id);
      } else {
        return [...prev, template];
      }
    });
  };

  const isInWishlist = (templateId: string) => {
    return wishlist.some((item) => item.id === templateId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        totalWishlist: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

