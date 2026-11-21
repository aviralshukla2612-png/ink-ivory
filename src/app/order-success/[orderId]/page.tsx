'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Download,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Share2,
  Globe,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { templatesData } from '@/data/templates';
import { CardPreview } from '@/components/cards/CardPreview';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardDownloadRef = useRef<HTMLDivElement>(null);

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

  // Fallback high-res direct canvas renderer (300 DPI, completely immune to DOM/CORS font errors)
  const renderCardCanvas = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1748;
    canvas.height = 2480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // 1. Royal Navy Gradient Background
    const bgGrad = ctx.createRadialGradient(874, 500, 50, 874, 1240, 1300);
    bgGrad.addColorStop(0, '#172A46');
    bgGrad.addColorStop(0.65, '#0B1322');
    bgGrad.addColorStop(1, '#050912');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1748, 2480);

    // 2. Double 24K Gold Borders
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(90, 90, 1568, 2300);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(106, 106, 1536, 2268);

    // Corner Ornaments
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(80, 80, 24, 6);
    ctx.fillRect(80, 80, 6, 24);
    ctx.fillRect(1644, 80, 24, 6);
    ctx.fillRect(1662, 80, 6, 24);
    ctx.fillRect(80, 2394, 24, 6);
    ctx.fillRect(80, 2376, 6, 24);
    ctx.fillRect(1644, 2394, 24, 6);
    ctx.fillRect(1662, 2376, 6, 24);

    // 3. Top Eyebrow
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`✨ ${(fields.eyebrow || 'TOGETHER WITH THEIR FAMILIES').toUpperCase()} ✨`, 874, 380);

    // 4. Headline
    ctx.fillStyle = '#E2D5BE';
    ctx.font = 'italic 44px serif';
    ctx.fillText(fields.headline || 'The Wedding Celebration Of', 874, 500);

    // 5. Couple Names
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 100px serif';
    ctx.fillText(fields.names || 'Aarav & Riya', 874, 820);

    // 6. Gold Flourish Divider
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(600, 910);
    ctx.lineTo(820, 910);
    ctx.moveTo(928, 910);
    ctx.lineTo(1148, 910);
    ctx.stroke();
    ctx.fillStyle = '#D4AF37';
    ctx.font = '36px serif';
    ctx.fillText('✦', 874, 922);

    // 7. Date & Time
    if (fields.date) {
      ctx.fillStyle = '#F3CF7A';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText(fields.date.toUpperCase(), 874, 1070);
    }
    if (fields.time) {
      ctx.fillStyle = '#E5D7C3';
      ctx.font = '34px sans-serif';
      ctx.fillText(fields.time, 874, 1140);
    }

    // 8. Blessing Message
    if (fields.message) {
      ctx.fillStyle = '#D5C7B3';
      ctx.font = 'italic 36px serif';
      const words = fields.message.split(' ');
      let line = '';
      let y = 1320;
      for (const w of words) {
        const testLine = line + w + ' ';
        if (ctx.measureText(testLine).width > 1200) {
          ctx.fillText(`“${line.trim()}”`, 874, y);
          line = w + ' ';
          y += 55;
        } else {
          line = testLine;
        }
      }
      if (line) ctx.fillText(`“${line.trim()}”`, 874, y);
    }

    // 9. Venue & City
    if (fields.venue) {
      ctx.fillStyle = '#F4E6D0';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(fields.venue.toUpperCase(), 874, 1850);
    }
    if (fields.city) {
      ctx.fillStyle = '#C5B49C';
      ctx.font = '36px sans-serif';
      ctx.fillText(fields.city, 874, 1920);
    }

    // 10. Bottom Brand & Live Invitation Link
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.beginPath();
    ctx.moveTo(200, 2150);
    ctx.lineTo(1548, 2150);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 26px monospace';
    ctx.fillText('YOU ARE MINE', 220, 2220);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '26px monospace';
    ctx.fillText(liveUrl.replace(/^https?:\/\//, ''), 1528, 2220);

    return canvas.toDataURL('image/png', 1.0);
  };

  const getCardImage = async (): Promise<string> => {
    if (cardDownloadRef.current) {
      try {
        return await toPng(cardDownloadRef.current, {
          quality: 1.0,
          pixelRatio: 3,
          skipFonts: true,
          cacheBust: true,
        });
      } catch (domErr) {
        console.warn('DOM toPng fallback triggered:', domErr);
      }
    }
    return renderCardCanvas();
  };

  const handleDownloadPng = async () => {
    setDownloadingPng(true);
    try {
      const dataUrl = await getCardImage();
      const safeName = (fields?.names || primaryItem?.template?.title || 'Wedding')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-');
      const link = document.createElement('a');
      link.download = `YouAreMine-${safeName}-Invitation.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG download error:', err);
      // Final resilient fallback
      const fallbackUrl = renderCardCanvas();
      const link = document.createElement('a');
      link.download = `YouAreMine-Wedding-Invitation.png`;
      link.href = fallbackUrl;
      link.click();
    } finally {
      setDownloadingPng(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const dataUrl = await getCardImage();
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5',
      });
      const imgProps = pdf.getImageProperties(dataUrl);
      const pageWidth = pdf.internal.pageSize.getWidth(); // 148 mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

      // Rich warm parchment background fill
      pdf.setFillColor(248, 244, 236);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Balanced margins for professional print
      const margin = 6;
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - margin * 2;

      let finalW = maxW;
      let finalH = (imgProps.height * finalW) / imgProps.width;

      if (finalH > maxH) {
        finalH = maxH;
        finalW = (imgProps.width * finalH) / imgProps.height;
      }

      const x = (pageWidth - finalW) / 2;
      const y = (pageHeight - finalH) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, finalW, finalH, undefined, 'FAST');

      const safeName = (fields?.names || primaryItem?.template?.title || 'Wedding')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-');
      pdf.save(`YouAreMine-${safeName}-Invitation.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
      // Resilient PDF fallback
      try {
        const fallbackUrl = renderCardCanvas();
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
        pdf.addImage(fallbackUrl, 'PNG', 6, 6, 136, 198);
        pdf.save(`YouAreMine-Wedding-Invitation.pdf`);
      } catch (fErr) {
        alert('Could not export PDF. Please try again.');
      }
    } finally {
      setDownloadingPdf(false);
    }
  };

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

          {/* Card Presentation & Download Node */}
          {primaryItem && (
            <div className="max-w-md mx-auto mb-8">
              <div
                ref={cardDownloadRef}
                className="bg-[#0A1120] text-[#F5EADB] p-7 sm:p-9 rounded-2xl shadow-luxury-2xl border-2 border-[#D4AF37] relative overflow-hidden select-none flex flex-col justify-between"
                style={{
                  aspectRatio: '1 / 1.414',
                  background:
                    'radial-gradient(ellipse at 50% 20%, #172A46 0%, #0B1322 65%, #050912 100%)',
                }}
              >
                {/* Subtle Luxury Gold Starlight / Mandala Texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-15"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212,175,55,0.4) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Double Gold Ornate Border Frame */}
                <div className="absolute inset-4 sm:inset-5 border border-[#D4AF37]/80 pointer-events-none rounded-lg">
                  <div className="absolute inset-1.5 border border-[#D4AF37]/40 rounded" />
                  {/* Ornate Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />
                </div>

                {/* TOP HEADER */}
                <div className="relative z-10 text-center pt-2">
                  <div className="inline-flex items-center justify-center gap-2 text-[#D4AF37] text-xs mb-1.5">
                    <span className="text-[10px]">✨</span>
                    <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold text-[#D4AF37]">
                      {fields.eyebrow || 'TOGETHER WITH THEIR FAMILIES'}
                    </span>
                    <span className="text-[10px]">✨</span>
                  </div>

                  <p className="text-xs sm:text-sm font-serif italic text-[#E2D5BE] tracking-widest opacity-90">
                    {fields.headline || 'The Wedding Celebration Of'}
                  </p>
                </div>

                {/* CENTER: COUPLE NAMES & CEREMONY */}
                <div className="relative z-10 text-center my-auto py-2">
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-[40px] font-bold text-white tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    {fields.names || 'Aarav & Riya'}
                  </h2>

                  {/* Gold Flourish Divider */}
                  <div className="flex items-center justify-center gap-3 my-2.5 text-[#D4AF37]">
                    <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                    <span className="text-xs">✦</span>
                    <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                  </div>

                  {/* Date & Time */}
                  {fields.date && (
                    <p className="text-xs sm:text-sm font-semibold text-[#F3CF7A] tracking-[0.2em] uppercase mb-0.5">
                      {fields.date}
                    </p>
                  )}
                  {fields.time && (
                    <p className="text-[11px] sm:text-xs text-[#E5D7C3] tracking-wider font-sans opacity-90">
                      {fields.time}
                    </p>
                  )}

                  {/* Couple Message / Blessing */}
                  {fields.message && (
                    <p className="text-[11px] sm:text-xs italic font-serif leading-relaxed text-[#D5C7B3] max-w-[88%] mx-auto mt-2.5">
                      &ldquo;{fields.message}&rdquo;
                    </p>
                  )}
                </div>

                {/* BOTTOM: VENUE & LIVE INVITATION LINK */}
                <div className="relative z-10 text-center pb-2">
                  {fields.venue && (
                    <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-[#F4E6D0]">
                      {fields.venue}
                    </p>
                  )}
                  {fields.city && (
                    <p className="text-[10.5px] sm:text-xs text-[#C5B49C] tracking-wide mt-0.5">
                      {fields.city}
                    </p>
                  )}

                  {/* Live Portal & RSVP Link */}
                  <div className="pt-2.5 mt-2.5 border-t border-[#D4AF37]/40 flex items-center justify-between text-[9px] sm:text-[9.5px] text-[#D4AF37] px-2 font-mono">
                    <span className="tracking-wider">YOU ARE MINE</span>
                    <span className="tracking-tight truncate max-w-[190px] text-white/90">
                      {liveUrl.replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Download Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={handleDownloadPng}
              disabled={downloadingPng}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] disabled:opacity-75 text-white text-xs sm:text-sm font-semibold shadow-gold flex items-center justify-center gap-2 transition-all"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{downloadingPng ? 'Rendering...' : 'Download High-Res PNG (300 DPI)'}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#8F6E3B] text-[#8F6E3B] disabled:opacity-75 text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>{downloadingPdf ? 'Generating...' : 'Download Print-Ready PDF'}</span>
            </button>
          </div>

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

