'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Type,
  Image as ImageIcon,
  LayoutGrid,
  Sparkles,
  Palette,
  Calendar,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  EyeOff,
  Lock,
  Bookmark,
  Download,
  RotateCcw,
  Minus,
  Plus,
  Maximize2,
  MapPin,
  Check,
  Upload,
} from 'lucide-react';

export const PersonalizeSection: React.FC = () => {
  // Active Sidebar Tool Tab
  const [activeTab, setActiveTab] = useState<'text' | 'images' | 'bg' | 'elements' | 'fonts' | 'colors'>('text');

  // Text Inputs
  const [names, setNames] = useState('Ananya & Vikram');
  const [date, setDate] = useState('18 December 2026');
  const [message, setMessage] = useState('A celebration of two souls, boundless devotion, and lifelong laughter.');
  const [venue, setVenue] = useState('THE HERITAGE PALACE & GARDENS');
  const [venueSub, setVenueSub] = useState('Jaipur, India • 6:00 PM Onwards');

  // Typography Options
  const [fontFamily, setFontFamily] = useState('Playfair Display');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');

  // Colors & Theme Options
  const [textColor, setTextColor] = useState('#D7B875');
  const [cardTheme, setCardTheme] = useState<'navy' | 'ivory' | 'burgundy' | 'emerald' | 'black'>('navy');

  // Elements Toggles
  const [showCornerFlorals, setShowCornerFlorals] = useState(true);
  const [showDivider, setShowDivider] = useState(true);
  const [showBorder, setShowBorder] = useState(true);
  const [customMonogram, setCustomMonogram] = useState(false);

  // Layer Visibility
  const [showNamesLayer, setShowNamesLayer] = useState(true);
  const [showDateLayer, setShowDateLayer] = useState(true);
  const [showMessageLayer, setShowMessageLayer] = useState(true);
  const [showVenueLayer, setShowVenueLayer] = useState(true);

  // Canvas Controls
  const [zoom, setZoom] = useState(100);
  const [savedToast, setSavedToast] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Color Swatches
  const colorSwatches = [
    { name: 'Gold', hex: '#D7B875' },
    { name: 'Soft Ivory', hex: '#EDE2CF' },
    { name: 'Rose Gold', hex: '#E2A99B' },
    { name: 'Deep Wine', hex: '#872738' },
    { name: 'Forest Green', hex: '#26543E' },
    { name: 'Pure White', hex: '#FFFFFF' },
  ];

  // Theme Definitions
  const themes = {
    navy: { bg: '#0E1A2D', text: '#EDE2CF', accent: '#D7B875', label: 'Royal Navy' },
    ivory: { bg: '#FDFBF7', text: '#3E2B1A', accent: '#A77B35', label: 'Warm Ivory' },
    burgundy: { bg: '#2D0E15', text: '#FCEFE8', accent: '#E8B972', label: 'Deep Burgundy' },
    emerald: { bg: '#0D231B', text: '#EDF7F2', accent: '#D7B875', label: 'Dark Emerald' },
    black: { bg: '#141416', text: '#F0ECE1', accent: '#D4AF37', label: 'Midnight Noir' },
  };

  const handleReset = () => {
    setNames('Ananya & Vikram');
    setDate('18 December 2026');
    setMessage('A celebration of two souls, boundless devotion, and lifelong laughter.');
    setVenue('THE HERITAGE PALACE & GARDENS');
    setVenueSub('Jaipur, India • 6:00 PM Onwards');
    setFontFamily('Playfair Display');
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setAlignment('center');
    setTextColor('#D7B875');
    setCardTheme('navy');
    setShowCornerFlorals(true);
    setShowDivider(true);
    setShowBorder(true);
    setCustomMonogram(false);
    setShowNamesLayer(true);
    setShowDateLayer(true);
    setShowMessageLayer(true);
    setShowVenueLayer(true);
    setZoom(100);
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <section id="create-card" className="relative w-full overflow-hidden bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#EDE2CF]">
      {/* Background artwork: bg2.png with orchids, eucalyptus, lily and gold ribbon */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/bg2.png"
          alt="Ink & Ivory Personalization Studio luxury background"
          fill
          sizes="100vw"
          className="object-cover object-center"
          quality={95}
          priority
        />
        {/* Soft top and bottom fade gradients to ensure smooth transitions */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FAF7F2] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-11">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-2.5">
            <div className="h-[1px] w-6 sm:w-10 bg-[#B88E4B]/50" />
            <div className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.22em] text-[#8C6837] uppercase">
              <span className="text-xs">۞</span>
              <span>Personalization Studio</span>
            </div>
            <div className="h-[1px] w-6 sm:w-10 bg-[#B88E4B]/50" />
          </div>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-serif font-medium text-[#24170B] tracking-tight mb-2.5">
            Design a Web Page That&apos;s Uniquely <span className="italic font-normal text-[#A77B35]">Yours</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-[13.5px] text-[#695034] font-normal max-w-xl mx-auto leading-relaxed">
            Add your details, customize the style and create a beautiful web page in just a few simple steps.
          </p>
        </div>

        {/* Large Studio Workspace Card */}
        <div className="bg-white/95 rounded-[28px] border border-[#E8DFC8] shadow-luxury-lg overflow-hidden max-w-6xl mx-auto p-4 sm:p-6 lg:p-7 backdrop-blur-xs">
          
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-stretch">
            
            {/* COLUMN A: Left Tool Sidebar */}
            <div className="flex lg:flex-col items-center justify-between lg:justify-start gap-1 sm:gap-2 pb-3 lg:pb-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-[#EFE7D5] flex-shrink-0">
              {[
                { id: 'text', label: 'Text', icon: Type },
                { id: 'images', label: 'Images', icon: ImageIcon },
                { id: 'bg', label: 'Background', icon: LayoutGrid },
                { id: 'elements', label: 'Elements', icon: Sparkles },
                { id: 'fonts', label: 'Fonts', icon: Type },
                { id: 'colors', label: 'Colors', icon: Palette },
              ].map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTab === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id as any)}
                    className={`flex flex-col items-center justify-center w-14 sm:w-16 py-2.5 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-[#EDE2CF] text-[#49341F] font-semibold shadow-2xs'
                        : 'text-[#7A634E] hover:bg-[#F8F4EC] hover:text-[#49341F]'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[10px] tracking-wide">{tool.label}</span>
                  </button>
                );
              })}
            </div>

            {/* COLUMN B: Dynamic Tool Control Panel */}
            <div className="w-full lg:w-[280px] xl:w-[300px] flex-shrink-0 flex flex-col justify-between space-y-4">
              
              {/* TAB 1: EDIT TEXT */}
              {activeTab === 'text' && (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE0] mb-3.5">
                    <h3 className="font-serif text-sm font-semibold text-[#2C2114]">
                      Edit Text
                    </h3>
                    <button
                      onClick={handleReset}
                      className="text-xs text-[#8C6837] hover:text-[#523A1D] flex items-center gap-1 transition-colors"
                      title="Reset Demo"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Names on Page */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-medium text-[#574330] mb-1">
                      Names on Page
                    </label>
                    <input
                      type="text"
                      value={names}
                      onChange={(e) => setNames(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCDB0] bg-[#FCFAF6] text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#A77B35] transition-all"
                    />
                  </div>

                  {/* Date */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-medium text-[#574330] mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 text-xs rounded-lg border border-[#DFCDB0] bg-[#FCFAF6] text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#A77B35] transition-all"
                      />
                      <Calendar className="w-3.5 h-3.5 text-[#8C6837] absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-medium text-[#574330] mb-1">
                      Message
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCDB0] bg-[#FCFAF6] text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#A77B35] transition-all resize-none"
                    />
                  </div>

                  {/* Font Style */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-medium text-[#574330] mb-1">
                      Font Style
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DFCDB0] bg-[#FCFAF6] text-[#2C2114] focus:outline-none focus:ring-1 focus:ring-[#A77B35] transition-all"
                    >
                      <option value="Playfair Display">Playfair Display (Editorial)</option>
                      <option value="Cormorant Garamond">Cormorant Garamond (Classic)</option>
                      <option value="Alex Brush">Alex Brush (Calligraphy)</option>
                      <option value="Inter">Inter (Modern Sans)</option>
                    </select>
                  </div>

                  {/* Formatting Bar */}
                  <div className="flex items-center gap-1.5 mb-3.5">
                    <div className="flex items-center border border-[#DFCDB0] rounded-lg bg-[#FCFAF6] p-0.5">
                      <button
                        onClick={() => setIsBold(!isBold)}
                        className={`p-1.5 rounded text-xs transition-colors ${
                          isBold ? 'bg-[#EDE2CF] text-[#49341F] font-bold' : 'text-[#695034] hover:bg-white'
                        }`}
                        title="Bold"
                      >
                        <Bold className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setIsItalic(!isItalic)}
                        className={`p-1.5 rounded text-xs transition-colors ${
                          isItalic ? 'bg-[#EDE2CF] text-[#49341F]' : 'text-[#695034] hover:bg-white'
                        }`}
                        title="Italic"
                      >
                        <Italic className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setIsUnderline(!isUnderline)}
                        className={`p-1.5 rounded text-xs transition-colors ${
                          isUnderline ? 'bg-[#EDE2CF] text-[#49341F]' : 'text-[#695034] hover:bg-white'
                        }`}
                        title="Underline"
                      >
                        <Underline className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center border border-[#DFCDB0] rounded-lg bg-[#FCFAF6] p-0.5">
                      <button
                        onClick={() => setAlignment('left')}
                        className={`p-1.5 rounded text-xs transition-colors ${
                          alignment === 'left' ? 'bg-[#EDE2CF] text-[#49341F]' : 'text-[#695034] hover:bg-white'
                        }`}
                        title="Align Left"
                      >
                        <AlignLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setAlignment('center')}
                        className={`p-1.5 rounded text-xs transition-colors ${
                          alignment === 'center' ? 'bg-[#EDE2CF] text-[#49341F]' : 'text-[#695034] hover:bg-white'
                        }`}
                        title="Align Center"
                      >
                        <AlignCenter className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setAlignment('right')}
                        className={`p-1.5 rounded text-xs transition-colors ${
                          alignment === 'right' ? 'bg-[#EDE2CF] text-[#49341F]' : 'text-[#695034] hover:bg-white'
                        }`}
                        title="Align Right"
                      >
                        <AlignRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#574330] mb-1.5">
                      Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      {colorSwatches.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setTextColor(c.hex)}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            textColor === c.hex
                              ? 'ring-2 ring-[#8C6D37] ring-offset-1 scale-110 border-white'
                              : 'border-[#DFCDB0] hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: IMAGES / MONOGRAM */}
              {activeTab === 'images' && (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE0] mb-3.5">
                    <h3 className="font-serif text-sm font-semibold text-[#2C2114]">
                      Images &amp; Monograms
                    </h3>
                  </div>

                  <div className="p-4 rounded-xl border border-dashed border-[#DFCDB0] bg-[#FCFAF6] text-center mb-4 cursor-pointer hover:bg-[#F8F4EC] transition-colors">
                    <Upload className="w-6 h-6 text-[#8C6837] mx-auto mb-1.5" />
                    <span className="text-xs font-semibold text-[#49341F] block">Upload Photo</span>
                    <span className="text-[10px] text-[#7A634E] block mt-0.5">PNG, JPG up to 10MB</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#574330] mb-2">
                      Bespoke Monogram Crest
                    </label>
                    <button
                      onClick={() => setCustomMonogram(!customMonogram)}
                      className={`w-full p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                        customMonogram
                          ? 'border-[#8C6D37] bg-[#EDE2CF]/40 text-[#49341F] font-semibold'
                          : 'border-[#DFCDB0] bg-[#FCFAF6] text-[#695034]'
                      }`}
                    >
                      <span>Gold Foil Couple Monogram (A &amp; V)</span>
                      {customMonogram && <Check className="w-3.5 h-3.5 text-[#8C6D37]" />}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: BACKGROUND THEMES */}
              {activeTab === 'bg' && (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE0] mb-3.5">
                    <h3 className="font-serif text-sm font-semibold text-[#2C2114]">
                      Background Theme
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(themes).map(([key, t]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setCardTheme(key as any);
                          if (key === 'ivory') setTextColor('#3E2B1A');
                          else setTextColor(t.accent);
                        }}
                        className={`w-full p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                          cardTheme === key
                            ? 'border-[#8C6D37] bg-white shadow-xs'
                            : 'border-[#DFCDB0]/80 bg-[#FCFAF6] hover:bg-white'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-black/10 shadow-inner flex-shrink-0"
                          style={{ backgroundColor: t.bg }}
                        />
                        <div className="text-left flex-1">
                          <span className="text-xs font-medium text-[#2C2114] block leading-tight">
                            {t.label}
                          </span>
                        </div>
                        {cardTheme === key && <Check className="w-4 h-4 text-[#8C6D37]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ELEMENTS & ORNAMENTS */}
              {activeTab === 'elements' && (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE0] mb-3.5">
                    <h3 className="font-serif text-sm font-semibold text-[#2C2114]">
                      Gold Foil Elements
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#DFCDB0] bg-[#FCFAF6] cursor-pointer">
                      <span className="text-xs text-[#49341F] font-medium">Gold Corner Lilies</span>
                      <input
                        type="checkbox"
                        checked={showCornerFlorals}
                        onChange={(e) => setShowCornerFlorals(e.target.checked)}
                        className="rounded text-[#8C6D37] focus:ring-[#8C6D37] w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#DFCDB0] bg-[#FCFAF6] cursor-pointer">
                      <span className="text-xs text-[#49341F] font-medium">Diamond Divider</span>
                      <input
                        type="checkbox"
                        checked={showDivider}
                        onChange={(e) => setShowDivider(e.target.checked)}
                        className="rounded text-[#8C6D37] focus:ring-[#8C6D37] w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#DFCDB0] bg-[#FCFAF6] cursor-pointer">
                      <span className="text-xs text-[#49341F] font-medium">Double Gold Border</span>
                      <input
                        type="checkbox"
                        checked={showBorder}
                        onChange={(e) => setShowBorder(e.target.checked)}
                        className="rounded text-[#8C6D37] focus:ring-[#8C6D37] w-4 h-4"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 5: FONTS */}
              {activeTab === 'fonts' && (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE0] mb-3.5">
                    <h3 className="font-serif text-sm font-semibold text-[#2C2114]">
                      Typography
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Playfair Display', label: 'Playfair Display', desc: 'Editorial Serif' },
                      { name: 'Cormorant Garamond', label: 'Cormorant Garamond', desc: 'Classic Luxury' },
                      { name: 'Alex Brush', label: 'Alex Brush', desc: 'Romantic Script' },
                      { name: 'Inter', label: 'Inter', desc: 'Modern Sans' },
                    ].map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setFontFamily(f.name)}
                        className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                          fontFamily === f.name
                            ? 'border-[#8C6D37] bg-white shadow-xs'
                            : 'border-[#DFCDB0] bg-[#FCFAF6] hover:bg-white'
                        }`}
                      >
                        <span className="text-xs font-semibold text-[#2C2114] block" style={{ fontFamily: f.name }}>
                          {f.label}
                        </span>
                        <span className="text-[10px] text-[#7A634E] block mt-0.5">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: COLORS */}
              {activeTab === 'colors' && (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE0] mb-3.5">
                    <h3 className="font-serif text-sm font-semibold text-[#2C2114]">
                      Color Harmony
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[11px] font-medium text-[#574330]">
                      Foil &amp; Typography Tone
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorSwatches.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setTextColor(c.hex)}
                          className={`p-2 rounded-lg border flex items-center gap-2 text-xs transition-colors ${
                            textColor === c.hex
                              ? 'border-[#8C6D37] bg-white font-semibold text-[#2C2114]'
                              : 'border-[#DFCDB0] bg-[#FCFAF6] text-[#574330]'
                          }`}
                        >
                          <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                          <span className="text-[11px]">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* COLUMN C: Center Canvas Preview (CLEAN - ZERO DUPLICATE TEXT) */}
            <div className="flex-1 flex flex-col items-center justify-between py-2 px-2 sm:px-4">
              
              {/* Card Canvas Presentation (100% Pure Clean Vector & Dynamic CSS!) */}
              <div
                className="relative w-full max-w-[310px] aspect-[293/358] rounded-2xl overflow-hidden shadow-2xl border border-[#C5A059]/60 transition-all duration-300 select-none"
                style={{
                  transform: `scale(${zoom / 100})`,
                  backgroundColor: themes[cardTheme].bg,
                }}
              >
                {/* Double Gold Foil Border (Pure Vector CSS - Crisp & Sharp!) */}
                {showBorder && (
                  <>
                    <div className="absolute inset-2.5 rounded-xl border border-[#C5A059]/60 pointer-events-none z-10" />
                    <div className="absolute inset-3.5 rounded-lg border border-[#C5A059]/30 pointer-events-none z-10" />
                  </>
                )}

                {/* Top-Left Corner Gold Lily Ornament (Clean extracted flower only) */}
                {showCornerFlorals && cardTheme === 'navy' && (
                  <div className="absolute top-0 left-0 w-[62px] h-[125px] overflow-hidden pointer-events-none z-20">
                    <Image
                      src="/templates/corner-tl.png"
                      alt="Gold Lily Corner"
                      width={62}
                      height={125}
                      className="object-contain"
                      priority
                    />
                  </div>
                )}

                {/* Bottom-Right Corner Gold Lily Ornament (Clean extracted flower only) */}
                {showCornerFlorals && cardTheme === 'navy' && (
                  <div className="absolute bottom-0 right-0 w-[78px] h-[127px] overflow-hidden pointer-events-none z-20">
                    <Image
                      src="/templates/corner-br.png"
                      alt="Gold Lily Corner"
                      width={78}
                      height={127}
                      className="object-contain"
                      priority
                    />
                  </div>
                )}

                {/* Decorative corner accents for non-navy themes */}
                {showCornerFlorals && cardTheme !== 'navy' && (
                  <>
                    <div className="absolute top-3 left-3 text-[#D7B875] text-xs pointer-events-none z-20 opacity-80">✤</div>
                    <div className="absolute top-3 right-3 text-[#D7B875] text-xs pointer-events-none z-20 opacity-80">✤</div>
                    <div className="absolute bottom-3 left-3 text-[#D7B875] text-xs pointer-events-none z-20 opacity-80">✤</div>
                    <div className="absolute bottom-3 right-3 text-[#D7B875] text-xs pointer-events-none z-20 opacity-80">✤</div>
                  </>
                )}

                {/* Custom Monogram Badge (Optional image element) */}
                {customMonogram && (
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full border border-[#D7B875] bg-[#121E35]/90 flex items-center justify-center text-[10px] text-[#D7B875] font-serif font-bold shadow-md">
                    AV
                  </div>
                )}

                {/* Dynamic Overlaid Typography (Live, clean, single source of truth!) */}
                <div
                  className="absolute inset-0 flex flex-col justify-between py-6 px-6 text-center z-30"
                  style={{
                    fontFamily: fontFamily === 'Alex Brush' ? 'Alex Brush, cursive' : fontFamily,
                    textAlign: alignment,
                  }}
                >
                  {/* Top Eyebrow */}
                  <div className="pt-1">
                    <span className="text-[8px] sm:text-[8.5px] tracking-[0.25em] uppercase font-semibold block drop-shadow-xs" style={{ color: textColor }}>
                      Save The Date
                    </span>
                    <span
                      className="text-[9.5px] sm:text-[10px] italic font-serif block mt-0.5 opacity-90"
                      style={{ color: cardTheme === 'ivory' ? '#49341F' : '#EDE2CF' }}
                    >
                      The Wedding Celebration of
                    </span>
                  </div>

                  {/* Main Couple Names (Layer 1) */}
                  <div className="my-auto py-1">
                    {showNamesLayer && (
                      <h4
                        className={`text-[21px] sm:text-[23px] leading-tight drop-shadow-md transition-all ${
                          isBold ? 'font-bold' : 'font-normal'
                        } ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
                        style={{ color: textColor }}
                      >
                        {names || 'Ananya & Vikram'}
                      </h4>
                    )}

                    {/* Small Gold Diamond flourish */}
                    {showDivider && (
                      <div className="flex items-center justify-center gap-1.5 my-1.5 opacity-80" style={{ color: textColor }}>
                        <div className="h-[0.5px] w-4" style={{ backgroundColor: textColor }} />
                        <span className="text-[6px]">◆</span>
                        <div className="h-[0.5px] w-4" style={{ backgroundColor: textColor }} />
                      </div>
                    )}

                    {/* Date (Layer 2) */}
                    {showDateLayer && (
                      <span className="text-[9px] sm:text-[9.5px] tracking-[0.18em] uppercase font-serif font-medium block" style={{ color: textColor }}>
                        {date || '18 DECEMBER 2026'}
                      </span>
                    )}

                    {/* Personal message (Layer 3) */}
                    {showMessageLayer && (
                      <p
                        className="text-[8px] sm:text-[8.5px] italic font-serif leading-relaxed mt-1.5 px-3 opacity-90 line-clamp-2 max-w-[210px] mx-auto"
                        style={{ color: cardTheme === 'ivory' ? '#574330' : '#EDE2CF' }}
                      >
                        &ldquo;{message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Venue Details (Layer 4) */}
                  {showVenueLayer && (
                    <div className="pb-1 text-center">
                      <div className="flex items-center justify-center gap-1 text-[8px] font-serif" style={{ color: textColor }}>
                        <MapPin className="w-2.5 h-2.5" style={{ color: textColor }} />
                        <span>{venue}</span>
                      </div>
                      <span
                        className="text-[7px] font-sans block mt-0.5 opacity-80"
                        style={{ color: textColor }}
                      >
                        {venueSub}
                      </span>
                    </div>
                  )}

                </div>
              </div>

              {/* Bottom Canvas Controls: Zoom & Fullscreen */}
              <div className="flex items-center justify-center gap-3 pt-4 mt-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DFCDB0] text-xs text-[#574330] shadow-2xs">
                  <button
                    onClick={() => setZoom(Math.max(80, zoom - 10))}
                    className="p-0.5 hover:text-[#A77B35] transition-colors"
                    title="Zoom Out"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-semibold text-[11px] w-9 text-center">{zoom}%</span>
                  <button
                    onClick={() => setZoom(Math.min(130, zoom + 10))}
                    className="p-0.5 hover:text-[#A77B35] transition-colors"
                    title="Zoom In"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="p-1.5 rounded-full bg-white border border-[#DFCDB0] text-[#574330] hover:text-[#A77B35] shadow-2xs transition-colors"
                  title="Expand Fullscreen Preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* COLUMN D: Right Panel ("Card Layers" & Action CTAs) */}
            <div className="w-full lg:w-[220px] xl:w-[240px] flex-shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#EFE7D5] pt-4 lg:pt-0 lg:pl-5 space-y-4">
              
              <div>
                <h3 className="font-serif text-sm font-semibold text-[#2C2114] pb-2.5 mb-2.5 border-b border-[#F2ECE0]">
                  Page Layers
                </h3>

                {/* Layer Items with interactive Eye Visibility Toggles */}
                <div className="space-y-1.5">
                  
                  {/* Layer 1: Couple Names */}
                  <div
                    onClick={() => setShowNamesLayer(!showNamesLayer)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#FCFAF6] hover:bg-white border border-[#EFE7D5] text-xs text-[#49341F] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-serif font-bold text-[#8C6837] text-xs">T</span>
                      <span className="truncate text-[11.5px]">{names || 'Ananya & Vikram'}</span>
                    </div>
                    {showNamesLayer ? (
                      <Eye className="w-3 h-3 text-[#8C6837] flex-shrink-0" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#A89885] flex-shrink-0" />
                    )}
                  </div>

                  {/* Layer 2: Date */}
                  <div
                    onClick={() => setShowDateLayer(!showDateLayer)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#FCFAF6] hover:bg-white border border-[#EFE7D5] text-xs text-[#49341F] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-serif font-bold text-[#8C6837] text-xs">T</span>
                      <span className="truncate text-[11.5px]">{date || '18 December 2026'}</span>
                    </div>
                    {showDateLayer ? (
                      <Eye className="w-3 h-3 text-[#8C6837] flex-shrink-0" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#A89885] flex-shrink-0" />
                    )}
                  </div>

                  {/* Layer 3: Message */}
                  <div
                    onClick={() => setShowMessageLayer(!showMessageLayer)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#FCFAF6] hover:bg-white border border-[#EFE7D5] text-xs text-[#49341F] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-serif font-bold text-[#8C6837] text-xs">T</span>
                      <span className="text-[11.5px]">Message</span>
                    </div>
                    {showMessageLayer ? (
                      <Eye className="w-3 h-3 text-[#8C6837] flex-shrink-0" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#A89885] flex-shrink-0" />
                    )}
                  </div>

                  {/* Layer 4: Venue */}
                  <div
                    onClick={() => setShowVenueLayer(!showVenueLayer)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#FCFAF6] hover:bg-white border border-[#EFE7D5] text-xs text-[#49341F] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3 h-3 text-[#8C6837]" />
                      <span className="text-[11.5px]">Venue</span>
                    </div>
                    {showVenueLayer ? (
                      <Eye className="w-3 h-3 text-[#8C6837] flex-shrink-0" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#A89885] flex-shrink-0" />
                    )}
                  </div>

                  {/* Layer 5: Background (Locked) */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#FCFAF6] border border-[#EFE7D5] text-xs text-[#8A7969]">
                    <div className="flex items-center gap-2 truncate">
                      <ImageIcon className="w-3 h-3 text-[#8C6837]" />
                      <span className="text-[11.5px]">Background</span>
                    </div>
                    <Lock className="w-3 h-3 text-[#A89885] flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* 1. Preview Full Page */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#F5EEDF] hover:bg-[#ECDDBE] text-[#6E4F22] border border-[#DFCDB0] transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Full Web Page</span>
                </button>

                {/* 2. Save Design */}
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white hover:bg-[#FCFAF6] text-[#49341F] border border-[#DFCDB0] transition-colors shadow-2xs"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#8C6837]" />
                  <span>{savedToast ? 'Design Saved ✓' : 'Save Design'}</span>
                </button>

                {/* 3. Publish & Share CTA */}
                <Link
                  href="/customize/tpl-wedding-navy-01"
                  className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg bg-[#8C6D37] hover:bg-[#785C2D] text-white transition-all shadow-xs hover:shadow-gold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Publish &amp; Share Page</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Fullscreen Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFCDB0] flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-lg font-semibold text-[#2C2114] mb-3">
              Full Size Web Page Preview
            </h3>

            <div
              className="relative w-[300px] sm:w-[340px] aspect-[293/358] rounded-2xl overflow-hidden shadow-2xl border border-[#C5A059]/60 my-2"
              style={{ backgroundColor: themes[cardTheme].bg }}
            >
              {/* Double Gold Foil Border */}
              {showBorder && (
                <>
                  <div className="absolute inset-2.5 rounded-xl border border-[#C5A059]/60 pointer-events-none z-10" />
                  <div className="absolute inset-3.5 rounded-lg border border-[#C5A059]/30 pointer-events-none z-10" />
                </>
              )}

              {/* Corner Flowers */}
              {showCornerFlorals && cardTheme === 'navy' && (
                <>
                  <div className="absolute top-0 left-0 w-[68px] h-[135px] overflow-hidden pointer-events-none z-20">
                    <Image
                      src="/templates/corner-tl.png"
                      alt="Gold Lily Corner"
                      width={68}
                      height={135}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-[84px] h-[137px] overflow-hidden pointer-events-none z-20">
                    <Image
                      src="/templates/corner-br.png"
                      alt="Gold Lily Corner"
                      width={84}
                      height={137}
                      className="object-contain"
                    />
                  </div>
                </>
              )}

              <div
                className="absolute inset-0 flex flex-col justify-between py-6 px-6 text-center z-30"
                style={{
                  fontFamily: fontFamily === 'Alex Brush' ? 'Alex Brush, cursive' : fontFamily,
                  textAlign: alignment,
                }}
              >
                <div className="pt-2">
                  <span className="text-[8px] tracking-[0.25em] uppercase font-semibold block" style={{ color: textColor }}>
                    Save The Date
                  </span>
                  <span
                    className="text-[10px] italic font-serif block mt-0.5 opacity-90"
                    style={{ color: cardTheme === 'ivory' ? '#49341F' : '#EDE2CF' }}
                  >
                    The Wedding Celebration of
                  </span>
                </div>

                <div className="my-auto py-1">
                  {showNamesLayer && (
                    <h4
                      className={`text-[24px] leading-tight ${
                        isBold ? 'font-bold' : 'font-normal'
                      } ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
                      style={{ color: textColor }}
                    >
                      {names}
                    </h4>
                  )}

                  {showDivider && (
                    <div className="flex items-center justify-center gap-1.5 my-1 opacity-80" style={{ color: textColor }}>
                      <div className="h-[0.5px] w-4" style={{ backgroundColor: textColor }} />
                      <span className="text-[7px]">◆</span>
                      <div className="h-[0.5px] w-4" style={{ backgroundColor: textColor }} />
                    </div>
                  )}

                  {showDateLayer && (
                    <span className="text-[9.5px] tracking-[0.18em] uppercase font-serif font-medium block" style={{ color: textColor }}>
                      {date}
                    </span>
                  )}

                  {showMessageLayer && (
                    <p
                      className="text-[8.5px] italic font-serif leading-relaxed mt-1 px-3 opacity-90"
                      style={{ color: cardTheme === 'ivory' ? '#574330' : '#EDE2CF' }}
                    >
                      &ldquo;{message}&rdquo;
                    </p>
                  )}
                </div>

                {showVenueLayer && (
                  <div className="pb-1 text-center">
                    <div className="flex items-center justify-center gap-1 text-[8px] font-serif" style={{ color: textColor }}>
                      <MapPin className="w-2.5 h-2.5" style={{ color: textColor }} />
                      <span>{venue}</span>
                    </div>
                    <span
                      className="text-[7px] font-sans block mt-0.5 opacity-80"
                      style={{ color: textColor }}
                    >
                      {venueSub}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 w-full">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="flex-1 py-2 text-xs font-medium rounded-lg border border-[#DFCDB0] text-[#49341F] hover:bg-[#FAF7F2]"
              >
                Close Preview
              </button>
              <Link
                href="/customize/tpl-wedding-navy-01"
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#8C6D37] hover:bg-[#785C2D] text-white text-center shadow-xs"
              >
                Continue to Studio →
              </Link>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
