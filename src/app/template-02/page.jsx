'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function Template02Inner() {
  const searchParams = useSearchParams();
  const queryString = searchParams ? searchParams.toString() : '';
  const src = queryString ? `/template-02.html?${queryString}` : '/template-02.html';

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#22332a]">
      <iframe
        src={src}
        title="Template 02 - Arjun & Sia Luxury Wedding Invitation"
        className="w-full h-full border-none"
        allow="autoplay; encrypted-media"
      />
    </div>
  );
}

export default function Template02Page() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-[#22332a] text-[#f6e9c8] font-serif text-lg">
          Opening wedding invitation...
        </div>
      }
    >
      <Template02Inner />
    </Suspense>
  );
}
