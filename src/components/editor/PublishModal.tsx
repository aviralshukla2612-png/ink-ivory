"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Sparkles,
  Check,
  ShieldCheck,
  Share2,
  Copy,
  ExternalLink,
  Tag,
  CreditCard,
  Lock,
  Heart,
  Globe,
} from "lucide-react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftId?: string;
  template: any;
  customFields: Record<string, any>;
  customDesign: Record<string, any>;
  onPublished?: (slug: string, url: string) => void;
}

export default function PublishModal({
  isOpen,
  onClose,
  draftId: initialDraftId,
  template,
  customFields,
  customDesign,
  onPublished,
}: PublishModalProps) {
  const [couponCode, setCouponCode] = useState("");
  const [quote, setQuote] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [publishedData, setPublishedData] = useState<{ slug: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(initialDraftId);

  // Load Razorpay Script & handle Escape key
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isProcessing, onClose]);

  // Fetch Pricing Quote
  const fetchQuote = async (code?: string) => {
    setLoadingQuote(true);
    setCouponError("");
    try {
      const res = await fetch("/api/pricing/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template?.id || "tpl-date-planner-07",
          couponCode: code || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.quote) {
        setQuote(data.quote);
        if (code && !data.quote.couponApplied) {
          setCouponError("Invalid promo code");
        }
      }
    } catch (e) {
      console.error("Quote fetch error", e);
    } finally {
      setLoadingQuote(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQuote();
      setPublishedData(null);
    }
  }, [isOpen, template]);

  if (!isOpen) return null;

  // Auto-save draft before initiating checkout
  const ensureSavedDraft = async (): Promise<string> => {
    if (currentDraftId) return currentDraftId;

    const res = await fetch("/api/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: template.id,
        title: customFields.headline || customFields.names || template.title,
        fields: customFields,
        design: customDesign,
      }),
    });
    const data = await res.json();
    if (data.success && data.draft) {
      setCurrentDraftId(data.draft.id);
      return data.draft.id;
    }
    throw new Error("Failed to save draft before payment");
  };

  // Handle Razorpay Payment flow
  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    try {
      const dId = await ensureSavedDraft();

      // 1. Create order on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: dId,
          couponCode: quote?.couponCode,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert(orderData.error || "Order creation failed");
        setIsProcessing(false);
        return;
      }

      const { orderId, amount, currency, keyId } = orderData;

      // 2. Open Razorpay Checkout or fallback verification
      if ((window as any).Razorpay) {
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "You Are Mine",
          description: `Publish: ${template.title}`,
          image: "/logo.png",
          order_id: orderId,
          handler: async (response: any) => {
            // Verify on server
            await verifyAndPublish({
              orderId: response.razorpay_order_id || orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              draftId: dId,
            });
          },
          prefill: {
            name: customFields.names?.split("&")?.[0]?.trim() || "Guest",
            email: "guest@youaremine.com",
            contact: "+919876543210",
          },
          theme: {
            color: "#641A2A",
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", (resp: any) => {
          alert(`Payment failed: ${resp.error.description}`);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback for sandbox / local development test verification
        await verifyAndPublish({
          orderId,
          paymentId: "pay_test_" + Date.now(),
          signature: "dev_mock_signature_" + Date.now(),
          draftId: dId,
        });
      }
    } catch (e: any) {
      alert(e.message || "Something went wrong during payment");
      setIsProcessing(false);
    }
  };

  // Verify signature and publish on server
  const verifyAndPublish = async (payload: {
    orderId: string;
    paymentId: string;
    signature: string;
    draftId: string;
  }) => {
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.invitationUrl) {
        setPublishedData({ slug: data.slug, url: data.invitationUrl });
        if (onPublished) onPublished(data.slug, data.invitationUrl);
      } else {
        alert(data.error || "Payment verification failed");
      }
    } catch (e: any) {
      alert("Verification request error: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyUrl = () => {
    if (!publishedData?.url) return;
    navigator.clipboard.writeText(publishedData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-2xl my-6">
        {/* Prominent Cross / Close Button (Always visible & easy to tap) */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EFE7D5] hover:bg-[#DFCEAF] text-[#3A220F] flex items-center justify-center shadow-md border border-[#D5C29D] transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {publishedData ? (
          /* ================= SUCCESS: INVITATION PUBLISHED ================= */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#872236] to-[#B51F3B] text-white flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-[#FFF2ED]">
              <Sparkles className="w-8 h-8 text-amber-200 animate-pulse" />
            </div>

            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#8F6E3B] font-semibold">
              Payment Verified &bull; Official Publication
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#3A220F] font-bold mt-1 mb-2">
              Your Invitation Is Live! ♡
            </h2>
            <p className="text-xs sm:text-sm text-[#49341F]/80 max-w-sm mx-auto mb-6">
              Your personalized website is now active on the public web. Anyone with this link can open your invitation instantly.
            </p>

            {/* Live Link Box */}
            <div className="bg-white rounded-2xl p-4 border border-[#DFCEAF] shadow-xs mb-6 text-left">
              <span className="text-[10px] uppercase font-semibold text-[#8F6E3B] tracking-wider block mb-1">
                Shareable Public URL:
              </span>
              <div className="flex items-center justify-between gap-2 bg-[#FCFAF6] p-2.5 rounded-xl border border-[#DFCEAF]/60 text-xs text-[#49341F] font-mono break-all">
                <span className="truncate">{publishedData.url}</span>
                <button
                  type="button"
                  onClick={copyUrl}
                  className="px-3 py-1.5 rounded-lg bg-[#8F6E3B] text-white text-xs font-sans font-medium hover:bg-[#785b30] shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `💌 Open our exclusive digital invitation: ${publishedData.url}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-sm transition-all shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Invitation via WhatsApp</span>
              </a>

              <a
                href={publishedData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-[#DFCEAF] hover:bg-white text-xs font-medium text-[#49341F] transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Live Website In New Tab</span>
              </a>
            </div>
          </div>
        ) : (
          /* ================= STEP: PUBLISH & PAY ================= */
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-[#8F6E3B] font-semibold mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Pay To Publish</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#3A220F] font-bold mb-1">
              Publish My Website
            </h2>
            <p className="text-xs text-[#49341F]/80 mb-5">
              Review your publication details. Your draft has been safely saved.
            </p>

            {/* Template Summary Card */}
            <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#DFCEAF] shadow-xs mb-5">
              {template.previewImage && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#DFCEAF]/50">
                  <Image
                    src={template.previewImage}
                    alt={template.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="overflow-hidden">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#8F6E3B] block">
                  {template.occasion} Design
                </span>
                <h3 className="font-serif font-bold text-base text-[#3A220F] truncate">
                  {template.title}
                </h3>
                <span className="text-xs text-[#49341F]/70 block truncate">
                  {customFields.names || "Bespoke Invitation"}
                </span>
              </div>
            </div>

            {/* Included Features */}
            <div className="bg-[#FAF7F0] rounded-2xl p-4 border border-[#DFCEAF]/60 mb-5 text-xs text-[#49341F] space-y-2">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#8F6E3B] block mb-2">
                Included With Your Publication:
              </span>
              {(quote?.features || [
                "Your Custom Shareable Link (e.g. youaremine.com/invite/...)",
                "Instant 1-Click WhatsApp sharing for family & friends",
                "Live & Active for 1 Full Year for your celebrations",
                "Background music & opening animations included",
                "Opens smoothly on every phone & laptop (no guest app needed)",
                "Guest RSVP collection & event schedule details",
                "100% Ad-Free, clean luxury experience for your guests",
              ]).map((feat: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-[#49341F]/85">
                  <Check className="w-3.5 h-3.5 text-[#8F6E3B] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-[#8F6E3B] uppercase tracking-wider mb-1.5">
                Have a Promo Code?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#8F6E3B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. LOVE2026 or YOUMINE50"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white focus:outline-none focus:ring-1 focus:ring-[#8F6E3B] uppercase font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fetchQuote(couponCode)}
                  disabled={loadingQuote || !couponCode.trim()}
                  className="px-4 py-2 rounded-xl bg-[#EDE2CF] text-[#49341F] text-xs font-medium hover:bg-[#dfceaf] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] text-red-600 mt-1">{couponError}</p>}
              {quote?.couponApplied && (
                <p className="text-[10px] text-green-700 mt-1 font-medium">
                  ✓ Promo applied: {quote.couponCode} (Saved ₹{Math.round(quote.discountPaise / 100)})
                </p>
              )}
            </div>

            {/* Price Summary */}
            <div className="border-t border-[#DFCEAF] pt-4 mb-6 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#49341F]/70 block">Total Publishing Price:</span>
                <span className="text-[10px] text-[#49341F]/60">One-time payment • Live for 1 full year • No hidden fees</span>
              </div>
              <div className="text-right">
                {quote?.discountPaise > 0 && (
                  <span className="text-xs text-[#49341F]/50 line-through mr-2">
                    ₹{quote.baseAmountRupees}
                  </span>
                )}
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#641A2A]">
                  ₹{quote?.finalAmountRupees || 349}
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-gradient-to-r from-[#641A2A] via-[#872236] to-[#B51F3B] hover:opacity-95 text-white font-medium text-sm shadow-[0_10px_25px_-5px_rgba(100,26,42,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? "Processing..." : `Pay ₹${quote?.finalAmountRupees || 349} & Publish Live`}</span>
            </button>

            {/* Cancel & Return to Editor Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full mt-3 py-2.5 rounded-full border border-[#DFCEAF] hover:bg-[#F2ECE1] text-xs font-semibold text-[#8F6E3B] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Cancel &amp; Keep Editing For Free</span>
            </button>

            <p className="text-center text-[10px] text-[#49341F]/50 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>Secured by Razorpay &bull; Try free, pay only when publishing</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
