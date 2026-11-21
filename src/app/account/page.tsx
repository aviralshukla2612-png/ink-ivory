'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  Download,
  Heart,
  Settings,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Eye,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { CardPreview } from '@/components/cards/CardPreview';
import { templatesData } from '@/data/templates';
import PublishModal from '@/components/editor/PublishModal';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'drafts' | 'published' | 'orders' | 'wishlist' | 'settings'>('drafts');
  const [drafts, setDrafts] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Publish Modal state from dashboard
  const [publishTarget, setPublishTarget] = useState<any | null>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const { wishlist } = useWishlist();

  const loadUserData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch user drafts
      const draftRes = await fetch('/api/drafts');
      const draftData = await draftRes.json();
      if (draftData.success && Array.isArray(draftData.drafts)) {
        setDrafts(draftData.drafts);
      }

      // 2. Fetch user publications
      const pubRes = await fetch('/api/publications');
      const pubData = await pubRes.json();
      if (pubData.success && Array.isArray(pubData.publications)) {
        setPublications(pubData.publications);
      }
    } catch (e) {
      console.error('Failed to load user account data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadUserData();

    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('cardly_orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleShareWhatsApp = (slug: string, title: string) => {
    const fullUrl = `${window.location.origin}/invite/${slug}`;
    const message = encodeURIComponent(`You are warmly invited! View our bespoke invitation:\n${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Account Header */}
        <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-luxury mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-[#EDE2CF] border border-[#DFCEAF] text-[#8F6E3B] font-serif font-bold text-2xl flex items-center justify-center">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2114]">
                  Aviral Shukla
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDE2CF] text-[#8F6E3B]">
                  VIP Patron
                </span>
              </div>
              <p className="text-xs text-[#7A634E] mt-0.5">
                aviral@example.com • You Are Mine Bespoke Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#DFCEAF]">
              <span className="text-base font-serif font-bold text-[#8F6E3B] block">
                {drafts.length}
              </span>
              <span className="text-[10px] text-[#7A634E] uppercase tracking-wider font-semibold">
                Saved Drafts
              </span>
            </div>

            <div className="text-center px-4 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#DFCEAF]">
              <span className="text-base font-serif font-bold text-emerald-700 block">
                {publications.length}
              </span>
              <span className="text-[10px] text-[#7A634E] uppercase tracking-wider font-semibold">
                Live Websites
              </span>
            </div>

            <div className="text-center px-4 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#DFCEAF]">
              <span className="text-base font-serif font-bold text-[#2C2114] block">
                {wishlist.length}
              </span>
              <span className="text-[10px] text-[#7A634E] uppercase tracking-wider font-semibold">
                Wishlist
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DFC8] mb-8 overflow-x-auto scrollbar-none gap-2">
          {[
            { id: 'drafts', label: `My Drafts (${drafts.length})`, icon: <FileText className="w-4 h-4" /> },
            { id: 'published', label: `Published Websites (${publications.length})`, icon: <Globe className="w-4 h-4" /> },
            { id: 'orders', label: 'Payment History', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: <Heart className="w-4 h-4" /> },
            { id: 'settings', label: 'Profile & Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#8F6E3B] text-[#8F6E3B]'
                  : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: MY DRAFTS */}
        {activeTab === 'drafts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl font-medium text-[#2C2114]">
                  In-Progress Drafts
                </h2>
                <p className="text-xs text-[#7A634E] mt-0.5">
                  Try and customize every design free before publishing. Your edits are securely saved.
                </p>
              </div>
              <Link
                href="/templates"
                className="px-4 py-2 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFECC7]" />
                <span>+ Customize New Template</span>
              </Link>
            </div>

            {loadingData ? (
              <div className="p-12 text-center text-xs text-[#7A634E]">
                <div className="w-6 h-6 border-2 border-[#8F6E3B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading your saved drafts...
              </div>
            ) : drafts.length === 0 ? (
              <div className="bg-[#FCFAF6] rounded-3xl p-10 text-center border border-[#DFCEAF]">
                <FileText className="w-12 h-12 text-[#A77B35] mx-auto mb-3 opacity-50" />
                <h3 className="font-serif text-lg text-[#2C2114] mb-1">
                  No active drafts yet
                </h3>
                <p className="text-xs text-[#7A634E] mb-5 max-w-md mx-auto">
                  Pick any wedding, date planner, valentine, or birthday template to customize for free.
                </p>
                <Link
                  href="/templates"
                  className="px-6 py-2.5 rounded-full bg-[#8F6E3B] text-white text-xs font-semibold shadow-gold inline-flex items-center gap-1.5"
                >
                  <span>Explore Template Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.map((draft) => {
                  const tpl = templatesData.find((t) => t.id === draft.templateId) || templatesData[0];
                  return (
                    <div
                      key={draft.id}
                      className="bg-[#FCFAF6] rounded-2xl p-5 border border-[#DFCEAF] shadow-luxury flex flex-col justify-between transition-all hover:border-[#8F6E3B]"
                    >
                      <div>
                        {/* Status Badge */}
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="font-mono text-[10px] text-[#8F6E3B] bg-[#EDE2CF] px-2 py-0.5 rounded">
                            {tpl.occasion}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            draft.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : draft.status === 'READY_TO_PUBLISH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}>
                            {draft.status === 'PUBLISHED' ? 'Published' : 'Free Draft'}
                          </span>
                        </div>

                        {/* Title & Names */}
                        <h3 className="font-serif text-base font-semibold text-[#2C2114] line-clamp-1 mb-1">
                          {draft.title || tpl.title}
                        </h3>
                        <p className="text-xs text-[#7A634E] mb-2">
                          Personalized for: <strong className="text-[#49341F]">{draft.fields?.names || 'Your Names'}</strong>
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-[#A28B75] mb-4">
                          <Clock className="w-3 h-3" />
                          <span>Last updated: {new Date(draft.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-[#F2ECE0] flex items-center gap-2">
                        <Link
                          href={`/customize/${draft.templateId}?draftId=${draft.id}`}
                          className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#DFCEAF] hover:border-[#8F6E3B] text-[#49341F] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#8F6E3B]" />
                          <span>Continue Editing</span>
                        </Link>

                        <button
                          onClick={() => {
                            setPublishTarget({
                              draftId: draft.id,
                              template: tpl,
                              fields: draft.fields,
                              design: draft.design,
                            });
                          }}
                          className="py-2 px-3.5 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
                          title="Publish this draft"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FFECC7]" />
                          <span>Publish</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PUBLISHED WEBSITES */}
        {activeTab === 'published' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl font-medium text-[#2C2114]">
                  Live Published Websites
                </h2>
                <p className="text-xs text-[#7A634E] mt-0.5">
                  Your live shareable web invitation links. Hosted on You Are Mine Cloud with guest RSVP &amp; streaming audio.
                </p>
              </div>
            </div>

            {loadingData ? (
              <div className="p-12 text-center text-xs text-[#7A634E]">
                <div className="w-6 h-6 border-2 border-[#8F6E3B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading your published websites...
              </div>
            ) : publications.length === 0 ? (
              <div className="bg-[#FCFAF6] rounded-3xl p-10 text-center border border-[#DFCEAF]">
                <Globe className="w-12 h-12 text-[#A77B35] mx-auto mb-3 opacity-50" />
                <h3 className="font-serif text-lg text-[#2C2114] mb-1">
                  No published websites yet
                </h3>
                <p className="text-xs text-[#7A634E] mb-5 max-w-md mx-auto">
                  Customize any invitation for free, then click "Publish My Website" to get your shareable link.
                </p>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className="px-6 py-2.5 rounded-full bg-[#8F6E3B] text-white text-xs font-semibold shadow-gold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Your Saved Drafts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Live &amp; Active
                        </span>
                        <span className="text-xs text-[#7A634E]">
                          Published {new Date(pub.publishedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-medium text-[#2C2114]">
                        {pub.snapshotData?.fields?.names || pub.templateTitle || 'You Are Mine Bespoke Invitation'}
                      </h3>

                      {/* Public Live URL */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-[#DFCEAF] text-[#8F6E3B] select-all">
                          {typeof window !== 'undefined' ? `${window.location.origin}/invite/${pub.slug}` : `/invite/${pub.slug}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(pub.slug)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCEAF] hover:border-[#8F6E3B] text-[#49341F] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        {copiedSlug === pub.slug ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#8F6E3B]" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleShareWhatsApp(pub.slug, pub.templateTitle)}
                        className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BE5A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <Link
                        href={`/invite/${pub.slug}`}
                        target="_blank"
                        className="px-4 py-2 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <span>Open Live</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/customize/${pub.templateId}?draftId=${pub.draftId}`}
                        className="px-3 py-2 rounded-xl border border-[#DFCEAF] hover:bg-white text-xs font-semibold text-[#49341F] transition-all"
                        title="Edit live website content"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENT & ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="bg-[#FCFAF6] rounded-2xl border border-[#DFCEAF] p-6 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2C2114] mb-4">
              Payment &amp; Publishing Invoices
            </h2>
            {orders.length === 0 ? (
              <p className="text-xs text-[#7A634E]">No past payment invoices found on this browser session.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl border border-[#E8DFC8] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <strong className="text-[#2C2114]">{ord.id}</strong>
                        <span>•</span>
                        <span className="text-[#7A634E]">{ord.date}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                          {ord.paymentStatus || 'Verified & Paid'}
                        </span>
                      </div>
                      <p className="text-xs text-[#574330] mt-1">
                        Total Amount: ₹{ord.totalAmount} • Includes 1-Year Cloud Hosting &amp; Dedicated Invitation URL
                      </p>
                    </div>

                    <Link
                      href={`/order-success/${ord.id}`}
                      className="text-xs font-semibold text-[#8F6E3B] hover:underline flex items-center gap-1"
                    >
                      <span>View Receipt</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-medium text-[#2C2114]">
                Saved Designs ({wishlist.length})
              </h2>
            </div>
            {wishlist.length === 0 ? (
              <div className="bg-[#FCFAF6] rounded-2xl p-10 text-center border border-[#DFCEAF]">
                <Heart className="w-8 h-8 text-[#A77B35] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#7A634E]">Your wishlist is currently empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-[#FCFAF6] rounded-2xl p-4 border border-[#DFCEAF] shadow-sm flex flex-col justify-between"
                  >
                    <div className="aspect-[3/4] bg-[#0A0F1A] rounded-xl overflow-hidden mb-3 shadow-md relative">
                      <img
                        src={tpl.previewImage || '/images/templates/royal-navy-wedding-card.webp'}
                        alt={tpl.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <h3 className="font-serif text-sm font-medium text-[#2C2114] truncate">
                      {tpl.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F2ECE0]">
                      <span className="font-serif font-bold text-xs text-[#2C2114]">
                        {tpl.isFree ? 'Free' : `₹${tpl.price}`}
                      </span>
                      <Link
                        href={`/customize/${tpl.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#8F6E3B] text-white text-[11px] font-semibold"
                      >
                        Customize Free
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-[#FCFAF6] rounded-2xl border border-[#DFCEAF] p-6 max-w-xl space-y-4 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2C2114] mb-3">
              Account Preferences
            </h2>
            <div>
              <label className="block text-xs font-semibold text-[#49341F] mb-1">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="Aviral Shukla"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-white text-[#2C2114]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#49341F] mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="aviral@example.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-white text-[#2C2114]"
              />
            </div>
            <div className="pt-2">
              <button
                onClick={() => alert('Preferences updated successfully!')}
                className="px-5 py-2 rounded-xl bg-[#8F6E3B] text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Publish Modal triggered from Dashboard */}
      {publishTarget && (
        <PublishModal
          isOpen={!!publishTarget}
          onClose={() => setPublishTarget(null)}
          draftId={publishTarget.draftId}
          template={publishTarget.template}
          customFields={publishTarget.fields}
          customDesign={publishTarget.design}
          onPublished={() => {
            loadUserData();
          }}
        />
      )}
    </div>
  );
}
