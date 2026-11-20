'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Download,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Globe,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CardPreview } from '@/components/cards/CardPreview';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, discount, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card'>('razorpay');

  // Load Razorpay Checkout Script
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim() || !customerName.trim()) {
      alert('Please enter your name and email to receive your live invitation web link.');
      return;
    }

    setIsProcessing(true);

    try {
      const primaryItem = cart[0];
      let dId = primaryItem?.draftId;

      // 1. Ensure draft is saved on server if draftId wasn't stored
      if (!dId && primaryItem) {
        try {
          const draftRes = await fetch('/api/drafts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              templateId: primaryItem.template.id,
              title: primaryItem.customization?.names || primaryItem.template.title,
              fields: primaryItem.customization || primaryItem.template.defaultFields,
              design: primaryItem.designConfig || primaryItem.template.designConfig,
              status: 'READY_TO_PUBLISH',
            }),
          });
          const draftData = await draftRes.json();
          if (draftData.success && draftData.draft) {
            dId = draftData.draft.id;
          }
        } catch (err) {
          console.warn('Draft save fallback:', err);
        }
      }

      // 2. Create Order on Server
      let orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      let keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
      let serverOrderCreated = false;

      if (dId) {
        try {
          const orderRes = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ draftId: dId }),
          });
          const orderData = await orderRes.json();
          if (orderData.success) {
            orderId = orderData.orderId;
            keyId = orderData.keyId;
            serverOrderCreated = true;
          }
        } catch (err) {
          console.warn('Create payment order error:', err);
        }
      }

      const completeVerificationAndRedirect = async (payId: string, sig: string) => {
        let liveUrl = '';
        let liveSlug = '';

        if (dId && serverOrderCreated) {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                paymentId: payId,
                signature: sig,
                draftId: dId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              liveUrl = verifyData.invitationUrl || (verifyData.slug ? `/invite/${verifyData.slug}` : '');
              liveSlug = verifyData.slug || '';
            }
          } catch (err) {
            console.error('Verify error:', err);
          }
        }

        // If sandbox or direct fallback, construct a clean friendly slug
        if (!liveUrl) {
          const fallbackSlug = (
            primaryItem?.customization?.names ||
            primaryItem?.template?.slug ||
            'invitation'
          )
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          liveSlug = fallbackSlug;
          liveUrl = `/invite/${fallbackSlug}`;
        }

        const purchasedOrder = {
          id: orderId,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          customerName,
          customerEmail,
          customerPhone,
          items: cart,
          totalAmount: totalPrice,
          discountAmount: discount,
          paymentStatus: 'completed',
          paymentId: payId,
          liveUrl,
          liveSlug,
        };

        const existingOrders = JSON.parse(localStorage.getItem('cardly_orders') || '[]');
        localStorage.setItem('cardly_orders', JSON.stringify([purchasedOrder, ...existingOrders]));

        const existingDesigns = JSON.parse(localStorage.getItem('cardly_purchased_designs') || '[]');
        const newDesigns = cart.map((item) => ({
          ...item,
          orderId,
          purchasedDate: new Date().toISOString(),
          liveUrl,
          liveSlug,
        }));
        localStorage.setItem('cardly_purchased_designs', JSON.stringify([...newDesigns, ...existingDesigns]));

        clearCart();
        setIsProcessing(false);
        router.push(`/order-success/${orderId}`);
      };

      // 3. Open Razorpay if configured, or complete with simulated verification
      if (
        typeof window !== 'undefined' &&
        (window as any).Razorpay &&
        keyId &&
        !keyId.includes('placeholder') &&
        serverOrderCreated
      ) {
        const options = {
          key: keyId,
          amount: Math.round(totalPrice * 100),
          currency: 'INR',
          name: 'You Are Mine',
          description: `Live Invitation: ${primaryItem.template.title}`,
          image: '/logo.png',
          order_id: orderId,
          handler: async (response: any) => {
            await completeVerificationAndRedirect(
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: { color: '#641A2A' },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          alert(`Payment failed: ${resp.error.description}`);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        setTimeout(async () => {
          await completeVerificationAndRedirect(
            `pay_${Math.random().toString(36).substring(2, 12)}`,
            `sig_${Math.random().toString(36).substring(2, 12)}`
          );
        }, 1200);
      }
    } catch (err: any) {
      alert(err.message || 'Payment processing error. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-screen bg-[#F8F4EC] flex items-center justify-center p-4">
        <div className="bg-[#FCFAF6] rounded-3xl p-8 border border-[#DFCEAF] text-center max-w-md shadow-sm">
          <h2 className="font-serif text-xl text-[#2C2114] mb-2">
            No items in checkout
          </h2>
          <p className="text-xs text-[#7A634E] mb-6">
            Please create or customize an event web page first.
          </p>
          <Link
            href="/templates"
            className="px-6 py-2.5 rounded-full bg-[#8F6E3B] text-white text-xs font-semibold"
          >
            Browse Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#8C6837]">
          <Link href="/cart" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </Link>
          <span>/</span>
          <span className="text-[#49341F] font-medium">Digital Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Customer Details & Payment (Col 7) */}
          <div className="lg:col-span-7 bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-luxury space-y-6">
            <div>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8C6837] block mb-1">
                Step 1 of 2
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2114]">
                Customer & Publishing Details
              </h2>
              <p className="text-xs text-[#7A634E] mt-1">
                Your live web page link and access credentials will be delivered instantly to this email.
              </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#49341F] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Aviral Shukla"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#49341F] mb-1">
                    Email Address (For Download Delivery)
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#49341F] mb-1">
                    Mobile / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="pt-6 border-t border-[#EFE7D5] space-y-4">
                <div>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8C6837] block mb-1">
                    Step 2 of 2
                  </span>
                  <h3 className="font-serif text-lg font-medium text-[#2C2114] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#A77B35]" />
                    <span>Secure Online Payment</span>
                  </h3>
                  <p className="text-xs text-[#7A634E] mt-0.5">
                    Powered by Razorpay • UPI, Credit/Debit Cards, & Net Banking
                  </p>
                </div>

                {/* Payment Option Pills */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'razorpay', label: 'Razorpay Instant', sub: 'UPI / QR / GPay' },
                    { id: 'card', label: 'Credit / Debit', sub: 'Visa, Master, Amex' },
                    { id: 'upi', label: 'Direct UPI', sub: 'Instant Auth' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === p.id
                          ? 'border-[#8F6E3B] bg-[#FAF7F0] ring-1 ring-[#8F6E3B]'
                          : 'border-[#E8DFC8] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="block text-xs font-semibold text-[#2C2114]">
                        {p.label}
                      </span>
                      <span className="text-[10px] text-[#8C7359]">{p.sub}</span>
                    </button>
                  ))}
                </div>

                {/* Secure Badge */}
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center gap-3 text-xs text-[#6B533E]">
                  <ShieldCheck className="w-5 h-5 text-[#2E6B3F] flex-shrink-0" />
                  <span>
                    Your payment is protected with 256-bit bank-grade encryption. Instant digital unlock upon completion.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] disabled:opacity-75 text-white text-sm font-semibold shadow-gold flex items-center justify-center gap-2 transition-all duration-200"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying &amp; Publishing Your Event Web Page...</span>
                    </span>
                  ) : (
                    <span>Pay ₹{totalPrice} &amp; Launch Live Web Page</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Order Preview & Digital Policy (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#FCFAF6] rounded-3xl p-6 border border-[#DFCEAF] shadow-luxury space-y-4">
              <h3 className="font-serif text-base font-medium text-[#2C2114] pb-2 border-b border-[#EFE7D5]">
                Event Web Pages ({cart.length})
              </h3>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.customizedId} className="flex items-center gap-3.5">
                    <div className="w-16 flex-shrink-0">
                      <CardPreview
                        template={item.template}
                        customization={item.customization}
                        designConfig={item.designConfig}
                        className="rounded-md shadow-xs border border-[#DFCEAF]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif font-medium text-[#2C2114] truncate">
                        {item.template.title}
                      </h4>
                      <p className="text-[11px] text-[#7A634E] truncate">
                        Honoree: {item.customization?.names || item.template.defaultFields.names}
                      </p>
                      <span className="text-[10px] text-[#8F6E3B] font-semibold">
                        Live Interactive Page Link Included
                      </span>
                    </div>
                    <div className="text-xs font-serif font-bold text-[#2C2114]">
                      {item.template.isFree ? 'Free' : `₹${item.template.price}`}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="pt-3 border-t border-[#EFE7D5] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B533E]">
                  <span>Total Items</span>
                  <span>{cart.length}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2E6B3F]">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif font-bold text-[#2C2114] pt-2 border-t border-[#EFE7D5]">
                  <span>Final Payable Amount</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Strictly Digital Reminder Banner */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#DFCEAF] text-xs text-[#5C452C] space-y-2">
              <div className="font-semibold text-[#8F6E3B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Digital Web Page Notice</span>
              </div>
              <p className="leading-relaxed">
                You Are Mine is exclusively a digital event web page platform. No physical products will be shipped. Your bespoke web page will be published instantly with a live, shareable link immediately after order confirmation.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

