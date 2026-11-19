'use client';

import React, { createContext, useContext, useState } from 'react';

const LenisContext = createContext({
  lenis: null,
  setLenis: () => {},
  scrollTo: () => {},
});

export const LenisProvider = ({ children }) => {
  const [lenis, setLenis] = useState(null);

  const scrollTo = (target, options = {}) => {
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: options.offset ?? 0,
        duration: options.duration ?? 1.2,
        immediate: options.immediate ?? false,
      });
    } else {
      // Fallback
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <LenisContext.Provider value={{ lenis, setLenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenis = () => useContext(LenisContext);
