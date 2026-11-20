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
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('you_are_mine_wishlist') ||
        localStorage.getItem('ink_ivory_wishlist') ||
        localStorage.getItem('cardly_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch {
      // fallback
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('you_are_mine_wishlist', JSON.stringify(wishlist));
      localStorage.setItem('ink_ivory_wishlist', JSON.stringify(wishlist));
      localStorage.removeItem('cardly_wishlist');
    } catch {}
  }, [wishlist, isLoaded]);

  const toggleWishlist = (template: Template) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === template.id);
      const updated = exists ? prev.filter((item) => item.id !== template.id) : [...prev, template];
      try {
        localStorage.setItem('you_are_mine_wishlist', JSON.stringify(updated));
        localStorage.setItem('ink_ivory_wishlist', JSON.stringify(updated));
      } catch {}
      return updated;
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

