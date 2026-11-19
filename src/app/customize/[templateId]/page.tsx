'use client';

import React, { useState, useRef } from 'react';
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
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { templatesData } from '@/data/templates';
import { EditableFields, DesignConfig } from '@/types';
import { CardPreview } from '@/components/cards/CardPreview';
import { useCart } from '@/context/CartContext';

export default function CustomizePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.templateId as string;

  const baseTemplate =
    templatesData.find((t) => t.id === templateId) || templatesData[0];

  const { addToCart } = useCart();

  // State for editable fields
  const [fields, setFields] = useState<EditableFields>({
    ...baseTemplate.defaultFields,
  });

  // State for design styling
  const [design, setDesign] = useState<DesignConfig>({
    ...baseTemplate.designConfig,
  });

  const [activeTab, setActiveTab] = useState<'text' | 'typography' | 'colors' | 'photo'>('text');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSavedToCart, setIsSavedToCart] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleFieldChange = (key: keyof EditableFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all customizations to default?')) {
      setFields({ ...baseTemplate.defaultFields });
      setDesign({ ...baseTemplate.designConfig });
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

  return (
    <div className="w-full min-h-screen bg-[#F4EFE6] flex flex-col">
      
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
              {baseTemplate.occasion} • Digital Invitation Web Page
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

          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-3 py-1.5 text-xs font-medium text-[#49341F] bg-white border border-[#DFCEAF] rounded-lg hover:bg-[#FAF7F2] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#8F6E3B]" />
            <span>Full Preview</span>
          </button>

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
            className="px-4 py-1.5 text-xs sm:text-[13px] font-semibold rounded-lg bg-[#8F6E3B] hover:bg-[#7D5F31] text-white shadow-gold flex items-center gap-1.5 transition-colors"
          >
            <span>Proceed to Purchase</span>
            <span className="font-serif">₹{baseTemplate.price}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT / CENTER: Interactive Canvas Viewport (Col 7) */}
        <div className="lg:col-span-7 bg-[#EDE6D8]/60 p-4 sm:p-8 flex flex-col items-center justify-between overflow-y-auto relative min-h-[500px]">
          
          {/* Zoom Controls floating pill */}
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#DFCEAF] shadow-sm mb-4">
            <button
              onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
              className="p-1 hover:text-[#A77B35] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-[#574330] w-10 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
              className="p-1 hover:text-[#A77B35] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-[1px] bg-[#DFCEAF]" />
            <button
              onClick={() => setZoomLevel(100)}
              className="text-[10px] font-medium text-[#8F6E3B] hover:underline"
            >
              Fit
            </button>
          </div>

          {/* Real-Time Scalable Card Canvas */}
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

          {/* Bottom status note */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-[#7A634E] flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#A77B35]" />
              <span>Real-time preview • High-resolution export unlocked upon purchase</span>
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Customization Controls (Col 5) */}
        <div className="lg:col-span-5 bg-white border-t lg:border-t-0 lg:border-l border-[#DFCEAF] flex flex-col h-full overflow-y-auto">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-[#EFE7D5] bg-[#FAF7F2] sticky top-0 z-10">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'text'
                  ? 'border-[#8F6E3B] text-[#8F6E3B] bg-white'
                  : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Page Text</span>
            </button>

            <button
              onClick={() => setActiveTab('typography')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
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
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'colors'
                  ? 'border-[#8F6E3B] text-[#8F6E3B] bg-white'
                  : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colors & Theme</span>
            </button>

            <button
              onClick={() => setActiveTab('photo')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'photo'
                  ? 'border-[#8F6E3B] text-[#8F6E3B] bg-white'
                  : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>
          </div>

          {/* Tab 1: Editable Fields Content */}
          {activeTab === 'text' && (
            <div className="p-6 space-y-4">
              <div className="text-xs text-[#7A634E] pb-2 border-b border-[#F2ECE0]">
                Edit the text fields below. All changes appear instantly on the live canvas.
              </div>

              {/* Eyebrow / Occasion Tag */}
              <div>
                <label className="block text-xs font-medium text-[#49341F] mb-1">
                  Eyebrow / Header Badge
                </label>
                <input
                  type="text"
                  value={fields.eyebrow || ''}
                  onChange={(e) => handleFieldChange('eyebrow', e.target.value)}
                  placeholder="e.g. TOGETHER WITH THEIR FAMILIES"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-medium text-[#49341F] mb-1">
                  Page Headline / Event Title
                </label>
                <input
                  type="text"
                  value={fields.headline || ''}
                  onChange={(e) => handleFieldChange('headline', e.target.value)}
                  placeholder="e.g. The Wedding Of / Happy Anniversary"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                />
              </div>

              {/* Names (Primary) */}
              <div>
                <label className="block text-xs font-semibold text-[#8F6E3B] mb-1">
                  Honoree Names (Primary Focus)
                </label>
                <input
                  type="text"
                  value={fields.names || ''}
                  onChange={(e) => handleFieldChange('names', e.target.value)}
                  placeholder="e.g. Riya & Arjun / Anya Sharma"
                  className="w-full px-3 py-2.5 text-sm font-serif font-medium rounded-lg border border-[#A77B35]/50 bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    Event Date
                  </label>
                  <input
                    type="text"
                    value={fields.date || ''}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    placeholder="e.g. Sunday, 20 Dec 2026"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    Event Time
                  </label>
                  <input
                    type="text"
                    value={fields.time || ''}
                    onChange={(e) => handleFieldChange('time', e.target.value)}
                    placeholder="e.g. At 5:00 In The Evening"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
              </div>

              {/* Venue & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={fields.venue || ''}
                    onChange={(e) => handleFieldChange('venue', e.target.value)}
                    placeholder="e.g. The Heritage Ballroom"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={fields.city || ''}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder="e.g. Udaipur, Rajasthan"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
              </div>

              {/* Personal Message / Quote */}
              <div>
                <label className="block text-xs font-medium text-[#49341F] mb-1">
                  Personal Invitation Message / Blessing
                </label>
                <textarea
                  rows={3}
                  value={fields.message || ''}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  placeholder="Write your custom heartwarming message..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                />
              </div>

              {/* RSVP & Host */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    RSVP Contact
                  </label>
                  <input
                    type="text"
                    value={fields.rsvp || ''}
                    onChange={(e) => handleFieldChange('rsvp', e.target.value)}
                    placeholder="e.g. RSVP: +91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#49341F] mb-1">
                    Host / Family Names
                  </label>
                  <input
                    type="text"
                    value={fields.host || ''}
                    onChange={(e) => handleFieldChange('host', e.target.value)}
                    placeholder="e.g. Kapoor & Sharma Families"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCEAF] bg-[#FCFAF6] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                  />
                </div>
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
                  Border & Frame Detailing
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
              className="py-3 px-6 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs sm:text-sm font-semibold shadow-gold flex items-center gap-2 transition-all"
            >
              <span>Instant Checkout</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>

        </div>

      </div>

      {/* Full Screen Watermarked Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DFCEAF] shadow-2xl relative">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 text-xs font-bold p-2 text-[#49341F] hover:text-[#A77B35]"
            >
              ✕ Close
            </button>

            <h3 className="font-serif text-lg font-medium text-[#2C2114] mb-4 text-center">
              Watermarked Customer Preview
            </h3>

            <div className="w-full max-w-xs mx-auto mb-6">
              <CardPreview
                template={baseTemplate}
                customization={fields}
                designConfig={design}
                showWatermark={true}
                className="rounded-xl shadow-lg"
              />
            </div>

            <p className="text-[11px] text-center text-[#7A634E] mb-5">
              The full 300 DPI high-resolution PNG & PDF without watermarks will be instantly available on your order success page and customer account immediately upon purchase.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#DFCEAF] text-xs font-semibold text-[#49341F]"
              >
                Keep Editing
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  handleAddToCartAndProceed();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#8F6E3B] text-white text-xs font-semibold shadow-gold"
              >
                Purchase & Download
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

