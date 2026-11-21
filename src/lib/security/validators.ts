import { z } from "zod";

/**
 * You Are Mine — Centralized Zod Validation Schemas
 * Enforces OWASP A03 / A04 Input Validation & Sanitization across all endpoints.
 */

// Safe alphanumeric slug pattern
export const SlugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(60, "Slug cannot exceed 60 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase alphanumeric characters and single hyphens");

// Draft Creation Schema
export const CreateDraftSchema = z.object({
  id: z.string().max(100).optional(),
  templateId: z.string().min(1, "templateId is required").max(100),
  title: z.string().max(200).optional().default("My Invitation Draft"),
  userId: z.string().max(100).optional(),
  fields: z.record(z.string(), z.any()).optional().default({}),
  design: z.record(z.string(), z.any()).optional().default({}),
  customAudioUrl: z.string().max(500).optional().nullable(),
  customAudioTitle: z.string().max(200).optional().nullable(),
  status: z.enum(["DRAFT", "READY_TO_PUBLISH", "PAYMENT_PENDING", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
});

// Draft Update Schema
export const UpdateDraftSchema = z.object({
  title: z.string().max(200).optional(),
  fields: z.record(z.string(), z.any()).optional(),
  design: z.record(z.string(), z.any()).optional(),
  customAudioUrl: z.string().max(500).optional().nullable(),
  customAudioTitle: z.string().max(200).optional().nullable(),
  status: z.enum(["DRAFT", "READY_TO_PUBLISH", "PAYMENT_PENDING", "PUBLISHED", "ARCHIVED"]).optional(),
});

// Create Payment Order Schema
export const CreatePaymentOrderSchema = z.object({
  draftId: z.string().min(1, "draftId is required").max(100),
  couponCode: z.string().max(50).optional(),
});

// Verify Payment Schema
export const VerifyPaymentSchema = z.object({
  orderId: z.string().min(5, "orderId is required").max(100),
  paymentId: z.string().min(5, "paymentId is required").max(100),
  signature: z.string().min(10, "signature is required").max(200),
  draftId: z.string().min(1, "draftId is required").max(100),
  requestedSlug: SlugSchema.optional(),
});

// Admin Price Update Schema
export const AdminUpdatePriceSchema = z.object({
  action: z.literal("update-price"),
  templateId: z.string().min(1).max(100),
  amountPaise: z.number().int().positive("Price must be a positive integer in paise"),
  promotionalPricePaise: z.number().int().positive().optional(),
});

// Price Quote Schema
export const PriceQuoteSchema = z.object({
  templateId: z.string().min(1).max(100),
  couponCode: z.string().max(50).optional(),
});

// -------------------------------------------------------------
// Milestone 3: Template & Category Schemas
// -------------------------------------------------------------

export const CreateTemplateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  slug: SlugSchema,
  occasion: z.string().min(2, "Occasion/Category is required").max(50),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  previewImage: z.string().max(500).optional(),
  liveDemoUrl: z.string().max(500).optional(),
  badge: z.string().max(50).optional(),
  tier: z.enum(["PREMIUM", "SIGNATURE", "DELUXE", "ROYAL"]).default("SIGNATURE"),
  priceINR: z.number().min(0, "Price cannot be negative").max(100000).default(299),
  promotionalPriceINR: z.number().min(0).max(100000).optional(),
  rendererId: z.string().min(2, "Renderer ID is required").max(100),
  tags: z.array(z.string().max(50)).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  defaultFields: z.record(z.string(), z.any()).optional(),
  designConfig: z.record(z.string(), z.any()).optional(),
});

export const UpdateTemplateSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  occasion: z.string().min(2).max(50).optional(),
  description: z.string().min(10).max(1000).optional(),
  previewImage: z.string().max(500).optional(),
  liveDemoUrl: z.string().max(500).optional(),
  badge: z.string().max(50).optional(),
  tier: z.enum(["PREMIUM", "SIGNATURE", "DELUXE", "ROYAL"]).optional(),
  priceINR: z.number().min(0).max(100000).optional(),
  promotionalPriceINR: z.number().min(0).max(100000).optional(),
  rendererId: z.string().min(2).max(100).optional(),
  tags: z.array(z.string().max(50)).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  isActive: z.boolean().optional(),
  defaultFields: z.record(z.string(), z.any()).optional(),
  designConfig: z.record(z.string(), z.any()).optional(),
});

export const DuplicateTemplateSchema = z.object({
  newTitle: z.string().min(3).max(150).optional(),
  newSlug: SlugSchema.optional(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50),
  slug: SlugSchema,
  icon: z.string().max(50).optional().default("Tag"),
  description: z.string().max(250).optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).max(50).optional(),
  icon: z.string().max(50).optional(),
  description: z.string().max(250).optional(),
  displayOrder: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const CreateCouponSchema = z.object({
  code: z.string().min(3).max(30).regex(/^[A-Z0-9_-]+$/, "Coupon code must be uppercase alphanumeric"),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive(),
  minOrderValuePaise: z.number().int().nonnegative().default(29900),
  maxDiscountPaise: z.number().int().positive().optional(),
  usageLimit: z.number().int().positive().default(500),
  expiresAt: z.string().datetime().optional(),
});

export const UpdateCouponSchema = z.object({
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().positive().optional(),
  minOrderValuePaise: z.number().int().nonnegative().optional(),
  maxDiscountPaise: z.number().int().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});

// -------------------------------------------------------------
// Milestone 4: Template Builder & Section Schemas
// -------------------------------------------------------------

export const TemplateSectionSchema = z.object({
  id: z.string().optional(),
  templateId: z.string().optional(),
  sectionType: z.string().min(1).max(50),
  title: z.string().min(1).max(100),
  order: z.number().int().min(1),
  isEnabled: z.boolean().default(true),
  settings: z.record(z.string(), z.any()).optional().default({}),
  fieldsSchema: z.record(z.string(), z.any()).optional().default({}),
});

export const SaveTemplateBuilderSchema = z.object({
  sections: z.array(TemplateSectionSchema).optional(),
  defaultFields: z.record(z.string(), z.any()).optional(),
  designConfig: z.record(z.string(), z.any()).optional(),
  changeSummary: z.string().max(250).optional().default("Updated builder configuration"),
});

export const ReorderSectionsSchema = z.object({
  sectionOrders: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int().min(1),
    })
  ).min(1),
});

export const RestoreVersionSchema = z.object({
  versionNumber: z.number().int().min(1),
});

// -------------------------------------------------------------
// Milestone 7: Financial Management & Refund Schemas
// -------------------------------------------------------------

export const RefundPaymentSchema = z.object({
  reason: z.string().min(5, "Refund reason must be at least 5 characters").max(500),
});

// -------------------------------------------------------------
// Milestone 8: Operations, Staff, Settings & Support Schemas
// -------------------------------------------------------------

export const CreateStaffSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "FINANCE", "CONTENT_MANAGER", "SUPPORT"]),
});

export const UpdateStaffSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "FINANCE", "CONTENT_MANAGER", "SUPPORT"]).optional(),
  isActive: z.boolean().optional(),
});

export const UpdateSettingsSchema = z.object({
  platformName: z.string().min(2).max(100).optional(),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().max(50).optional(),
  defaultCurrency: z.string().max(10).optional(),
  maintenanceMode: z.boolean().optional(),
  allowNewRegistrations: z.boolean().optional(),
  maxAudioUploadBytes: z.number().int().positive().optional(),
  maxImageUploadBytes: z.number().int().positive().optional(),
});

export const CreateSupportTicketSchema = z.object({
  customerEmail: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(5).max(2000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const AddSupportReplySchema = z.object({
  message: z.string().min(2).max(2000),
});

export const UpdateSupportTicketSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  internalNotes: z.string().max(2000).optional(),
  assignedStaffId: z.string().optional(),
});


