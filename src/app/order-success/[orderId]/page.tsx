'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Share2,
  Globe,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { templatesData } from '@/data/templates';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Compute live invitation link
  const liveUrl = React.useMemo(() => {
    if (!order) return '';
    if (order.liveUrl && order.liveUrl.startsWith('http')) return order.liveUrl;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://youaremine.online';
    if (order.liveUrl) return `${origin}${order.liveUrl}`;
    if (order.liveSlug) return `${origin}/invite/${order.liveSlug}`;
    if (order.items?.[0]?.template?.slug) {
      return `${origin}/invite/${order.items[0].template.slug}`;
    }
    return `${origin}/invite/live`;
  }, [order]);

  const handleCopyLink = () => {
    if (!liveUrl) return;
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    // Load order from local storage
    const savedOrders = JSON.parse(localStorage.getItem('cardly_orders') || '[]');
    const current = savedOrders.find((o: any) => o.id === orderId);

    if (current) {
      setOrder(current);
    } else {
      // Fallback dummy order for direct view
      setOrder({
        id: orderId || 'ORD-CARDLY-DEMO',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        customerName: 'Valued Guest',
        customerEmail: 'customer@example.com',
        items: [
          {
            template: templatesData[0],
            customization: templatesData[0].defaultFields,
            designConfig: templatesData[0].designConfig,
          },
        ],
        totalAmount: 349,
        paymentStatus: 'completed',
        paymentId: 'pay_demo_success',
      });
    }
  }, [orderId]);

  const primaryItem = order?.items?.[0];
  const fields = { ...primaryItem?.template?.defaultFields, ...primaryItem?.customization };

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="bg-[#FCFAF6] rounded-3xl p-8 sm:p-12 border border-[#DFCEAF] shadow-luxury text-center mb-8 relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-[#E8F3EA] text-[#2E6B3F] border border-[#CBE5D3] flex items-center justify-center mx-auto mb-4 shadow-sm animate-in zoom-in">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold tracking-widest uppercase text-[#8F6E3B] block mb-2">
            Payment Verified • Digital Order Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-[#2C2114] mb-3">
            Your Bespoke Event Web Page is Live!
          </h1>

          <p className="text-xs sm:text-sm text-[#6B533E] max-w-lg mx-auto leading-relaxed mb-6">
            Thank you for choosing You Are Mine. Your custom event web page is now live, fully responsive, and ready to share with your guests.
          </p>

          {/* Quick Order Info Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 px-5 py-2.5 rounded-full bg-[#F3EDE1] border border-[#DFCEAF] text-xs text-[#574330] mb-8">
            <span>Order ID: <strong className="text-[#2C2114]">{order?.id}</strong></span>
            <span>•</span>
            <span>Customer: <strong className="text-[#2C2114]">{order?.customerName}</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-[#2E6B3F]">Completed</strong></span>
          </div>

          {/* Live Invitation Shareable Link Box */}
          <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EA] to-[#F5ECE0] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-xl max-w-xl mx-auto mb-10 text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8F6E3B] to-[#D4AF37] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <Globe className="w-6 h-6" />
            </div>

            <span className="text-[10.5px] uppercase tracking-[0.25em] font-bold text-[#8F6E3B] block mb-1">
              ✨ Congratulations! Your Invitation is Live
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2114] mb-2">
              Your Shareable Web Link
            </h2>
            <p className="text-xs text-[#7A634E] mb-4 max-w-md mx-auto leading-relaxed">
              Share this live interactive web page with all your guests. It is active 24/7 with your music, story, and details.
            </p>

            {/* URL Display Bar */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white border border-[#DFCEAF] shadow-inner mb-4 gap-2">
              <span className="font-mono text-xs sm:text-sm text-[#2C2114] font-medium truncate text-left pl-2 select-all">
                {liveUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons: Open & WhatsApp */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1C2C24] hover:bg-[#121c17] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live Website</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `You're warmly invited! View our live invitation here: ${liveUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card Cover Artwork Display */}
          {primaryItem && (
            <div className="max-w-xs sm:max-w-sm mx-auto mb-8">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] relative aspect-[3/4] bg-[#0A1120] group">
                <img
                  src={primaryItem.template?.previewImage || '/images/templates/royal-navy-wedding-card.webp'}
                  alt={primaryItem.template?.title || 'Card Cover Artwork'}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5 text-center">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#D4AF37] mb-1">
                    {fields.eyebrow || 'BESPOKE DIGITAL INVITATION'}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                    {fields.names || primaryItem.template?.title}
                  </h3>
                  <p className="text-xs text-[#E5D7C3] tracking-wider mt-1 font-medium">
                    {fields.date || primaryItem.template?.occasion}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Save confirmation */}
          <p className="text-[11px] text-[#7A634E] mt-6 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2E6B3F]" />
            <span>Saved permanently in your You Are Mine customer account for live management.</span>
          </p>

        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <Link
            href="/account"
            className="text-[#8F6E3B] font-semibold hover:underline flex items-center gap-1.5"
          >
            <span>View All My Purchased Designs in Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/templates"
            className="text-[#574330] hover:text-[#2C2114] hover:underline"
          >
            Browse More Digital Templates →
          </Link>
        </div>

      </div>
    </div>
  );
}

