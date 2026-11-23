'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Archive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Tag,
  DollarSign,
  Film,
  X,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  archiveTemplate,
  duplicateTemplate,
  toggleTemplateActive,
  getCategories,
  TemplateListItem,
  CategoryItem,
} from '@/lib/api/templates-api';
import { APPROVED_RENDERER_REGISTRY, getApprovedRenderersList } from '@/lib/templates/renderer-registry';
import AdminPagination from '@/components/admin/AdminPagination';

export default function AdminTemplatesPage() {
  const { hasPermission } = useAdmin();

  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [meta, setMeta] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalItem, setEditModalItem] = useState<TemplateListItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Create Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formOccasion, setFormOccasion] = useState('Wedding');
  const [formDescription, setFormDescription] = useState('');
  const [formTier, setFormTier] = useState<'PREMIUM' | 'SIGNATURE' | 'DELUXE' | 'ROYAL'>('SIGNATURE');
  const [formPriceINR, setFormPriceINR] = useState(349);
  const [formRendererId, setFormRendererId] = useState('wedding-imperial-navy');
  const [formPreviewImage, setFormPreviewImage] = useState('/images/templates/royal-navy-wedding-card.jpg');
  const [formBadge, setFormBadge] = useState('NEW');

  // Load Templates from API
  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTemplates({
        page: meta.page,
        limit: meta.limit,
        search,
        category: selectedCategory,
        status: selectedStatus,
        tier: selectedTier,
        sortBy,
        sortOrder,
      });
      setTemplates(res.items);
      setMeta(res.meta);
    } catch (err: any) {
      console.error('Failed to load templates:', err);
      setFeedbackMessage({ type: 'error', text: err.message || 'Unable to load templates' });
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, search, selectedCategory, selectedStatus, selectedTier, sortBy, sortOrder]);

  // Load Categories on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((e) => console.error('Failed to load categories', e));
  }, []);

  // Slug generator helper
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!formSlug || formSlug === formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Submit Template Creation
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMessage(null);

    try {
      const created = await createTemplate({
        title: formTitle,
        slug: formSlug,
        occasion: formOccasion,
        description: formDescription,
        tier: formTier,
        priceINR: Number(formPriceINR),
        rendererId: formRendererId,
        previewImage: formPreviewImage,
        badge: formBadge,
      });

      setFeedbackMessage({ type: 'success', text: `Template "${created.title}" successfully created as draft!` });
      setCreateModalOpen(false);
      resetForm();
      loadTemplates();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Creation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Template Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalItem) return;
    setSubmitting(true);
    setFeedbackMessage(null);

    try {
      await updateTemplate(editModalItem.id, {
        title: formTitle,
        occasion: formOccasion,
        description: formDescription,
        tier: formTier,
        priceINR: Number(formPriceINR),
        badge: formBadge,
        previewImage: formPreviewImage,
        rendererId: formRendererId,
      });

      setFeedbackMessage({ type: 'success', text: `Template "${formTitle}" updated successfully!` });
      setEditModalItem(null);
      resetForm();
      loadTemplates();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Duplication
  const handleDuplicate = async (tpl: TemplateListItem) => {
    if (!confirm(`Duplicate template "${tpl.title}" into a new draft collection?`)) return;
    try {
      const cloned = await duplicateTemplate(tpl.id);
      setFeedbackMessage({ type: 'success', text: `Template cloned as "${cloned.title}"!` });
      loadTemplates();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Duplication failed' });
    }
  };

  // Handle Status Toggle (Activate / Deactivate)
  const handleToggleActive = async (tpl: TemplateListItem) => {
    const nextState = !tpl.isActive;
    try {
      await toggleTemplateActive(tpl.id, nextState);
      setFeedbackMessage({
        type: 'success',
        text: `Template "${tpl.title}" is now ${nextState ? 'ACTIVE in marketplace' : 'DEACTIVATED (Draft)'}.`,
      });
      loadTemplates();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Status toggle failed' });
    }
  };

  // Handle Archive
  const handleArchive = async (tpl: TemplateListItem) => {
    if (!confirm(`Archive template "${tpl.title}"? It will be hidden from the catalog but existing customer invitations remain safe.`)) return;
    try {
      await archiveTemplate(tpl.id);
      setFeedbackMessage({ type: 'success', text: `Template "${tpl.title}" archived.` });
      loadTemplates();
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Archive failed' });
    }
  };

  const openEditModal = (tpl: TemplateListItem) => {
    setEditModalItem(tpl);
    setFormTitle(tpl.title);
    setFormSlug(tpl.slug);
    setFormOccasion(tpl.occasion);
    setFormDescription(tpl.description);
    setFormTier((tpl.tier as any) || 'SIGNATURE');
    setFormPriceINR(tpl.priceINR);
    setFormRendererId(tpl.rendererId || 'wedding-imperial-navy');
    setFormPreviewImage(tpl.previewImage || '');
    setFormBadge(tpl.badge || '');
  };

  const resetForm = () => {
    setFormTitle('');
    setFormSlug('');
    setFormOccasion('Wedding');
    setFormDescription('');
    setFormTier('SIGNATURE');
    setFormPriceINR(349);
    setFormRendererId('wedding-imperial-navy');
    setFormPreviewImage('/images/templates/royal-navy-wedding-card.jpg');
    setFormBadge('NEW');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ------------------------------------------------------------- */}
      {/* HEADER                                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-serif italic text-2xl sm:text-3xl font-bold text-[#2C2114]">
              Template Collections
            </span>
            <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#EDE2CF] text-[#8F6E3B] uppercase tracking-wider">
              {meta.total} Total
            </span>
          </div>
          <p className="text-xs text-[#7A634E] max-w-2xl leading-relaxed">
            Manage your digital invitation marketplace catalogue. Every collection is backed by an approved, high-performance renderer with live customer previews.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/categories"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DFCEAF] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#49341F] transition-all cursor-pointer shadow-2xs"
          >
            <Tag className="w-3.5 h-3.5 text-[#8F6E3B]" />
            <span>Manage Categories</span>
          </Link>

          {hasPermission('TEMPLATES_MANAGE') && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setCreateModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C49E33] text-[#1C1814] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#1C1814]" />
              <span>Create Template</span>
            </button>
          )}
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="p-1 hover:opacity-70 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FILTER TOOLBAR                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#FCFAF6] rounded-2xl p-4 sm:p-5 border border-[#DFCEAF] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E8975]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by title, slug, or occasion..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#DFCEAF] text-[#2C2114] placeholder-[#9E8975] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#DFCEAF] text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#DFCEAF] text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
        >
          <option value="All">All Statuses</option>
          <option value="ACTIVE">Active in Store</option>
          <option value="DRAFT">Draft Only</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        {/* Tier Dropdown */}
        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#DFCEAF] text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
        >
          <option value="All">All Tiers</option>
          <option value="PREMIUM">PREMIUM</option>
          <option value="SIGNATURE">SIGNATURE</option>
          <option value="DELUXE">DELUXE</option>
          <option value="ROYAL">ROYAL</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [sb, so] = e.target.value.split('-');
            setSortBy(sb);
            setSortOrder(so as any);
          }}
          className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#DFCEAF] text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Title: A–Z</option>
        </select>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DATA TABLE                                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8DFC8] text-[10.5px] uppercase tracking-wider font-semibold text-[#7A634E]">
                <th className="py-3 px-4 text-center w-14">Sr. No.</th>
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Category &amp; Tier</th>
                <th className="py-3 px-4 text-center">Price</th>
                <th className="py-3 px-4 text-center">Orders &amp; Drafts</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE7D7] text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#8F6E3B] mx-auto mb-2" />
                    <span className="text-xs text-[#7A634E]">Loading collection catalog from backend...</span>
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#7A634E]">
                    No templates found matching your filters.
                  </td>
                </tr>
              ) : (
                templates.map((tpl, idx) => (
                  <tr key={tpl.id} className="hover:bg-[#FAF7F0] transition-colors">
                    {/* Sr. No. */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono text-xs font-bold text-[#8F6E3B] px-2 py-1 rounded-lg bg-[#EDE2CF]/40">
                        {(meta.page - 1) * meta.limit + idx + 1}
                      </span>
                    </td>

                    {/* Collection Thumbnail & Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[#1A1612] shrink-0 border border-[#DFCEAF]">
                          <Image
                            src={tpl.previewImage || '/images/templates/royal-navy-wedding-card.jpg'}
                            alt={tpl.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-serif font-bold text-sm text-[#2C2114] block truncate max-w-[220px]">
                            {tpl.title}
                          </span>
                          <span className="font-mono text-[10px] text-[#8F6E3B] block">
                            /{tpl.slug}
                          </span>
                          {tpl.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#EDE2CF] text-[#695034] uppercase tracking-wider inline-block mt-0.5">
                              {tpl.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category & Tier */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EDE2CF]/60 text-[#695034] text-[10.5px] font-medium block w-fit">
                          {tpl.occasion}
                        </span>
                        <span className="text-[10px] font-bold text-[#8F6E3B] uppercase tracking-wider block">
                          {tpl.tier || 'SIGNATURE'}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="text-xs line-through text-[#7A634E]/60">₹{tpl.originalPriceINR || 999}</span>
                          <span className="font-bold text-sm text-[#8F6E3B]">₹{tpl.priceINR}</span>
                        </div>
                        <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                          70% OFF
                        </span>
                      </div>
                    </td>

                    {/* Orders & Drafts */}
                    <td className="py-4 px-4 text-center">
                      <div className="text-[11px] text-[#55402F]">
                        <span className="font-bold text-emerald-800">{tpl.publicationsCount}</span> paid &bull;{' '}
                        <span className="font-bold">{tpl.draftsCount}</span> drafts
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(tpl)}
                        className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                          tpl.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : tpl.status === 'ARCHIVED'
                            ? 'bg-neutral-200 text-neutral-600'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle marketplace activation"
                      >
                        {tpl.status === 'ACTIVE' ? 'Active' : tpl.status === 'ARCHIVED' ? 'Archived' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Open Builder */}
                        <Link
                          href={`/admin/builder?templateId=${tpl.id}`}
                          title="Open Dynamic Section Builder"
                          className="p-1.5 rounded-lg bg-[#EDE2CF] hover:bg-[#DFCEAF] text-[#49341F] transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#8F6E3B]" />
                        </Link>

                        {/* Edit Metadata */}
                        <button
                          type="button"
                          onClick={() => openEditModal(tpl)}
                          title="Edit Template Metadata"
                          className="p-1.5 rounded-lg bg-[#EDE2CF] hover:bg-[#DFCEAF] text-[#49341F] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(tpl)}
                          title="Duplicate Template"
                          className="p-1.5 rounded-lg bg-[#EDE2CF] hover:bg-[#DFCEAF] text-[#49341F] transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Preview */}
                        <Link
                          href={tpl.liveDemoUrl || `/customize/${tpl.id}`}
                          target="_blank"
                          title="View Live Customizer Preview"
                          className="p-1.5 rounded-lg bg-[#EDE2CF] hover:bg-[#DFCEAF] text-[#49341F] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Archive */}
                        {tpl.status !== 'ARCHIVED' && (
                          <button
                            type="button"
                            onClick={() => handleArchive(tpl)}
                            title="Archive Template"
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {meta.total > 0 && (
          <AdminPagination
            currentPage={meta.page}
            totalItems={meta.total}
            pageSize={meta.limit}
            pageSizeOptions={[5, 10, 15, 25]}
            itemName="templates"
            onPageChange={(page) => setMeta((prev) => ({ ...prev, page }))}
            onPageSizeChange={(limit) => setMeta((prev) => ({ ...prev, limit, page: 1 }))}
          />
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CREATE / EDIT TEMPLATE MODAL                                  */}
      {/* ------------------------------------------------------------- */}
      {(createModalOpen || editModalItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8] mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C2114]">
                  {editModalItem ? `Edit Template: ${editModalItem.title}` : 'Create New Template Collection'}
                </h3>
                <p className="text-xs text-[#7A634E] mt-0.5">
                  Configure collection metadata and map to an approved visual renderer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCreateModalOpen(false);
                  setEditModalItem(null);
                }}
                className="p-1.5 rounded-lg text-[#7A634E] hover:text-[#2C2114] hover:bg-[#EDE2CF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editModalItem ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2114] mb-1">
                    Collection Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. The Imperial Navy Wedding"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2114] mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editModalItem)}
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                    placeholder="e.g. imperial-navy-wedding"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B] disabled:bg-neutral-100 disabled:text-neutral-500 font-mono"
                  />
                </div>

                {/* Occasion / Category */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2114] mb-1">
                    Occasion / Category *
                  </label>
                  <select
                    value={formOccasion}
                    onChange={(e) => setFormOccasion(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tier */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2114] mb-1">
                    Collection Tier *
                  </label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
                  >
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="SIGNATURE">SIGNATURE</option>
                    <option value="DELUXE">DELUXE</option>
                    <option value="ROYAL">ROYAL</option>
                  </select>
                </div>

                {/* Unit Price INR */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2114] mb-1">
                    Publishing Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    required
                    value={formPriceINR}
                    onChange={(e) => setFormPriceINR(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
                  />
                </div>

                {/* Badge Label */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2114] mb-1">
                    Catalog Badge Pill
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. 🎬 MOVING or BESTSELLER"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
                  />
                </div>
              </div>

              {/* Approved Renderer Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2114] mb-1">
                  Approved Visual Renderer (Security Rule Enforced) *
                </label>
                <select
                  value={formRendererId}
                  onChange={(e) => setFormRendererId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
                >
                  {getApprovedRenderersList().map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.category} • Default ₹{r.defaultPriceINR})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#7A634E] mt-1">
                  Assigns the verified React visual architecture without allowing untrusted code execution.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2114] mb-1">
                  Collection Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the editorial aesthetic, visual motifs, and occasion highlights..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
                />
              </div>

              {/* Preview Image URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2C2114] mb-1">
                  Card Cover Artwork Path / URL
                </label>
                <input
                  type="text"
                  value={formPreviewImage}
                  onChange={(e) => setFormPreviewImage(e.target.value)}
                  placeholder="/images/templates/royal-navy-wedding-card.jpg"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => {
                    setCreateModalOpen(false);
                    setEditModalItem(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#DFCEAF] bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-[#49341F] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C49E33] text-[#1C1814] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editModalItem ? 'Save Changes' : 'Create Template'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
