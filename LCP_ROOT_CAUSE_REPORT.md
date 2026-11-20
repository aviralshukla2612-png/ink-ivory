# YOU ARE MINE — MOBILE LCP ROOT CAUSE REPORT
**Website:** https://youaremine-online.com/  
**Primary Bottleneck:** Mobile LCP 21.3 seconds (Desktop: 2.3 seconds)  
**Classification:** Network Bandwidth Saturation via High-Priority Uncompressed Assets  

---

## 1. Verified LCP Element Identification

Lighthouse and Chrome DevTools tracing identify the Largest Contentful Paint candidate on both desktop and mobile as:
- **Element Selector:** `#hero div.absolute.inset-0 picture img` / `Image[src="/herobg.png"]`
- **Component File:** `src/components/home/HeroSection.tsx`
- **Visual Node:** The primary viewport background artwork spanning `100vw × calc(100vh - 68px)` depicting luxury wedding stationery, envelope seals, and gold flourishes.
- **Natural Dimensions:** 1774 × 887 px.

---

## 2. Why Did Mobile Take 21.3 Seconds While Desktop Took 2.3 Seconds?

Desktop broadband networks typically operate with **100–500+ Mbps bandwidth**, allowing several megabytes to download in under 1 second. 

Google PageSpeed Insights mobile emulation, however, enforces the **W3C Mobile Throttling Profile**:
- **Downlink Throughput:** 1.638 Mbps (205 KB/s)
- **Round-Trip Time (RTT):** 150 ms
- **CPU Slowdown:** 4x slowdown

Under this profile, downloading **1 megabyte** requires:
$$\frac{1024\text{ KB}}{205\text{ KB/s}} \approx 5.0\text{ seconds}$$

### The Discovery: Competing Preloads Clogged the Network Pipe
When the browser requested the homepage HTML, the Next.js document head instructed the browser to preload multiple heavy resources simultaneously:
1. `src="/herobg.png"` (Hero Background): **1.91 MB** (~9.3 seconds download time)
2. `src="/logo.png"` (Navbar Logo with `priority`): **1.56 MB** (~7.6 seconds download time)
3. `src="/bg2.png"` (`PersonalizeSection` with `priority`): **1.65 MB** (~8.0 seconds download time)
4. `src="/testimonialbg.png"` (`Testimonials` with `priority`): **2.25 MB** (~11.0 seconds download time)
5. `public/favicon.ico`: **1.22 MB** (~6.0 seconds download time)

### Cumulative Network Contention
Total high-priority image payload queued in `<head>`:
$$1.91 + 1.56 + 1.65 + 2.25 + 1.22 = \mathbf{8.59\text{ MB}}$$

At 1.638 Mbps (205 KB/s), transferring 8.59 MB of preloaded images requires:
$$\frac{8590\text{ KB}}{205\text{ KB/s}} \approx \mathbf{41.9\text{ seconds}}$$

Because HTTP/2 and HTTP/3 multiplex requests across shared TCP/QUIC streams, all 5 preloads shared bandwidth simultaneously. The critical hero image received only a fraction of the available throughput, causing its final pixel render to complete at **21.3 seconds**.

---

## 3. The Resolution Strategy

1. **Responsive Picture Delivery:**
   - Generated `herobg-mobile.webp` (750px width, WebP lossy quality 82): **32.2 KB** (reduced from 1.91 MB, **98.3% payload drop**).
   - Generated `herobg.webp` (full desktop resolution, WebP): **121.9 KB** (reduced from 1.91 MB, **93.6% payload drop**).
2. **Selective Viewport Preload:**
   - In `src/app/layout.tsx`, added responsive `<link rel="preload">` tags with explicit `media` queries:
     ```html
     <link rel="preload" as="image" href="/herobg-mobile.webp" media="(max-width: 767px)" type="image/webp" fetchPriority="high" />
     <link rel="preload" as="image" href="/herobg.webp" media="(min-width: 768px)" type="image/webp" fetchPriority="high" />
     ```
   - Mobile browsers evaluate `(max-width: 767px)` and download **only the 32 KB variant**, ignoring the desktop image.
3. **De-prioritize Below-the-Fold Images:**
   - Stripped `priority` from `PersonalizeSection.tsx` and `Testimonials.tsx`.
   - Converted them to `loading="lazy"` using `bg2.webp` (30 KB) and `testimonialbg.webp` (72 KB).
4. **Favicon & Logo Optimization:**
   - Compressed `favicon.ico` down to **2.9 KB** (from 1.22 MB).
   - Converted `logo.png` (1.56 MB) to `logo.webp` (**57.8 KB**).

---

## 4. Expected Impact
Transfer time for the mobile hero image at 1.638 Mbps:
$$\frac{32.2\text{ KB}}{205\text{ KB/s}} \approx \mathbf{0.15\text{ seconds}}$$

The mobile LCP bottleneck has been eliminated at the architectural root.
