'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface AdminPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  itemName?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export default function AdminPagination({
  currentPage,
  totalItems,
  pageSize,
  pageSizeOptions = [6, 9, 12, 24],
  itemName = 'items',
  onPageChange,
  onPageSizeChange,
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(totalItems, safePage * pageSize);

  // Generate page numbers
  const pageNumbers: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (safePage > 3) pageNumbers.push('...');
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (safePage < totalPages - 2) pageNumbers.push('...');
    pageNumbers.push(totalPages);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EAD8C8] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#705E55] shadow-xs">
      {/* Left: Showing X – Y of Z */}
      <div className="font-sans font-medium text-[#705E55]">
        Showing <span className="font-bold text-[#1F1916]">{startIndex}</span>
        {' – '}
        <span className="font-bold text-[#1F1916]">{endIndex}</span> of{' '}
        <span className="font-bold text-[#1F1916]">{totalItems}</span> {itemName}
      </div>

      {/* Right: Rows per page & Navigation Controls */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Rows per page selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-[#705E55] font-medium">Rows per page:</span>
            <select
              value={pageSize}
              aria-label="Rows per page"
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="px-2.5 py-1 bg-[#FAF5EE]/70 border border-[#EAD8C8] rounded-xl text-xs font-semibold text-[#1F1916] hover:border-[#8C6D3B] focus:outline-none focus:border-[#8C6D3B] transition-colors cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Buttons: << < 1 2 > >> */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={safePage <= 1}
            className="p-1.5 rounded-xl border border-[#EAD8C8] bg-white hover:bg-[#FAF5EE] text-[#705E55] hover:text-[#1F1916] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="First Page"
            aria-label="First page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1}
            className="p-1.5 rounded-xl border border-[#EAD8C8] bg-white hover:bg-[#FAF5EE] text-[#705E55] hover:text-[#1F1916] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {pageNumbers.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => typeof p === 'number' && onPageChange(p)}
              disabled={typeof p !== 'number'}
              className={`min-w-[32px] h-8 px-2 text-xs font-semibold rounded-xl transition-all ${
                p === safePage
                  ? 'bg-[#641A2A] text-white shadow-xs'
                  : typeof p === 'number'
                  ? 'border border-[#EAD8C8] bg-white text-[#705E55] hover:bg-[#FAF5EE] hover:text-[#1F1916]'
                  : 'text-[#705E55] cursor-default'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            className="p-1.5 rounded-xl border border-[#EAD8C8] bg-white hover:bg-[#FAF5EE] text-[#705E55] hover:text-[#1F1916] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={safePage >= totalPages}
            className="p-1.5 rounded-xl border border-[#EAD8C8] bg-white hover:bg-[#FAF5EE] text-[#705E55] hover:text-[#1F1916] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="Last Page"
            aria-label="Last page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
