# YOU ARE MINE — Web Application Final Report
**Platform:** Customer Website & Online Studio  
**Runtime:** Next.js 15.1.3 (App Router), React 19, Tailwind CSS 3.4.17  
**Official Brand Identity:** YOU ARE MINE

---

## 1. Feature Complete Capabilities

1. **Brand Homepage (`/`):**
   - High-impact hero section preloaded for instant mobile & desktop LCP (<1.2s).
   - Prominently showcases the newly updated official YOU ARE MINE brand logo (`/logo.webp`).
   - Interactive occasion collections (Weddings, Anniversaries, Birthdays, Proposals, Valentine's).
   - Testimonial carousel, How It Works guide, and luxury footer with FAQ.

2. **Template Marketplace (`/templates`):**
   - Category filters with real-time responsive cards.
   - Dynamic badges: "🎬 MOVING", "💌 INTERACTIVE PROPOSAL", "🪔 TEMPLE".
   - Transparent price indicators with signature tier tags.

3. **Customer Customization Studio (`/customize/:templateId`):**
   - Live real-time preview updating alongside customer inputs.
   - Touch-optimized bottom drawer controls on mobile devices.
   - Self-hosted audio preview selector featuring 100+ songs with instant story cropping.
   - Free customer workflow: browsing, customizing, photo uploading, and previewing are 100% free; payment only triggers when publishing a live URL.

4. **Streamlined One-Step Checkout (`/checkout`):**
   - Direct Mobile Phone Number + OTP verification.
   - Server-side price calculation preventing client-side tamper.
   - Integration with Razorpay gateway and automated publication creation upon signature verification.

5. **Public Invitation Viewer (`/invite/:slug`):**
   - Responsive presentation of bespoke invitations.
   - Built-in floating native share button with WhatsApp and Instagram deep links.
   - Immediate administrative suspension handling with review screen.
