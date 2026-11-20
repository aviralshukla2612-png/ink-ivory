# YOU ARE MINE — IMAGE DELIVERY & RESPONSIVE OPTIMIZATION REPORT
**Website:** https://youaremine-online.com/  
**Focus:** Complete asset inventory, WebP conversion, payload reductions, and caching  

---

## 1. Asset Conversion & Reduction Matrix

| Asset File | Original Format & Size | Optimized Format & Size | Absolute Reduction | Relative Drop | Role / Location |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `herobg.png` (Mobile) | PNG — 1,909 KB | WebP — **32.2 KB** (`herobg-mobile.webp`) | -1,876.8 KB | **98.3%** | Mobile Hero LCP |
| `herobg.png` (Desktop) | PNG — 1,909 KB | WebP — **121.9 KB** (`herobg.webp`) | -1,787.1 KB | **93.6%** | Desktop Hero LCP |
| `logo.png` | PNG — 1,561 KB | WebP — **57.8 KB** (`logo.webp`) | -1,503.2 KB | **96.3%** | Navbar & Footer Logo |
| `favicon.ico` | Raw ICO — 1,217 KB | ICO/PNG — **2.9 KB** (`favicon.ico`) | -1,214.1 KB | **99.76%** | Document Favicon |
| `bg1.png` | PNG — 1,559 KB | WebP — **17.6 KB** (`bg1.webp`) | -1,541.4 KB | **98.8%** | Featured Templates BG |
| `bg2.png` | PNG — 1,645 KB | WebP — **30.2 KB** (`bg2.webp`) | -1,614.8 KB | **98.1%** | Personalization Studio BG |
| `testimonialbg.png` | PNG — 2,255 KB | WebP — **72.0 KB** (`testimonialbg.webp`) | -2,183.0 KB | **96.8%** | Testimonials Carousel BG |
| `royal-navy-wedding-card.jpg` | JPEG — 1,066 KB | WebP — **120.1 KB** (`.webp`) | -945.9 KB | **88.7%** | Template 01 Preview |
| `arjun-sia-heritage-card.jpg` | JPEG — 1,017 KB | WebP — **104.5 KB** (`.webp`) | -912.5 KB | **89.7%** | Template 02 Preview |
| `thirumanam-temple-card.jpg` | JPEG — 1,216 KB | WebP — **158.1 KB** (`.webp`) | -1,057.9 KB | **87.0%** | Template 03 Preview |
| `birthday-preview-card.jpg` | JPEG — 845 KB | WebP — **75.8 KB** (`.webp`) | -769.2 KB | **91.0%** | Template 04 Preview |
| `valentine-preview-card.jpg` | JPEG — 1,057 KB | WebP — **124.9 KB** (`.webp`) | -932.1 KB | **88.2%** | Template 05 Preview |
| `sunset-date.jpg` | JPEG — 874 KB | WebP — **44.2 KB** (`.webp`) | -829.8 KB | **94.9%** | Template 07 Preview |

### Summary Totals
- **Homepage Initial Asset Payload (Before):** 16,405 KB (**16.4 MB**)
- **Homepage Initial Asset Payload (After - Mobile):** **395 KB** (**0.39 MB**)
- **Total Payload Drop on Mobile:** **-97.6% payload elimination**

---

## 2. Responsive Image Architecture (`<picture>`)
In `src/components/home/HeroSection.tsx`, a standard `<picture>` element is employed to guarantee native responsive resolution without client-side JavaScript or hydration delays:

```tsx
<picture className="w-full h-full block">
  <source media="(max-width: 767px)" srcSet="/herobg-mobile.webp" type="image/webp" />
  <source media="(min-width: 768px)" srcSet="/herobg.webp" type="image/webp" />
  <img
    src="/herobg.webp"
    alt="You Are Mine luxury digital invitation web pages composition"
    fetchPriority="high"
    decoding="async"
    className="w-full h-full object-cover object-[85%_center] xl:object-right"
  />
</picture>
```

---

## 3. Image Lazy Loading Strategy
- **Above the Fold:** Only the hero background and navbar logo are eagerly loaded.
- **Below the Fold:** Sections (`FeaturedTemplates`, `PersonalizeSection`, `Testimonials`, and `TemplateCard`) utilize native `loading="lazy"` attributes, deferring their network requests until the user approaches the respective scroll offset.
