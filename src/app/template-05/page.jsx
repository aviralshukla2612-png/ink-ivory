'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function Template05Inner() {
  const searchParams = useSearchParams();
  const queryString = searchParams ? searchParams.toString() : '';
  const src = queryString ? `/template-05.html?${queryString}` : '/template-05.html';
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMsg = (e) => {
      if (e.data && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(e.data, '*');
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#fbf4e4]">
      <iframe
        ref={iframeRef}
        src={src}
        title="Template 05 - Arun & Meenakshi Traditional South Indian Wedding Invitation"
        className="w-full h-full border-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        allow="autoplay; encrypted-media; clipboard-write"
      />
    </div>
  );
}

export default function Template05Page() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-[#fbf4e4] text-[#6b1030] font-serif text-lg">
          Opening traditional wedding invitation...
        </div>
      }
    >
      <Template05Inner />
    </Suspense>
  );
}
