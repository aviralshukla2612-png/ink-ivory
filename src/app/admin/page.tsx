'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Eye,
  Search,
} from 'lucide-react';
import { templatesData } from '@/data/templates';
import { Template } from '@/types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'orders' | 'coupons'>('overview');
  const [templatesList, setTemplatesList] = useState<Template[]>(templatesData);
  const [showAddModal, setShowAddModal] = useState(false);

  // New template form state
  const [newTitle, setNewTitle] = useState('');
  const [newOccasion, setNewOccasion] = useState('Wedding');
  const [newPrice, setNewPrice] = useState(299);
  const [newDesc, setNewDesc] = useState('');

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newTpl: Template = {
      id: `tpl-admin-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      title: newTitle,
      occasion: newOccasion as any,
      description: newDesc || 'Handcrafted bespoke digital invitation web page.',
      price: Number(newPrice),
      isFree: Number(newPrice) === 0,
      isFeatured: true,
      rating: 5.0,
      reviewsCount: 1,
      previewImage: '/herobg.png',
      tags: [newOccasion, 'Luxury'],
      defaultFields: {
        eyebrow: 'CELEBRATING WITH JOY',
        headline: newTitle,
        names: 'Honoree Names',
        date: 'Sunday, 15 November 2026',
        message: 'A memorable celebration filled with love and laughter.',
      },
      designConfig: {
        themeColor: '#121E35',
        textColor: '#EDE2CF',
        accentColor: '#D7B875',
        fontFamily: 'serif',
        orientation: 'portrait',
        borderStyle: 'gold-floral',
      },
    };

    setTemplatesList([newTpl, ...templatesList]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    alert('Template successfully published to the live Ink & Ivory store!');
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplatesList(templatesList.filter((t) => t.id !== id));
    }
  };

  const orders = [
    {
      id: 'ORD-78921',
      customer: 'Aviral Shukla',
      email: 'aviral@example.com',
      card: 'The Royal Navy Wedding',
      amount: '₹349',
      date: 'Today, 2:15 PM',
      status: 'Paid & Downloaded',
    },
    {
      id: 'ORD-78894',
      customer: 'Pooja Verma',
      email: 'pooja@example.com',
      card: 'Golden Botanical Anniversary',
      amount: '₹299',
      date: 'Yesterday',
      status: 'Paid & Downloaded',
    },
    {
      id: 'ORD-78842',
      customer: 'Karan Mehra',
      email: 'karan@example.com',
      card: 'Enchanted Garden Engagement',
      amount: '₹249',
      date: '15 Nov 2026',
      status: 'Paid & Downloaded',
    },
    {
      id: 'ORD-78799',
      customer: 'Rhea Sengupta',
      email: 'rhea@example.com',
      card: 'Romantic Valentine Monogram',
      amount: '₹199',
      date: '14 Nov 2026',
      status: 'Paid & Downloaded',
    },
  ];

  return (
    <div className="w-full bg-[#F4EFE6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-script-luxury text-3xl text-[#2C2114]">Ink & Ivory</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE2CF] text-[#8F6E3B]">
                Merchant Admin
              </span>
            </div>
            <p className="text-xs text-[#7A634E] mt-1">
              Store Management, Template Publishing & Digital Order Analytics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-[#8F6E3B] hover:underline"
            >
              ← View Live Customer Store
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs font-semibold shadow-gold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Template</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DFCEAF] mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Store Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'templates', label: `Templates (${templatesList.length})`, icon: <Layers className="w-4 h-4" /> },
            { id: 'orders', label: 'Digital Orders & Downloads', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'coupons', label: 'Coupons & Promos', icon: <Tag className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-[#8F6E3B] text-[#8F6E3B] bg-[#FCFAF6]'
                  : 'border-transparent text-[#6B533E] hover:text-[#2C2114]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Digital Revenue', value: '₹1,42,850', change: '+18.4% this month', icon: <DollarSign className="w-5 h-5 text-[#2E6B3F]" /> },
                { title: 'Total Web Pages Created', value: '482', change: '+32 this week', icon: <ShoppingBag className="w-5 h-5 text-[#8F6E3B]" /> },
                { title: 'Registered Customers', value: '320', change: '96% repeat rate', icon: <Users className="w-5 h-5 text-[#A77B35]" /> },
                { title: 'Active Templates', value: String(templatesList.length), change: 'Across 8 occasions', icon: <Layers className="w-5 h-5 text-[#49341F]" /> },
              ].map((m) => (
                <div
                  key={m.title}
                  className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#7A634E] font-medium">{m.title}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#DFCEAF] flex items-center justify-center">
                      {m.icon}
                    </div>
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#2C2114] mb-1">
                    {m.value}
                  </div>
                  <span className="text-[11px] text-[#2E6B3F] font-medium">{m.change}</span>
                </div>
              ))}
            </div>

            {/* Recent Orders table preview */}
            <div className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-sm">
              <h3 className="font-serif text-base font-semibold text-[#2C2114] mb-4">
                Recent Digital Purchases
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#E8DFC8] text-[#8C6837] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5">Order ID</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Design Selected</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE0]">
                    {orders.map((o) => (
                      <tr key={o.id} className="text-[#49341F]">
                        <td className="py-3 font-mono font-medium text-[#2C2114]">{o.id}</td>
                        <td className="py-3">{o.customer} ({o.email})</td>
                        <td className="py-3 font-serif font-medium">{o.card}</td>
                        <td className="py-3 font-serif font-bold text-[#2C2114]">{o.amount}</td>
                        <td className="py-3 text-[#7A634E]">{o.date}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F3EA] text-[#2E6B3F]">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEMPLATE MANAGEMENT */}
        {activeTab === 'templates' && (
          <div className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg font-medium text-[#2C2114]">
                All Event Web Page Templates
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-[#8F6E3B] text-white text-xs font-semibold shadow-gold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Design</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E8DFC8] text-[#8C6837] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5">Title</th>
                    <th className="py-2.5">Occasion</th>
                    <th className="py-2.5">Price</th>
                    <th className="py-2.5">Rating</th>
                    <th className="py-2.5">Sales</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE0]">
                  {templatesList.map((t) => (
                    <tr key={t.id} className="text-[#49341F] hover:bg-[#FAF7F2]">
                      <td className="py-3 font-serif font-medium text-[#2C2114]">
                        {t.title}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#EDE2CF] text-[#8F6E3B] text-[10px] font-semibold">
                          {t.occasion}
                        </span>
                      </td>
                      <td className="py-3 font-serif font-bold text-[#2C2114]">
                        {t.isFree ? 'Free' : `₹${t.price}`}
                      </td>
                      <td className="py-3">★ {t.rating}</td>
                      <td className="py-3">{t.reviewsCount} downloads</td>
                      <td className="py-3 text-right space-x-2">
                        <Link
                          href={`/customize/${t.id}`}
                          className="px-2.5 py-1 rounded bg-[#EDE2CF] text-[#8F6E3B] hover:bg-[#8F6E3B] hover:text-white transition-colors"
                        >
                          Customize
                        </Link>
                        <button
                          onClick={() => handleDeleteTemplate(t.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Delete template"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-sm">
            <h3 className="font-serif text-lg font-medium text-[#2C2114] mb-4">
              Digital Order Logs & Downloads
            </h3>
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-4 rounded-xl border border-[#E8DFC8] bg-white flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-[#2C2114] text-xs">{o.id}</span>
                    <span className="text-[#8C7359] text-xs ml-2">• {o.date}</span>
                    <p className="text-xs text-[#49341F] font-serif mt-0.5">
                      {o.card} ({o.amount}) — Purchased by {o.customer} ({o.email})
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F3EA] text-[#2E6B3F]">
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-sm max-w-2xl space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#2C2114]">
              Active Discount Coupons
            </h3>
            {[
              { code: 'CARDLY10', discount: '10% OFF', description: 'Welcome offer for new subscribers' },
              { code: 'WEDDING20', discount: '20% OFF', description: 'Wedding & engagement invitations seasonal discount' },
              { code: 'FESTIVE15', discount: '15% OFF', description: 'Festive seasons promotion' },
            ].map((c) => (
              <div
                key={c.code}
                className="p-4 rounded-xl border border-[#DFCEAF] bg-white flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-sm text-[#8F6E3B] tracking-wider">
                    {c.code}
                  </span>
                  <span className="ml-2 text-xs font-semibold text-[#2E6B3F] bg-[#E8F3EA] px-2 py-0.5 rounded-full">
                    {c.discount}
                  </span>
                  <p className="text-xs text-[#7A634E] mt-0.5">{c.description}</p>
                </div>
                <span className="text-xs font-semibold text-[#2E6B3F]">Active</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Template Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#DFCEAF] shadow-2xl">
            <h3 className="font-serif text-xl font-medium text-[#2C2114] mb-4">
              Add New Template
            </h3>
            <form onSubmit={handleAddTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#49341F] mb-1">
                  Template Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Imperial Silk Wedding Suite"
                  className="w-full px-3 py-2 rounded-lg border border-[#DFCEAF] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#49341F] mb-1">
                  Occasion Category
                </label>
                <select
                  value={newOccasion}
                  onChange={(e) => setNewOccasion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DFCEAF] bg-white"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Valentine's Day">Valentine&apos;s Day</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Festivals">Festivals</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#49341F] mb-1">
                  Price in INR (0 for Free)
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DFCEAF] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#49341F] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief editorial description..."
                  className="w-full px-3 py-2 rounded-lg border border-[#DFCEAF] bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#DFCEAF] text-[#49341F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8F6E3B] text-white font-semibold"
                >
                  Publish Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

