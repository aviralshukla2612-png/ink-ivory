import { store } from "@/lib/store";
import { templatesData } from "@/data/templates";
import { Template } from "@/types";

/**
 * Returns all public templates with real-time admin prices and metadata overrides from the store.
 */
export async function getPublicTemplates(): Promise<Template[]> {
  try {
    const storeTemplates = await store.getAllTemplates();
    if (!storeTemplates || storeTemplates.length === 0) {
      return templatesData;
    }

    const result: Template[] = [];

    // 1. Map base templates with live admin store overrides
    for (const base of templatesData) {
      const storeTpl = storeTemplates.find(
        (st) =>
          st.id === base.id ||
          st.slug === base.slug ||
          (st.liveDemoUrl && base.liveDemoUrl && st.liveDemoUrl === base.liveDemoUrl)
      );

      if (storeTpl) {
        // If admin deactivated or archived the template, hide from public catalog
        if (storeTpl.isActive === false || storeTpl.status === "ARCHIVED") {
          continue;
        }

        const priceRec = await store.getTemplatePrice(storeTpl.id);
        const priceINR =
          priceRec && priceRec.amount !== undefined
            ? Math.round(priceRec.amount / 100)
            : storeTpl.priceINR !== undefined
            ? storeTpl.priceINR
            : base.price;

        result.push({
          ...base,
          title: storeTpl.title || base.title,
          slug: storeTpl.slug || base.slug,
          occasion: (storeTpl.occasion as any) || base.occasion,
          description: storeTpl.description || base.description,
          tier: storeTpl.tier || base.tier,
          badge: storeTpl.badge || base.badge,
          previewImage: storeTpl.previewImage || base.previewImage,
          price: priceINR,
          isFree: priceINR === 0,
        });
      } else {
        result.push(base);
      }
    }

    // 2. Add any newly created templates from store that are not in static templatesData
    for (const st of storeTemplates) {
      const alreadyIncluded = result.some((r) => r.id === st.id || r.slug === st.slug);
      if (!alreadyIncluded && st.isActive !== false && st.status === "ACTIVE") {
        const priceRec = await store.getTemplatePrice(st.id);
        const priceINR =
          priceRec && priceRec.amount !== undefined
            ? Math.round(priceRec.amount / 100)
            : st.priceINR !== undefined
            ? st.priceINR
            : 349;

        result.push({
          id: st.id,
          slug: st.slug,
          title: st.title,
          occasion: (st.occasion as any) || "Wedding",
          description: st.description || "",
          price: priceINR,
          isFree: priceINR === 0,
          isFeatured: false,
          rating: 5.0,
          reviewsCount: 1,
          previewImage: st.previewImage || "/images/templates/royal-navy-wedding-card.jpg",
          liveDemoUrl: st.liveDemoUrl || "/template-01",
          tags: [st.occasion || "Wedding", st.tier || "SIGNATURE"],
          badge: st.badge || "NEW",
          tier: st.tier || "SIGNATURE",
          photoOption: "Couple photo or two separate",
          useItFor: `Use it for: ${st.occasion || "Wedding"}`,
          defaultFields: (st.defaultFields as any) || {},
          designConfig: (st.designConfig as any) || {
            themeColor: "#0E1524",
            textColor: "#FAF7F0",
            accentColor: "#D4AF37",
            fontFamily: "serif",
            orientation: "portrait",
            borderStyle: "ornate",
          },
        });
      }
    }

    return result;
  } catch (err) {
    console.error("Error in getPublicTemplates:", err);
    return templatesData;
  }
}

/**
 * Returns a single template with live admin price and metadata by ID, slug, or demo alias.
 */
export async function getPublicTemplateById(idOrSlug: string): Promise<Template | null> {
  const templates = await getPublicTemplates();
  return (
    templates.find(
      (t) =>
        t.id === idOrSlug ||
        t.slug === idOrSlug ||
        t.liveDemoUrl?.includes(idOrSlug) ||
        (idOrSlug === "template-01" && (t.id === "tpl-wedding-navy-01" || t.slug === "the-royal-navy-wedding")) ||
        (idOrSlug === "template-02" && (t.id === "tpl-anniversary-gold-02" || t.slug === "golden-botanical-anniversary")) ||
        (idOrSlug === "template-03" && (t.id === "tpl-engagement-garden-03" || t.slug === "thirumanam-south-indian-temple-wedding")) ||
        (idOrSlug === "template-04" && (t.id === "tpl-wedding-paper-palace-04" || t.slug === "paper-palace-wedding")) ||
        (idOrSlug === "birthday" && (t.id === "tpl-birthday-botanical-04" || t.slug === "interactive-birthday-celebration")) ||
        (idOrSlug === "valentine" && (t.id === "tpl-valentine-interactive-05" || t.slug === "will-you-be-my-valentine")) ||
        (idOrSlug === "date-planner" && (t.id === "tpl-date-planner-07" || t.slug === "our-date-planner"))
    ) || null
  );
}
