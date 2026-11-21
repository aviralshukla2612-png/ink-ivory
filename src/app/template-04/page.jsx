'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function Template04Inner() {
  const searchParams = useSearchParams();
  const queryString = searchParams ? searchParams.toString() : '';
  const src = queryString ? `/template-04.html?${queryString}` : '/template-04.html';
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
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#f4d6cc]">
      <iframe
        ref={iframeRef}
        src={src}
        title="Template 04 - Tara & Kabir Paper Palace Invitation"
        className="w-full h-full border-none"
        allow="autoplay; encrypted-media; clipboard-write"
      />
    </div>
  );
}

export default function Template04Page() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-[#f4d6cc] text-[#5a3a3a] font-serif text-lg">
          Opening paper palace invitation...
        </div>
      }
    >
      <Template04Inner />
    </Suspense>
  );
}
