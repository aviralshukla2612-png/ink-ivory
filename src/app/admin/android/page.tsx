'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Layers,
  Sparkles,
  AlertTriangle,
  Upload,
  Save,
  CheckCircle2,
  RefreshCw,
  Bell,
  Eye,
  Sliders,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import NextImage from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import { AndroidAppConfigRecord, PlatformAnalyticsRecord, AndroidBannerRecord } from '@/lib/android-store';

export default function AndroidManagementPage() {
  const { hasPermission } = useAdmin();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'banners' | 'versions' | 'featured' | 'announcements' | 'analytics' | 'release-notes'>('banners');

  const [config, setConfig] = useState<AndroidAppConfigRecord | null>(null);
  const [analytics, setAnalytics] = useState<PlatformAnalyticsRecord | null>(null);

  // New banner state
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    imageUrl: '/images/templates/royal-navy-wedding-card.jpg',
    targetUrl: '/customize/the-royal-navy-wedding',
    isActive: true,
    order: 1,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/android', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.data.config);
        setAnalytics(data.data.analytics);
      }
    } catch (e) {
      console.error('Failed to load Android config:', e);
      setErrorMsg('Failed to load Android configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveConfig = async (updatedConfig?: Partial<AndroidAppConfigRecord>) => {
    if (!config) return;
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = updatedConfig ? { ...config, ...updatedConfig } : config;

    try {
      const res = await fetch('/api/admin/android', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.data);
        setSuccessMsg('Android configuration successfully updated & published live!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error?.message || 'Failed to update config.');
      }
    } catch (e) {
      setErrorMsg('Network error while saving Android config.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBanner = (bannerId: string) => {
    if (!config) return;
    const updatedBanners = config.banners.map((b) =>
      b.id === bannerId ? { ...b, isActive: !b.isActive } : b
    );
    handleSaveConfig({ banners: updatedBanners });
  };

  const handleDeleteBanner = (bannerId: string) => {
    if (!config) return;
    const updatedBanners = config.banners.filter((b) => b.id !== bannerId);
    handleSaveConfig({ banners: updatedBanners });
  };

  const handleAddBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    const bId = 'bnr_' + Date.now().toString().slice(-6);
    const updatedBanners = [...config.banners, { ...newBanner, id: bId }];
    handleSaveConfig({ banners: updatedBanners });
    setShowAddBanner(false);
    setNewBanner({
      title: '',
      subtitle: '',
      imageUrl: '/images/templates/royal-navy-wedding-card.jpg',
      targetUrl: '/customize/the-royal-navy-wedding',
      isActive: true,
      order: config.banners.length + 1,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <RefreshCw className="w-8 h-8 text-[#C69A50] animate-spin mb-3" />
        <p className="text-sm font-serif text-[#30231D]">Loading YOU ARE MINE Android Operations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E9DFD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C69A50]/15 text-[#C69A50] uppercase tracking-wider">
              Centralized Mobile Ops
            </span>
            <span className="text-xs text-[#702E3D] font-medium">Google Play Store Edition</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#30231D]">Android Application Management</h1>
          <p className="text-sm text-[#702E3D]/80 mt-1">
            Control Android home banners, version requirements, force update prompts, announcements, and push delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData()}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#30231D] bg-white border border-[#E9DFD2] hover:bg-[#FAF7F2] transition flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={() => handleSaveConfig()}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#C69A50] hover:bg-[#b08742] transition flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Publishing...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E9DFD2] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#702E3D] font-medium mb-2">
            <span>Play Store Installs</span>
            <Download className="w-4 h-4 text-[#C69A50]" />
          </div>
          <div className="font-serif text-2xl font-semibold text-[#30231D]">
            {analytics?.androidInstalls.toLocaleString() || '3,150'}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +18.4% this week
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E9DFD2] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#702E3D] font-medium mb-2">
            <span>Active Mobile Devices</span>
            <Smartphone className="w-4 h-4 text-[#C69A50]" />
          </div>
          <div className="font-serif text-2xl font-semibold text-[#30231D]">
            {analytics?.activeAppDevices.toLocaleString() || '2,480'}
          </div>
          <div className="text-[11px] text-[#702E3D]/70 mt-1">Version {config?.latestVersion} standard</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E9DFD2] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#702E3D] font-medium mb-2">
            <span>Android Orders</span>
            <TrendingUp className="w-4 h-4 text-[#C69A50]" />
          </div>
          <div className="font-serif text-2xl font-semibold text-[#30231D]">
            {analytics?.androidOrders.toLocaleString() || '310'}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            ₹{((analytics?.androidRevenuePaise || 12369000) / 100).toLocaleString('en-IN')} revenue
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E9DFD2] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#702E3D] font-medium mb-2">
            <span>Force Update Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-lg font-semibold text-[#30231D]">
            {config?.forceUpdateRequired ? (
              <span className="text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Enforced
              </span>
            ) : (
              <span className="text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Optional
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#702E3D]/70 mt-1">Min v{config?.minSupportedVersion} required</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9DFD2] overflow-x-auto pb-px">
        {[
          { id: 'banners', label: 'App Home Banners', count: config?.banners.length },
          { id: 'versions', label: 'Version & Force Update' },
          { id: 'announcements', label: 'In-App Announcements' },
          { id: 'featured', label: 'Featured Collections' },
          { id: 'release-notes', label: 'Release Notes & Changelog' },
          { id: 'analytics', label: 'Platform Performance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-[#C69A50] text-[#30231D] bg-[#FAF7F2]/80'
                : 'border-transparent text-[#702E3D]/70 hover:text-[#30231D]'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#E9DFD2] text-[#30231D]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Banners */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#30231D]">Mobile Carousel Banners</h2>
              <p className="text-xs text-[#702E3D]/80">Manage the hero banners highlighted on the Android application home tab.</p>
            </div>
            <button
              onClick={() => setShowAddBanner(!showAddBanner)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#C69A50] text-white hover:bg-[#b08742] transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Banner
            </button>
          </div>

          {/* Add Banner Modal/Drawer */}
          {showAddBanner && (
            <form onSubmit={handleAddBannerSubmit} className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD2] space-y-4">
              <h3 className="font-serif text-sm font-semibold text-[#30231D]">Create New Android Banner</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Banner Title</label>
                  <input
                    type="text"
                    required
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    placeholder="e.g. Royal Navy Wedding"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D] focus:outline-none focus:ring-1 focus:ring-[#C69A50]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={newBanner.subtitle}
                    onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                    placeholder="e.g. Interactive Palace Entrance & Sitar Music"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D] focus:outline-none focus:ring-1 focus:ring-[#C69A50]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Target Deep Link / Route</label>
                  <input
                    type="text"
                    required
                    value={newBanner.targetUrl}
                    onChange={(e) => setNewBanner({ ...newBanner, targetUrl: e.target.value })}
                    placeholder="/customize/the-royal-navy-wedding"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D] focus:outline-none focus:ring-1 focus:ring-[#C69A50]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Image URL / Asset</label>
                  <input
                    type="text"
                    required
                    value={newBanner.imageUrl}
                    onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                    placeholder="/images/templates/royal-navy-wedding-card.jpg"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D] focus:outline-none focus:ring-1 focus:ring-[#C69A50]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBanner(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#702E3D] bg-white border border-[#E9DFD2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#C69A50] hover:bg-[#b08742]"
                >
                  Save Banner
                </button>
              </div>
            </form>
          )}

          {/* Banners List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config?.banners.map((banner) => (
              <div key={banner.id} className="rounded-2xl bg-white border border-[#E9DFD2] shadow-sm overflow-hidden flex flex-col">
                <div className="relative h-44 w-full bg-[#1A1612]">
                  <NextImage
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#C69A50] text-white">
                      Order #{banner.order}
                    </span>
                    <h4 className="text-white font-serif text-sm font-semibold mt-1 drop-shadow-sm">{banner.title}</h4>
                    {banner.subtitle && <p className="text-[11px] text-white/80 line-clamp-1">{banner.subtitle}</p>}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1 text-xs">
                    <div className="text-[11px] text-[#702E3D]/80">Deep link:</div>
                    <code className="text-[11px] text-[#30231D] bg-[#FAF7F2] px-2 py-1 rounded block truncate">
                      {banner.targetUrl}
                    </code>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E9DFD2]">
                    <button
                      type="button"
                      onClick={() => handleToggleBanner(banner.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        banner.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {banner.isActive ? 'Active on Android' : 'Hidden'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Versions & Force Update */}
      {activeTab === 'versions' && config && (
        <div className="p-6 rounded-2xl bg-white border border-[#E9DFD2] space-y-6">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#30231D]">App Version Governance</h2>
            <p className="text-xs text-[#702E3D]/80">
              Manage version requirements, force update modals, and Play Store redirection links.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#702E3D] uppercase mb-1.5">
                Minimum Supported Version (Enforced)
              </label>
              <input
                type="text"
                value={config.minSupportedVersion}
                onChange={(e) => setConfig({ ...config, minSupportedVersion: e.target.value })}
                placeholder="1.0.0"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
              <span className="text-[11px] text-[#702E3D]/70 mt-1 block">
                Any app device running below this version will be prompted to update.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#702E3D] uppercase mb-1.5">
                Latest Available App Version
              </label>
              <input
                type="text"
                value={config.latestVersion}
                onChange={(e) => setConfig({ ...config, latestVersion: e.target.value })}
                placeholder="1.0.1"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
              <span className="text-[11px] text-[#702E3D]/70 mt-1 block">
                The current production build released on Google Play Store.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#702E3D] uppercase mb-1.5">
                Google Play Store Listing URL
              </label>
              <input
                type="url"
                value={config.playStoreUrl}
                onChange={(e) => setConfig({ ...config, playStoreUrl: e.target.value })}
                placeholder="https://play.google.com/store/apps/details?id=com.youaremine.app"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>

            <div className="sm:col-span-2 p-4 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#30231D]">Strict Force Update Mode</h4>
                  <p className="text-[11px] text-[#702E3D]/80">
                    When enabled, users with older app versions cannot dismiss the update modal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, forceUpdateRequired: !config.forceUpdateRequired })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                    config.forceUpdateRequired ? 'bg-[#C69A50] justify-end' : 'bg-zinc-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">
                  Custom Force Update Notice
                </label>
                <textarea
                  rows={2}
                  value={config.forceUpdateMessage}
                  onChange={(e) => setConfig({ ...config, forceUpdateMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Announcements */}
      {activeTab === 'announcements' && config && (
        <div className="p-6 rounded-2xl bg-white border border-[#E9DFD2] space-y-6">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#30231D]">In-App Broadcast Announcement</h2>
            <p className="text-xs text-[#702E3D]/80">
              Display an elegant welcome banner or critical announcement at the top of the Android application.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E9DFD2] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#30231D]">Broadcast Active Status</h4>
              <p className="text-[11px] text-[#702E3D]/80">Toggle banner visibility for all Android devices.</p>
            </div>
            <button
              type="button"
              onClick={() => setConfig({ ...config, announcementActive: !config.announcementActive })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                config.announcementActive ? 'bg-emerald-600 justify-end' : 'bg-zinc-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#702E3D] uppercase mb-1">Announcement Title</label>
              <input
                type="text"
                value={config.announcementTitle || ''}
                onChange={(e) => setConfig({ ...config, announcementTitle: e.target.value })}
                placeholder="Welcome to YOU ARE MINE on Android!"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#702E3D] uppercase mb-1">Announcement Body</label>
              <textarea
                rows={3}
                value={config.announcementBody || ''}
                onChange={(e) => setConfig({ ...config, announcementBody: e.target.value })}
                placeholder="Create, preview, and share regal digital invitations directly from your phone."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Featured Collections */}
      {activeTab === 'featured' && config && (
        <div className="p-6 rounded-2xl bg-white border border-[#E9DFD2] space-y-6">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#30231D]">Android Featured Collections</h2>
            <p className="text-xs text-[#702E3D]/80">
              Control which categories and templates appear with prominent golden badges in the Android app.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'tpl-wedding-navy-01', name: 'Aarav & Riya — The Royal Navy Wedding', category: 'Wedding' },
              { id: 'tpl-valentine-interactive-02', name: 'Aarav & Riya — Will You Be My Valentine?', category: "Valentine's Day" },
              { id: 'tpl-temple-wedding-05', name: 'Karthik & Meenakshi — Thirumanam Temple Wedding', category: 'Wedding' },
              { id: 'tpl-birthday-celebration-04', name: 'Kabir — Royal Heritage 1st Birthday', category: 'Birthday' },
              { id: 'tpl-date-planner-07', name: 'Riya & Aarav — Our Perfect Date Planner', category: "Valentine's Day" },
            ].map((item) => {
              const isFeatured = config.featuredTemplateIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#E9DFD2] flex items-center justify-between hover:bg-[#FAF7F2] transition"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-[#30231D]">{item.name}</h4>
                    <span className="text-[11px] text-[#702E3D]">{item.category}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = isFeatured
                        ? config.featuredTemplateIds.filter((id) => id !== item.id)
                        : [...config.featuredTemplateIds, item.id];
                      setConfig({ ...config, featuredTemplateIds: updated });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      isFeatured
                        ? 'bg-[#C69A50] text-white shadow-sm'
                        : 'bg-white border border-[#E9DFD2] text-[#702E3D]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isFeatured ? 'Featured on Mobile' : 'Feature Template'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Release Notes */}
      {activeTab === 'release-notes' && config && (
        <div className="p-6 rounded-2xl bg-white border border-[#E9DFD2] space-y-6">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#30231D]">Google Play Release Notes</h2>
            <p className="text-xs text-[#702E3D]/80">Release history synchronized with Google Play Store app updates.</p>
          </div>

          <div className="space-y-4">
            {config.releaseNotes.map((note, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-[#30231D]">Version {note.version}</span>
                  <span className="text-xs text-[#702E3D] font-medium">{note.releaseDate}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#30231D]">
                  {note.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C69A50] flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Analytics */}
      {activeTab === 'analytics' && analytics && (
        <div className="p-6 rounded-2xl bg-white border border-[#E9DFD2] space-y-6">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#30231D]">Cross-Platform Channel Comparison</h2>
            <p className="text-xs text-[#702E3D]/80">Real-time telemetry showing Website vs Android performance funnel.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD2] space-y-4">
              <h3 className="font-serif text-sm font-semibold text-[#30231D] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Website Channel
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E9DFD2]">
                  <span className="text-[#702E3D]">Unique Visitors</span>
                  <span className="font-semibold text-[#30231D]">{analytics.webVisits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E9DFD2]">
                  <span className="text-[#702E3D]">Drafts Created</span>
                  <span className="font-semibold text-[#30231D]">{analytics.webDrafts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E9DFD2]">
                  <span className="text-[#702E3D]">Paid Orders</span>
                  <span className="font-semibold text-[#30231D]">{analytics.webOrders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#702E3D]">Gross Revenue</span>
                  <span className="font-semibold text-emerald-700">₹{(analytics.webRevenuePaise / 100).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD2] space-y-4">
              <h3 className="font-serif text-sm font-semibold text-[#30231D] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Android App Channel
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E9DFD2]">
                  <span className="text-[#702E3D]">Total Installs</span>
                  <span className="font-semibold text-[#30231D]">{analytics.androidInstalls.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E9DFD2]">
                  <span className="text-[#702E3D]">Drafts Created</span>
                  <span className="font-semibold text-[#30231D]">{analytics.androidDrafts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E9DFD2]">
                  <span className="text-[#702E3D]">Paid Orders</span>
                  <span className="font-semibold text-[#30231D]">{analytics.androidOrders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#702E3D]">Gross Revenue</span>
                  <span className="font-semibold text-emerald-700">₹{(analytics.androidRevenuePaise / 100).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
