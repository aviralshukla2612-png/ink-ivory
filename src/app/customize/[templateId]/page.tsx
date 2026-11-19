'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Type,
  Palette,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  ShoppingBag,
  Download,
  Eye,
  Sliders,
  Smartphone,
  Music,
  ExternalLink,
} from 'lucide-react';
import { templatesData } from '@/data/templates';
import { EditableFields, DesignConfig } from '@/types';
import { CardPreview } from '@/components/cards/CardPreview';
import { useCart } from '@/context/CartContext';

export default function CustomizePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = (params?.templateId as string) || 'template-01';

  const baseTemplate =
    templatesData.find(
      (t) =>
        t.id === templateId ||
        t.slug === templateId ||
        templateId === 'template-01' ||
        t.liveDemoUrl?.includes(templateId)
    ) || templatesData[0];

  const isTemplate01 =
    templateId === 'template-01' ||
    templateId === 'tpl-wedding-navy-01' ||
    baseTemplate?.id === 'tpl-wedding-navy-01' ||
    baseTemplate?.liveDemoUrl?.includes('template-01');

  const { addToCart } = useCart();

  // State for editable fields (with sessionStorage restore)
  const [fields, setFields] = useState<EditableFields>(() => {
    let saved: Partial<EditableFields> = {};
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('ink_ivory_custom_wedding_data');
        if (stored) saved = JSON.parse(stored);
      } catch (e) {}
    }
    return {
      ...baseTemplate.defaultFields,
      ...saved,
    };
  });

  // State for design styling
  const [design, setDesign] = useState<DesignConfig>({
    ...baseTemplate.designConfig,
  });

  const [activeTab, setActiveTab] = useState<'text' | 'typography' | 'colors' | 'photo'>('text');
  const [previewMode, setPreviewMode] = useState<'live' | 'card'>(isTemplate01 ? 'live' : 'card');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSavedToCart, setIsSavedToCart] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFieldChange = (key: keyof EditableFields, value: string) => {
    setFields((prev) => {
      const updated = { ...prev, [key]: value };
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('ink_ivory_custom_wedding_data', JSON.stringify(updated));
        } catch (e) {}
      }
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'INK_IVORY_CUSTOM_UPDATE', payload: updated },
          '*'
        );
      } catch (e) {}
      return updated;
    });
  };

  const toggleAudioPreview = () => {
    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio('/audio/aaj-sajeya.mp3');
      audioPreviewRef.current.volume = 0.6;
      audioPreviewRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioPreviewRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPreviewRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all customizations to default?')) {
      setFields({ ...baseTemplate.defaultFields });
      setDesign({ ...baseTemplate.designConfig });
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('ink_ivory_custom_wedding_data');
      }
    }
  };

  const handleAddToCartAndProceed = () => {
    addToCart(baseTemplate, fields, design);
    setIsSavedToCart(true);
    setTimeout(() => {
      router.push('/checkout');
    }, 400);
  };

  const handleSaveToCartOnly = () => {
    addToCart(baseTemplate, fields, design);
    setIsSavedToCart(true);
    setTimeout(() => {
      setIsSavedToCart(false);
    }, 2500);
  };

  const colorPalettes = [
    { name: 'Royal Navy & Gold', theme: '#121E35', text: '#EDE2CF', accent: '#D7B875' },
    { name: 'Warm Ivory & Bronze', theme: '#FDFBF7', text: '#49341F', accent: '#A77B35' },
    { name: 'Deep Burgundy & Rose', theme: '#361219', text: '#FAF4EC', accent: '#E5B869' },
    { name: 'Dark Emerald & Gold', theme: '#0E241B', text: '#F8F4EC', accent: '#D7B875' },
    { name: 'Midnight Charcoal', theme: '#1A1817', text: '#FAF7F0', accent: '#D4AF37' },
    { name: 'Blush & Champagne', theme: '#FAF2EE', text: '#3E2A1E', accent: '#B88E4B' },
  ];

  const fullInvitationUrl = `/template-01?names=${encodeURIComponent(
    fields.names || ''
  )}&date=${encodeURIComponent(fields.date || '')}&venue=${encodeURIComponent(
    fields.venue || ''
  )}&city=${encodeURIComponent(fields.city || '')}&brideParents=${encodeURIComponent(
    fields.brideParents || ''
  )}&groomParents=${encodeURIComponent(fields.groomParents || '')}`;

  return (
    <div className="w-full min-h-screen bg-[#F4EFE6] flex flex-col select-none">
      {/* Top Studio Bar */}
      <div className="bg-[#FAF7F2] border-b border-[#DFCEAF] px-4 sm:px-6 py-3 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="p-1.5 rounded-lg hover:bg-[#EFE6D5] text-[#49341F] transition-colors"
            title="Back to Templates"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xs sm:text-sm font-semibold text-[#2C2114] flex items-center gap-2">
              <span>Personalizing:</span>
              <span className="font-serif italic text-[#8F6E3B]">{baseTemplate.title}</span>
            </h1>
            <p className="text-[10px] text-[#7A634E] hidden sm:block">
              {baseTemplate.occasion} • Digital Invitation Web Page &amp; Ceremony Suite
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-[#6B533E] hover:text-[#2C2114] flex items-center gap-1 rounded-lg hover:bg-[#EFE6D5] transition-colors"
            title="Reset to Template Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <a
            href={fullInvitationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-medium text-[#49341F] bg-white border border-[#DFCEAF] rounded-lg hover:bg-[#FAF7F2] flex items-center gap-1.5 shadow-sm transition-colors"
            title="Open Live Fullscreen Invitation"
          >
            <Eye className="w-3.5 h-3.5 text-[#8F6E3B]" />
            <span>Full Preview ↗</span>
          </a>

          <button
            onClick={handleSaveToCartOnly}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#8F6E3B] text-[#8F6E3B] hover:bg-[#FAF7F2] flex items-center gap-1.5 transition-colors"
          >
            {isSavedToCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2E6B3F]" />
                <span className="text-[#2E6B3F]">Saved in Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleAddToCartAndProceed}
            className="px-4 py-1.5 text-xs sm:text-[13px] font-semibold rounded-lg bg-[#8F6E3B] hover:bg-[#7D5F31] text-white shadow-gold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Proceed to Purchase</span>
            <span className="font-serif">₹{baseTemplate.price}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT / CENTER: Interactive Canvas Viewport (Col 7) */}
        <div className="lg:col-span-7 bg-[#0B1220] p-4 sm:p-6 flex flex-col items-center justify-between overflow-y-auto relative min-h-[550px]">
          {/* Dual Mode Switcher: Live Interactive Web Page vs Card Stationery */}
          <div className="flex items-center gap-1 bg-[#152136] p-1 rounded-full border border-[#2B3A59] shadow-lg mb-3 z-10">
            <button
              onClick={() => setPreviewMode('live')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewMode === 'live'
                  ? 'bg-[#E5A842] text-[#0E1524] shadow-md'
                  : 'text-[#94A3B8] hover:text-[#FAF5ED]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Live Website Preview</span>
            </button>
            <button
              onClick={() => setPreviewMode('card')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewMode === 'card'
                  ? 'bg-[#E5A842] text-[#0E1524] shadow-md'
                  : 'text-[#94A3B8] hover:text-[#FAF5ED]'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>🖼 Card Stationery View</span>
            </button>
          </div>

          {/* VIEW 1: LIVE INTERACTIVE SMARTPHONE MOCKUP */}
          {previewMode === 'live' ? (
            <div className="flex flex-col items-center my-auto">
              <div className="relative w-[320px] sm:w-[360px] h-[640px] sm:h-[680px] max-h-[70vh] rounded-[44px] border-[10px] border-[#181F2C] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(229,168,66,0.18)] bg-black overflow-hidden flex flex-col">
                {/* Dynamic Island */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-[#181F2C] rounded-full flex items-center justify-end px-3">
                  <div className="w-2 h-2 rounded-full bg-[#0E1524]" />
                </div>
                {/* Live Web Invitation Iframe */}
                <iframe
                  ref={iframeRef}
                  key={`${fields.names}-${fields.date}-${fields.venue}`}
                  src={`/template-01?mode=demo&view=phone&auto=false&names=${encodeURIComponent(
                    fields.names || ''
                  )}&date=${encodeURIComponent(fields.date || '')}&venue=${encodeURIComponent(
                    fields.venue || ''
                  )}&city=${encodeURIComponent(fields.city || '')}&brideParents=${encodeURIComponent(
                    fields.brideParents || ''
                  )}&groomParents=${encodeURIComponent(fields.groomParents || '')}`}
                  title="Live Personalized Mobile Invitation"
                  className="w-full h-full border-none bg-[#091321]"
                />
              </div>

              {/* External Fullscreen Link */}
              <a
                href={fullInvitationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 px-4 py-1.5 rounded-full bg-[#1A263E] hover:bg-[#253552] border border-[#D6B477]/50 text-[#E7CEA0] hover:text-[#FFFDF7] text-xs font-manrope font-semibold flex items-center gap-1.5 shadow-md transition-all"
              >
                <span>Open Fullscreen Invitation with 'Aaj Sajeya'</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            /* VIEW 2: SCALABLE CARD STATIONERY PREVIEW */
            <div
              ref={cardRef}
              className="my-auto transition-transform duration-200 origin-center flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <div className="w-[340px] sm:w-[420px] max-w-full">
                <CardPreview
                  template={baseTemplate}
                  customization={fields}
                  designConfig={design}
                  className="rounded-2xl shadow-luxury-lg border border-[#A77B35]/40"
                />
              </div>
            </div>
          )}

          {/* Bottom status note */}
          <div className="mt-3 text-center">
            <p className="text-[11px] text-[#A7B5CC] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E5A842]" />
              <span>Real-time instant preview • Your personalized wedding invitation is ready to publish</span>
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Customization Controls (Col 5) */}
        <div className="lg:col-span-5 bg-white border-t lg:border-t-0 lg:border-l border-[#DFCEAF] flex flex-col h-full overflow-y-auto">
          {/* Tabs Navigation */}
          <div className="flex border-b border-[#EFE7D5] bg-[#FAF7F2] sticky top-0 z-10">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'text'
                  ? 'border-[#8F6E3B] text-[#8F6E3B] bg-white'
                  : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Wedding Details</span>
            </button>

            <button
              onClick={() => setActiveTab('typography')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'typography'
                  ? 'border-[#8F6E3B] text-[#8F6E3B] bg-white'
                  : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Typography</span>
            </button>

            <button
              onClick={() => setActiveTab('colors')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'colors'
                  ? 'border-[#8F6E3B] text-[#8F6E3B] bg-white'
                  : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Palette</span>
            </button>

            <button
              onClick={() => setActiveTab('photo')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'photo'
                  ? 'border-[#8F6E3B] text-[#8F6E3B] bg-white'
                  : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>
          </div>

          {/* Tab 1: Wedding Details Form Content */}
          {activeTab === 'text' && (
            <div className="p-6 space-y-4">
              <div className="text-xs text-[#7A634E] pb-2 border-b border-[#F2ECE0]">
                Enter the couple's names, event dates, palace venue, and family details. All updates appear instantly on the live website preview!
              </div>

              {/* Couple / Honoree Names (Primary Focus) */}
              <div>
                <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                  Couple's Names (Primary Focus)
                </label>
                <input
                  type="text"
                  value={fields.names || ''}
                  onChange={(e) => handleFieldChange('names', e.target.value)}
                  placeholder="e.g. Aarav & Riya"
                  className="w-full px-3.5 py-2.5 text-sm font-serif font-medium rounded-lg border border-[#A77B35]/50 bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B35] shadow-xs"
                />
              </div>

              {/* Wedding Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    Wedding Date &amp; Day
                  </label>
                  <input
                    type="text"
                    value={fields.date || ''}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    placeholder="e.g. Friday, 18 December 2026"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    Wedding Time / Muhurat
                  </label>
                  <input
                    type="text"
                    value={fields.time || ''}
                    onChange={(e) => handleFieldChange('time', e.target.value)}
                    placeholder="e.g. 5:00 PM Onwards"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
              </div>

              {/* Venue & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    Royal Venue Name
                  </label>
                  <input
                    type="text"
                    value={fields.venue || ''}
                    onChange={(e) => handleFieldChange('venue', e.target.value)}
                    placeholder="e.g. The Heritage Palace &amp; Gardens"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    City &amp; State
                  </label>
                  <input
                    type="text"
                    value={fields.city || ''}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder="e.g. Jaipur, Rajasthan"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
              </div>

              {/* Family Lineages / Parents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    Bride's Parents
                  </label>
                  <input
                    type="text"
                    value={fields.brideParents || ''}
                    onChange={(e) => handleFieldChange('brideParents', e.target.value)}
                    placeholder="e.g. Mrs. Gayatri &amp; Dr. Harshvardhan Kapoor"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    Groom's Parents
                  </label>
                  <input
                    type="text"
                    value={fields.groomParents || ''}
                    onChange={(e) => handleFieldChange('groomParents', e.target.value)}
                    placeholder="e.g. Mrs. Sunita &amp; Mr. Vikramaditya Singhania"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
              </div>

              {/* Royal Wedding Soundtrack Accent Card */}
              <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#D6B477]/50 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#091321] text-[#D6B477] flex items-center justify-center font-bold text-xs shadow-sm">
                    🎵
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-[#1C120A]">
                      Aaj Sajeya — Goldie Sohel
                    </span>
                    <span className="text-[10px] text-[#7A634E]">
                      Saregama Music • Official Template 01 Soundscape
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleAudioPreview}
                  className="px-3 py-1.5 rounded-lg bg-[#D6B477] hover:bg-[#C5A46D] text-[#091321] text-xs font-semibold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <span>{isPlayingAudio ? '⏸ Pause' : '▶ Preview Song'}</span>
                </button>
              </div>

              {/* Personal Invitation Message / Blessing */}
              <div>
                <label className="block text-xs font-medium text-[#49341F] mb-1">
                  Personal Invitation Message / Blessing
                </label>
                <textarea
                  rows={3}
                  value={fields.message || ''}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  placeholder="Request the honour of your graceful presence and pious blessings to celebrate this eternal union."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Typography & Alignment */}
          {activeTab === 'typography' && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#49341F] mb-2">
                  Headings Typography Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'serif', name: 'Playfair Display', desc: 'Regal, Editorial Serif' },
                    { id: 'script', name: 'Alex Brush', desc: 'Graceful Calligraphy Script' },
                    { id: 'sans', name: 'Inter Modern', desc: 'Clean Minimalist Sans' },
                    { id: 'modern', name: 'Cormorant Luxury', desc: 'Classic Roman Lettering' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setDesign({ ...design, fontFamily: f.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        design.fontFamily === f.id
                          ? 'border-[#8F6E3B] bg-[#FAF7F0] ring-1 ring-[#8F6E3B]'
                          : 'border-[#E8DFC8] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="block text-xs font-semibold text-[#2C2114]">{f.name}</span>
                      <span className="text-[10px] text-[#8C7359]">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#49341F] mb-2">
                  Border &amp; Frame Detailing
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'gold-floral', name: 'Gold Foil Botanicals' },
                    { id: 'minimal-gold', name: 'Clean Gold Border' },
                    { id: 'modern-double', name: 'Double Modern Lines' },
                    { id: 'botanical', name: 'Classic Flourishes' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setDesign({ ...design, borderStyle: b.id as any })}
                      className={`px-3 py-2 text-xs rounded-lg border text-center transition-all ${
                        design.borderStyle === b.id
                          ? 'border-[#8F6E3B] bg-[#FAF7F0] font-semibold text-[#8F6E3B]'
                          : 'border-[#E8DFC8] bg-white text-[#574330]'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Colors & Palettes */}
          {activeTab === 'colors' && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#49341F] mb-3">
                  Curated Luxury Color Harmonizers
                </label>
                <div className="space-y-2.5">
                  {colorPalettes.map((p) => (
                    <button
                      key={p.name}
                      onClick={() =>
                        setDesign({
                          ...design,
                          themeColor: p.theme,
                          textColor: p.text,
                          accentColor: p.accent,
                        })
                      }
                      className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                        design.themeColor === p.theme
                          ? 'border-[#8F6E3B] bg-[#FAF7F2] ring-1 ring-[#8F6E3B]'
                          : 'border-[#E8DFC8] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border shadow-sm"
                          style={{ backgroundColor: p.theme }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border shadow-sm -ml-2"
                          style={{ backgroundColor: p.accent }}
                        />
                        <span className="text-xs font-medium text-[#2C2114] ml-1">
                          {p.name}
                        </span>
                      </div>
                      {design.themeColor === p.theme && (
                        <Check className="w-4 h-4 text-[#8F6E3B]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hex Color Override */}
              <div className="pt-4 border-t border-[#F2ECE0] space-y-3">
                <label className="block text-xs font-semibold text-[#49341F]">
                  Manual Accent Gold Color Picker
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={design.accentColor || '#A77B35'}
                    onChange={(e) => setDesign({ ...design, accentColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[#DFCEAF]"
                  />
                  <span className="text-xs font-mono text-[#574330] uppercase">
                    {design.accentColor || '#A77B35'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Photo Upload Option */}
          {activeTab === 'photo' && (
            <div className="p-6 space-y-4">
              <label className="block text-xs font-semibold text-[#49341F] mb-1">
                Upload Personal Couple / Celebrant Photo
              </label>
              <p className="text-xs text-[#7A634E] leading-relaxed">
                Add an optional personal portrait or memory to be woven into the invitation.
              </p>

              <div className="border-2 border-dashed border-[#DFCEAF] rounded-2xl p-6 text-center bg-[#FCFAF6] hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                <ImageIcon className="w-8 h-8 text-[#A77B35] mx-auto mb-2 opacity-70" />
                <p className="text-xs font-medium text-[#2C2114]">
                  Click to browse or drag and drop
                </p>
                <p className="text-[10px] text-[#8C7359] mt-1">
                  JPG, PNG or WEBP up to 10MB (High-Resolution Recommended)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFields((prev) => ({ ...prev, photoUrl: url }));
                      alert('Photo loaded for preview!');
                    }
                  }}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="mt-4 inline-block px-4 py-1.5 rounded-full bg-[#8F6E3B] text-white text-xs font-medium cursor-pointer"
                >
                  Choose Image
                </label>
              </div>

              {fields.photoUrl && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#E8F3EA] text-[#2E6B3F] text-xs">
                  <span>Photo selected and applied!</span>
                  <button
                    onClick={() => setFields((prev) => ({ ...prev, photoUrl: undefined }))}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sticky Purchase Bar at Bottom of Controls */}
          <div className="mt-auto p-4 sm:p-5 border-t border-[#DFCEAF] bg-[#FAF7F2] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#8C7359] uppercase tracking-wider block">
                Digital Edition Price
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-serif font-bold text-[#2C2114]">
                  {baseTemplate.isFree ? 'Free' : `₹${baseTemplate.price}`}
                </span>
                {!baseTemplate.isFree && (
                  <span className="text-[11px] text-[#99816B] line-through">
                    ₹{baseTemplate.price + 200}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCartAndProceed}
              className="py-3 px-6 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs sm:text-sm font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Instant Checkout</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
