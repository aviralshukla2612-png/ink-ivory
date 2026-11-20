'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sliders,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Loader2,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { getTemplates, TemplateListItem } from '@/lib/api/templates-api';
import { APPROVED_RENDERER_REGISTRY } from '@/lib/templates/renderer-registry';

export default function AdminBuilderSelectorPage() {
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await getTemplates({ limit: 50 });
        setTemplates(res.items);
      } catch (err) {
        console.error('Failed to load templates for builder:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.occasion.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8]">
              Milestone 4 Deliverable
            </span>
            <span className="text-xs text-[#8C6D3B]/70">•</span>
            <span className="text-xs text-[#8C6D3B]/70 font-mono">Dynamic Section Architecture</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Dynamic Template Builder
          </h1>
          <p className="text-xs text-[#705E55] mt-0.5">
            Select an approved template below to configure sections, customize editable field schemas, and preview in real-time.
          </p>
        </div>

        <Link
          href="/admin/templates"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#705E55] bg-white border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Templates Catalog</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#EAD8C8] shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search templates by title, occasion or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>
        <div className="text-xs font-mono text-[#8C6D3B] px-3 py-1.5 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8]">
          Available: <span className="font-bold text-[#1F1916]">{filtered.length}</span>
        </div>
      </div>

      {/* Grid of Templates */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
          <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
          <span className="text-xs font-mono">Loading approved templates...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-[#EAD8C8] p-8">
          <Sliders className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-[#1F1916]">No Templates Found</h3>
          <p className="text-xs text-[#705E55] mt-1">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tpl) => {
            const renderer = tpl.rendererId ? APPROVED_RENDERER_REGISTRY[tpl.rendererId] : null;
            return (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl border border-[#EAD8C8] overflow-hidden shadow-sm hover:shadow-md hover:border-[#8C6D3B]/50 transition-all flex flex-col group"
              >
                {/* Thumbnail Header */}
                <div className="relative h-44 bg-[#FAF5EE] overflow-hidden">
                  <Image
                    src={tpl.previewImage || '/images/templates/royal-navy-wedding-card.jpg'}
                    alt={tpl.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-white/90 text-[#1F1916] backdrop-blur-sm shadow-sm">
                      {tpl.occasion}
                    </span>
                    {tpl.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-[#641A2A] text-white shadow-sm">
                        {tpl.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif font-bold text-base line-clamp-1 drop-shadow-sm">
                      {tpl.title}
                    </h3>
                    <p className="text-[11px] text-white/80 line-clamp-1 font-mono">
                      {tpl.slug}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#705E55]">Approved Renderer:</span>
                      <span className="font-semibold text-[#8C6D3B] truncate max-w-[170px]">
                        {renderer?.name || tpl.rendererId || 'Default'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#705E55]">Supported Sections:</span>
                      <span className="font-semibold text-[#1F1916]">
                        {renderer?.supportedSections?.length || 5} sections
                      </span>
                    </div>

                    <p className="text-xs text-[#705E55] line-clamp-2 leading-relaxed pt-1 border-t border-[#EAD8C8]/60">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#EAD8C8]/60 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#641A2A]">
                      ₹{tpl.priceINR}
                    </span>

                    <Link
                      href={`/admin/templates/${encodeURIComponent(tpl.id)}/builder`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#641A2A] hover:bg-[#4E1320] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Launch Builder</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
