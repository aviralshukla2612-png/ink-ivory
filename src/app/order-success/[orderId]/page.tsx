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
  const cardDownloadRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPng = async () => {
    if (!cardDownloadRef.current) return;
    setDownloadingPng(true);
    try {
      const dataUrl = await toPng(cardDownloadRef.current, {
        quality: 1.0,
        pixelRatio: 3, // 300+ DPI crisp high resolution
      });
      const link = document.createElement('a');
      link.download = `InkIvory-${order?.items?.[0]?.template?.title || 'WebPage'}-Preview.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG download error:', err);
      alert('Could not export PNG. Please try again.');
    } finally {
      setDownloadingPng(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!cardDownloadRef.current) return;
    setDownloadingPdf(true);
    try {
      const dataUrl = await toPng(cardDownloadRef.current, {
        quality: 1.0,
        pixelRatio: 3,
      });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5',
      });
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`InkIvory-${order?.items?.[0]?.template?.title || 'WebPage'}-Brochure.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Could not export PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const primaryItem = order?.items?.[0];

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
            Thank you for choosing Ink & Ivory. Your custom event web page is now live, fully responsive, and ready to share with your guests.
          </p>

          {/* Quick Order Info Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 px-5 py-2.5 rounded-full bg-[#F3EDE1] border border-[#DFCEAF] text-xs text-[#574330] mb-8">
            <span>Order ID: <strong className="text-[#2C2114]">{order?.id}</strong></span>
            <span>•</span>
            <span>Customer: <strong className="text-[#2C2114]">{order?.customerName}</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-[#2E6B3F]">Completed</strong></span>
          </div>

          {/* Card Presentation & Download Node */}
          {primaryItem && (
            <div className="max-w-sm mx-auto mb-8">
              <div
                ref={cardDownloadRef}
                className="bg-white p-2 rounded-2xl shadow-luxury-lg border border-[#A77B35]/40"
              >
                <CardPreview
                  template={primaryItem.template}
                  customization={primaryItem.customization}
                  designConfig={primaryItem.designConfig}
                  showWatermark={false}
                  className="rounded-xl shadow-md"
                />
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
            <span>Saved permanently in your Ink & Ivory customer account for live management.</span>
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

