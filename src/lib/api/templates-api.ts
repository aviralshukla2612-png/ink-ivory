import { apiRequest } from "./client";

export interface TemplateListItem {
  id: string;
  slug: string;
  title: string;
  occasion: string;
  description: string;
  previewImage?: string;
  liveDemoUrl: string;
  badge?: string;
  tier: string;
  isActive: boolean;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  rendererId?: string;
  tags?: string[];
  priceINR: number;
  originalPriceINR?: number;
  draftsCount: number;
  publicationsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListTemplatesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  tier?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

// -------------------------------------------------------------
// Template API Operations
// -------------------------------------------------------------

export async function getTemplates(params: ListTemplatesParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page.toString());
  if (params.limit) query.set("limit", params.limit.toString());
  if (params.search) query.set("search", params.search);
  if (params.category && params.category !== "All") query.set("category", params.category);
  if (params.status && params.status !== "All") query.set("status", params.status);
  if (params.tier && params.tier !== "All") query.set("tier", params.tier);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  const res = await apiRequest<TemplateListItem[]>(`/api/admin/templates?${query.toString()}`);
  return {
    items: res.data,
    meta: res.meta || { page: 1, limit: 20, total: res.data.length, totalPages: 1 },
  };
}

export async function getTemplate(id: string) {
  const res = await apiRequest<TemplateListItem>(`/api/admin/templates/${encodeURIComponent(id)}`);
  return res.data;
}

export async function createTemplate(payload: {
  title: string;
  slug: string;
  occasion: string;
  description: string;
  previewImage?: string;
  badge?: string;
  tier?: string;
  priceINR?: number;
  rendererId: string;
  tags?: string[];
}) {
  const res = await apiRequest<TemplateListItem>("/api/admin/templates", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateTemplate(id: string, payload: Partial<TemplateListItem> & { priceINR?: number }) {
  const res = await apiRequest<TemplateListItem>(`/api/admin/templates/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function archiveTemplate(id: string) {
  const res = await apiRequest(`/api/admin/templates/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return res.data;
}

export async function duplicateTemplate(id: string, newTitle?: string, newSlug?: string) {
  const res = await apiRequest<TemplateListItem>(`/api/admin/templates/${encodeURIComponent(id)}/duplicate`, {
    method: "POST",
    body: JSON.stringify({ newTitle, newSlug }),
  });
  return res.data;
}

export async function toggleTemplateActive(id: string, isActive: boolean) {
  const res = await apiRequest(`/api/admin/templates/${encodeURIComponent(id)}/activate`, {
    method: "POST",
    body: JSON.stringify({ isActive }),
  });
  return res.data;
}

// -------------------------------------------------------------
// Category API Operations
// -------------------------------------------------------------

export async function getCategories() {
  const res = await apiRequest<CategoryItem[]>("/api/admin/categories");
  return res.data;
}

export async function createCategory(payload: { name: string; slug: string; icon?: string; description?: string }) {
  const res = await apiRequest<CategoryItem>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateCategory(id: string, payload: Partial<CategoryItem>) {
  const res = await apiRequest<CategoryItem>(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteCategory(id: string) {
  const res = await apiRequest(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return res.data;
}
