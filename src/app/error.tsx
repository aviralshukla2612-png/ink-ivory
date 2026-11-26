'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely for diagnostics
    console.error('App Router Caught Client Error:', error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center py-16 bg-[#FDFBF7]"
    >
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white border border-[#EADBCE] shadow-sm flex flex-col items-center">
        {/* Luxury Gold Monogram Emblem */}
        <div className="w-16 h-16 rounded-full bg-[#FAF5EE] border border-[#D4AF37]/40 flex items-center justify-center mb-6 shadow-inner">
          <svg
            className="w-8 h-8 text-[#991B1B]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-serif text-[#2A0216] mb-3 tracking-wide">
          An Unexpected Interruption
        </h2>

        {/* Description */}
        <p className="text-sm text-[#7A644E] mb-6 leading-relaxed max-w-sm">
          We encountered an unexpected error while loading this page. Your invitation drafts and saved designs remain completely safe.
        </p>

        {error?.digest && (
          <p className="text-[11px] font-mono text-[#A38A75] mb-6 bg-[#FBF8F4] px-3 py-1 rounded border border-[#EADBCE]">
            Reference Code: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#3B021F] text-[#FAF5EE] text-sm font-medium hover:bg-[#2A0216] active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#D4AF37]/60 text-[#3B021F] bg-[#FAF5EE]/50 hover:bg-[#FAF5EE] text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
