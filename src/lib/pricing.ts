import { store } from "@/lib/store";
import { templatesData } from "@/data/templates";

export interface PricingQuote {
  templateId: string;
  templateTitle: string;
  currency: string;
  baseAmountPaise: number;
  discountPaise: number;
  finalAmountPaise: number;
  baseAmountRupees: number;
  finalAmountRupees: number;
  couponCode?: string;
  couponApplied: boolean;
  features: string[];
}

// Server-managed discount codes
const PROMO_CODES: Record<string, { type: "percent" | "flat"; value: number; desc: string }> = {
  LOVE2026: { type: "percent", value: 20, desc: "20% Valentine Special Discount" },
  YOUMINE50: { type: "flat", value: 5000, desc: "₹50 Flat Launch Discount" },
  MINE50: { type: "flat", value: 5000, desc: "₹50 Flat Launch Discount" },
  INKIVORY50: { type: "flat", value: 5000, desc: "₹50 Flat Launch Discount" },
  FIRSTINVITE: { type: "percent", value: 15, desc: "15% First Invitation Discount" },
};

export async function calculateQuote(templateId: string, couponCode?: string): Promise<PricingQuote> {
  const directTpl = templatesData.find(
    (t) => t.id === templateId || t.slug === templateId
  );
  const template = directTpl || (await store.getTemplate(templateId));
  const priceRecord = await store.getTemplatePrice(template?.id || templateId);

  // Exact template price in paise (e.g. ₹299 -> 29900 paise)
  const baseAmountPaise = directTpl?.price
    ? directTpl.price * 100
    : priceRecord?.amount || 29900;
  let discountPaise = 0;
  let couponApplied = false;

  const cleanCoupon = couponCode ? couponCode.trim().toUpperCase() : undefined;

  if (cleanCoupon && PROMO_CODES[cleanCoupon]) {
    const promo = PROMO_CODES[cleanCoupon];
    if (promo.type === "percent") {
      discountPaise = Math.round((baseAmountPaise * promo.value) / 100);
    } else {
      discountPaise = Math.min(baseAmountPaise, promo.value);
    }
    couponApplied = true;
  }

  const finalAmountPaise = Math.max(0, baseAmountPaise - discountPaise);

  return {
    templateId: template?.id || templateId,
    templateTitle: template?.title || "Bespoke Invitation Web Page",
    currency: "INR",
    baseAmountPaise,
    discountPaise,
    finalAmountPaise,
    baseAmountRupees: Math.round(baseAmountPaise / 100),
    finalAmountRupees: Math.round(finalAmountPaise / 100),
    couponCode: couponApplied ? cleanCoupon : undefined,
    couponApplied,
    features: [
      "Your Custom Shareable Link (e.g. youaremine.com/invite/riya-aarav)",
      "Instant 1-Click WhatsApp sharing for family & friends",
      "Live & Active for 1 Full Year for your celebrations",
      "Background music & opening animations included",
      "Opens smoothly on every phone & laptop (no guest app needed)",
      "Guest RSVP collection & event schedule details",
      "100% Ad-Free, clean luxury experience for your guests",
    ],
  };
}
