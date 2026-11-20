import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export const metadata: Metadata = {
  title: 'You Are Mine — Bespoke Digital Invitation Web Pages for Life’s Special Moments',
  description:
    'Discover, personalize, and publish luxury digital invitation web pages for weddings, anniversaries, and milestone celebrations.',
  keywords: [
    'digital invitation web pages',
    'wedding invitation websites',
    'event landing pages',
    'personalized invitation pages',
    'luxury digital stationery',
    'anniversary invitation page',
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Cinzel:wght@500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Montserrat:wght@700;800;900&family=Outfit:wght@700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        {/* Critical LCP Image Preload for Mobile (<768px: 32KB) & Desktop (>=768px: 121KB) */}
        <link
          rel="preload"
          as="image"
          href="/herobg-mobile.webp"
          media="(max-width: 767px)"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/herobg.webp"
          media="(min-width: 768px)"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#49341F] selection:bg-[#EDE2CF] selection:text-[#49341F]">
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
