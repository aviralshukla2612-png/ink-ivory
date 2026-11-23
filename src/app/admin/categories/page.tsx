'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  FolderTree,
  X,
  Layers,
  Sparkles,
  Heart,
  Calendar,
  Gift,
  PartyPopper,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryItem,
} from '@/lib/api/templates-api';
import AdminPagination from '@/components/admin/AdminPagination';

const AVAILABLE_ICONS = [
  { name: 'Tag', icon: Tag },
  { name: 'Heart', icon: Heart },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Calendar', icon: Calendar },
  { name: 'Gift', icon: Gift },
  { name: 'PartyPopper', icon: PartyPopper },
];

export default function AdminCategoriesPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('CATEGORIES_MANAGE');

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalItem, setEditModalItem] = useState<CategoryItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<CategoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formIcon, setFormIcon] = useState('Tag');
  const [formDescription, setFormDescription] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load categories.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Auto-slug generator
  const handleNameChange = (name: string, isCreate: boolean) => {
    setFormName(name);
    if (isCreate) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormSlug(slug);
    }
  };

  // Submit Create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      await createCategory({
        name: formName.trim(),
        slug: formSlug.trim(),
        icon: formIcon,
        description: formDescription.trim() || undefined,
      });

      setFeedback({ type: 'success', text: `Category "${formName}" created successfully.` });
      setCreateModalOpen(false);
      resetForm();
      await loadCategories();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to create category.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Edit
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalItem || !canManage) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      await updateCategory(editModalItem.id, {
        name: formName.trim(),
        icon: formIcon,
        description: formDescription.trim() || undefined,
        displayOrder: formDisplayOrder,
        isActive: formIsActive,
      });

      setFeedback({ type: 'success', text: `Category "${formName}" updated successfully.` });
      setEditModalItem(null);
      resetForm();
      await loadCategories();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update category.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Delete
  const handleDelete = async () => {
    if (!deleteConfirmItem || !canManage) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      await deleteCategory(deleteConfirmItem.id);
      setFeedback({ type: 'success', text: `Category "${deleteConfirmItem.name}" deleted successfully.` });
      setDeleteConfirmItem(null);
      await loadCategories();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete category.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Toggle Active
  const handleToggleActive = async (cat: CategoryItem) => {
    if (!canManage) return;
    try {
      await updateCategory(cat.id, { isActive: !cat.isActive });
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !cat.isActive } : c))
      );
      setFeedback({
        type: 'success',
        text: `Category "${cat.name}" is now ${!cat.isActive ? 'Active' : 'Inactive'}.`,
      });
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Status update failed.' });
    }
  };

  // Reorder Item
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (!canManage) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const currentCat = categories[index];
    const targetCat = categories[targetIndex];

    try {
      const currentOrder = currentCat.displayOrder;
      const targetOrder = targetCat.displayOrder;

      await updateCategory(currentCat.id, { displayOrder: targetOrder });
      await updateCategory(targetCat.id, { displayOrder: currentOrder });

      await loadCategories();
    } catch (err: any) {
      setFeedback({ type: 'error', text: 'Failed to update display order.' });
    }
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditModalItem(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormIcon(cat.icon || 'Tag');
    setFormDescription(cat.description || '');
    setFormDisplayOrder(cat.displayOrder);
    setFormIsActive(cat.isActive);
  };

  const resetForm = () => {
    setFormName('');
    setFormSlug('');
    setFormIcon('Tag');
    setFormDescription('');
    setFormDisplayOrder(categories.length + 1);
    setFormIsActive(true);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8]">
              Milestone 3 Deliverable
            </span>
            <span className="text-xs text-[#8C6D3B]/70">•</span>
            <span className="text-xs text-[#8C6D3B]/70 font-mono">Taxonomy &amp; Navigation</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Occasions &amp; Categories
          </h1>
          <p className="text-xs text-[#705E55] mt-0.5">
            Manage public marketplace taxonomy, occasion tags, and template groupings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/templates"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#705E55] bg-white border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Templates</span>
          </Link>

          <button
            onClick={() => loadCategories()}
            disabled={loading}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {canManage && (
            <button
              onClick={() => {
                resetForm();
                setCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#641A2A] hover:bg-[#4E1320] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
              : 'bg-rose-50/80 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-0.5 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#EAD8C8] shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search categories by name, slug or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white transition-all"
          />
        </div>
        <div className="text-xs font-mono text-[#8C6D3B] px-3 py-1.5 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8]">
          Total: <span className="font-bold text-[#1F1916]">{filteredCategories.length}</span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading categories from database...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-center text-[#705E55]">
            <FolderTree className="w-10 h-10 text-[#8C6D3B]/40 mb-1" />
            <span className="font-serif font-bold text-base text-[#1F1916]">No Categories Found</span>
            <span className="text-xs max-w-sm text-[#705E55]/80">
              {search ? 'Try clearing your search query.' : 'Create your first category to start organizing templates.'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {paginatedCategories.map((cat) => {
                  const globalIdx = categories.findIndex((c) => c.id === cat.id);
                  return (
                    <tr key={cat.id} className="hover:bg-[#FAF5EE]/40 transition-colors">
                      {/* Order Controls */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono text-[11px] font-semibold text-[#8C6D3B]">
                          <span>{cat.displayOrder}</span>
                          {canManage && (
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleMoveOrder(globalIdx, 'up')}
                                disabled={globalIdx <= 0}
                                className="p-0.5 hover:text-[#1F1916] disabled:opacity-30 transition-opacity"
                                title="Move Up"
                              >
                                <ArrowUp className="w-2.5 h-2.5" />
                              </button>
                              <button
                                onClick={() => handleMoveOrder(globalIdx, 'down')}
                                disabled={globalIdx < 0 || globalIdx >= categories.length - 1}
                                className="p-0.5 hover:text-[#1F1916] disabled:opacity-30 transition-opacity"
                                title="Move Down"
                              >
                                <ArrowDown className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                    {/* Name & Icon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B]">
                          <Tag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm text-[#1F1916] block">
                            {cat.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-xs text-[#8C6D3B]">
                      {cat.slug}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-[#705E55] max-w-xs truncate">
                      {cat.description || <span className="italic text-[#705E55]/50">No description</span>}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {canManage ? (
                        <button
                          onClick={() => handleToggleActive(cat)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold transition-colors ${
                            cat.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            cat.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {canManage ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmItem(cat)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#705E55]/60 font-mono">View Only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>

            {filteredCategories.length > 0 && (
              <AdminPagination
                currentPage={currentPage}
                totalItems={filteredCategories.length}
                pageSize={pageSize}
                pageSizeOptions={[5, 7, 10, 20]}
                itemName="categories"
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#FAF5EE] border-b border-[#EAD8C8] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1F1916]">Create Category</h3>
                <p className="text-[11px] text-[#705E55]">Define a new template grouping for the marketplace</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white text-[#705E55] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wedding, Birthday Celebration"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value, true)}
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                  Slug (URL identifier) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. wedding, birthday"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value.toLowerCase().trim())}
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-mono text-[#8C6D3B] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                  Icon Identifier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => setFormIcon(item.name)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition-colors ${
                          formIcon === item.name
                            ? 'bg-[#641A2A] text-white border-[#641A2A]'
                            : 'bg-[#FAF5EE]/60 border-[#EAD8C8] text-[#705E55] hover:bg-white'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for guests and customers..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAD8C8]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#705E55] hover:bg-[#FAF5EE] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#641A2A] hover:bg-[#4E1320] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#FAF5EE] border-b border-[#EAD8C8] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1F1916]">Edit Category</h3>
                <p className="text-[11px] text-[#705E55] font-mono">{editModalItem.slug}</p>
              </div>
              <button
                onClick={() => setEditModalItem(null)}
                className="p-1.5 rounded-xl hover:bg-white text-[#705E55] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value, false)}
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={formDisplayOrder}
                  onChange={(e) => setFormDisplayOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-mono text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded border-[#EAD8C8] text-[#641A2A] focus:ring-[#8C6D3B]"
                />
                <label htmlFor="catActive" className="text-xs font-medium text-[#1F1916]">
                  Active in Marketplace &amp; Filter Bars
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAD8C8]">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="px-4 py-2 text-xs font-medium text-[#705E55] hover:bg-[#FAF5EE] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#641A2A] hover:bg-[#4E1320] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1F1916] mb-1">Delete Category?</h3>
            <p className="text-xs text-[#705E55] mb-5 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-[#1F1916]">"{deleteConfirmItem.name}"</span>? Templates assigned to this category will remain intact.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs font-medium text-[#705E55] hover:bg-[#FAF5EE] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
