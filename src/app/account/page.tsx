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
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { CardPreview } from '@/components/cards/CardPreview';
import { templatesData } from '@/data/templates';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'purchased' | 'orders' | 'wishlist' | 'settings'>('purchased');
  const [orders, setOrders] = useState<any[]>([]);
  const [purchasedDesigns, setPurchasedDesigns] = useState<any[]>([]);
  const { wishlist } = useWishlist();

  useEffect(() => {
    // Load orders
    const savedOrders = JSON.parse(localStorage.getItem('cardly_orders') || '[]');
    setOrders(savedOrders);

    // Load purchased designs
    const savedDesigns = JSON.parse(localStorage.getItem('cardly_purchased_designs') || '[]');
    if (savedDesigns.length > 0) {
      setPurchasedDesigns(savedDesigns);
    } else {
      // Seed default purchased card if none exist so user can immediately see and test re-download
      setPurchasedDesigns([
        {
          template: templatesData[0],
          customization: templatesData[0].defaultFields,
          designConfig: templatesData[0].designConfig,
          orderId: 'ORD-CARDLY-DEFAULT',
          purchasedDate: new Date().toISOString(),
        },
      ]);
    }
  }, []);

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
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EDE2CF] text-[#8F6E3B]">
                  VIP Patron
                </span>
              </div>
              <p className="text-xs text-[#7A634E] mt-0.5">
                aviral@example.com • Member since 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-xl bg-[#F4EFE6] border border-[#DFCEAF]">
              <span className="text-base font-serif font-bold text-[#2C2114] block">
                {purchasedDesigns.length}
              </span>
              <span className="text-[10px] text-[#7A634E] uppercase tracking-wider">
                Event Web Pages
              </span>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-[#F4EFE6] border border-[#DFCEAF]">
              <span className="text-base font-serif font-bold text-[#2C2114] block">
                {wishlist.length}
              </span>
              <span className="text-[10px] text-[#7A634E] uppercase tracking-wider">
                Wishlist
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DFC8] mb-8 overflow-x-auto scrollbar-none">
          {[
            { id: 'purchased', label: 'My Web Pages', icon: <Download className="w-4 h-4" /> },
            { id: 'orders', label: 'Order History', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'wishlist', label: 'Wishlist & Saved', icon: <Heart className="w-4 h-4" /> },
            { id: 'settings', label: 'Profile & Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
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

        {/* Tab 1: My Purchased Cards */}
        {activeTab === 'purchased' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl font-medium text-[#2C2114]">
                  My Event Web Pages
                </h2>
                <p className="text-xs text-[#7A634E] mt-0.5">
                  Access, edit, and share your live custom event web pages anytime.
                </p>
              </div>
              <Link
                href="/templates"
                className="text-xs font-semibold text-[#8F6E3B] hover:underline"
              >
                + Create New Page
              </Link>
            </div>

            {purchasedDesigns.length === 0 ? (
              <div className="bg-[#FCFAF6] rounded-2xl p-10 text-center border border-[#DFCEAF]">
                <Download className="w-10 h-10 text-[#A77B35] mx-auto mb-3 opacity-60" />
                <h3 className="font-serif text-lg text-[#2C2114] mb-1">
                  No event web pages yet
                </h3>
                <p className="text-xs text-[#7A634E] mb-4">
                  Once you create an event web page, it stays active in your account.
                </p>
                <Link
                  href="/templates"
                  className="px-5 py-2 rounded-full bg-[#8F6E3B] text-white text-xs font-semibold"
                >
                  Browse Templates
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedDesigns.map((design, i) => (
                  <div
                    key={i}
                    className="bg-[#FCFAF6] rounded-2xl p-5 border border-[#DFCEAF] shadow-luxury flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full aspect-[4/5] mb-4 overflow-hidden rounded-xl bg-[#F3EDE1] p-3 flex items-center justify-center">
                        <div className="w-[85%]">
                          <CardPreview
                            template={design.template}
                            customization={design.customization}
                            designConfig={design.designConfig}
                            className="rounded-lg shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#8F6E3B] font-semibold mb-1">
                        <span>{design.template.occasion}</span>
                        <span className="text-[10px] text-[#2E6B3F] bg-[#E8F3EA] px-2 py-0.5 rounded-full">
                          Ready to Download
                        </span>
                      </div>

                      <h3 className="font-serif text-base font-medium text-[#2C2114] line-clamp-1">
                        {design.template.title}
                      </h3>
                      <p className="text-xs text-[#7A634E] mt-0.5">
                        For: <strong>{design.customization?.names || 'Custom Names'}</strong>
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#F2ECE0] flex items-center gap-2">
                      <Link
                        href={`/order-success/${design.orderId || 'ORD-CARDLY'}`}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Files</span>
                      </Link>

                      <Link
                        href={`/customize/${design.template.id}`}
                        className="py-2 px-3 rounded-lg border border-[#DFCEAF] hover:bg-white text-xs font-medium text-[#49341F]"
                        title="Edit design"
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

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-[#FCFAF6] rounded-2xl border border-[#DFCEAF] p-6 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2C2114] mb-4">
              Order History
            </h2>
            {orders.length === 0 ? (
              <p className="text-xs text-[#7A634E]">No orders placed yet.</p>
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
                        <span className="text-[#2E6B3F] font-semibold bg-[#E8F3EA] px-2 py-0.5 rounded-full text-[10px]">
                          {ord.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-[#574330] mt-1">
                        {ord.items?.length || 1} digital web page items • Total: ₹{ord.totalAmount}
                      </p>
                    </div>

                    <Link
                      href={`/order-success/${ord.id}`}
                      className="text-xs font-semibold text-[#8F6E3B] hover:underline flex items-center gap-1"
                    >
                      <span>View Receipt & Downloads</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
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
                    <div className="aspect-[4/5] bg-[#F3EDE1] rounded-xl p-3 mb-3 flex items-center justify-center">
                      <div className="w-[85%]">
                        <CardPreview template={tpl} className="rounded-md" />
                      </div>
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
                        Customize
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Settings */}
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
                className="px-5 py-2 rounded-xl bg-[#8F6E3B] text-white text-xs font-semibold shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

