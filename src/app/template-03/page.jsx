'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function Template03Inner() {
  const searchParams = useSearchParams();
  const queryString = searchParams ? searchParams.toString() : '';
  const src = queryString ? `/template-03.html?${queryString}` : '/template-03.html';

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#06201a]">
      <iframe
        src={src}
        title="Template 03 - Thirumanam South Indian Temple Wedding Invitation"
        className="w-full h-full border-none"
        allow="autoplay; encrypted-media"
      />
    </div>
  );
}

export default function Template03Page() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-[#06201a] text-[#f8efd6] font-serif text-lg">
          Opening Thirumanam wedding invitation...
        </div>
      }
    >
      <Template03Inner />
    </Suspense>
  );
}
