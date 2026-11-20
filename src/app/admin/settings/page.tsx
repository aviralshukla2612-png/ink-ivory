'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  Sliders,
  DollarSign,
  Mail,
  Phone,
  HardDrive,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';

interface PlatformSettings {
  id: string;
  platformName: string;
  supportEmail: string;
  supportPhone?: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  maxAudioUploadBytes: number;
  maxImageUploadBytes: number;
  updatedAt: string;
}

export default function AdminSettingsPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('SETTINGS_MANAGE');

  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [platformName, setPlatformName] = useState('You Are Mine');
  const [supportEmail, setSupportEmail] = useState('concierge@youaremine.com');
  const [supportPhone, setSupportPhone] = useState('+91 (0) 11 4982 9200');
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowNewRegistrations, setAllowNewRegistrations] = useState(true);
  const [maxAudioMB, setMaxAudioMB] = useState(25);
  const [maxImageMB, setMaxImageMB] = useState(10);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<PlatformSettings>('/api/admin/settings');
      if (res.success && res.data) {
        setSettings(res.data);
        setPlatformName(res.data.platformName);
        setSupportEmail(res.data.supportEmail);
        setSupportPhone(res.data.supportPhone || '');
        setDefaultCurrency(res.data.defaultCurrency);
        setMaintenanceMode(res.data.maintenanceMode);
        setAllowNewRegistrations(res.data.allowNewRegistrations);
        setMaxAudioMB(Math.round(res.data.maxAudioUploadBytes / (1024 * 1024)));
        setMaxImageMB(Math.round(res.data.maxImageUploadBytes / (1024 * 1024)));
      } else {
        showToast('error', res.error?.message || 'Failed to load platform settings.');
      }
    } catch {
      showToast('error', 'Network error fetching settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    setSaving(true);
    try {
      const payload = {
        platformName,
        supportEmail,
        supportPhone,
        defaultCurrency,
        maintenanceMode,
        allowNewRegistrations,
        maxAudioUploadBytes: maxAudioMB * 1024 * 1024,
        maxImageUploadBytes: maxImageMB * 1024 * 1024,
      };

      const res = await apiRequest<PlatformSettings>('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        showToast('success', 'Platform settings saved successfully.');
        setSettings(res.data);
      } else {
        showToast('error', res.error?.message || 'Failed to update settings.');
      }
    } catch {
      showToast('error', 'Network error updating settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm border backdrop-blur-md transition-all ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200' : 'bg-rose-950/90 border-rose-800 text-rose-200'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl font-serif text-amber-100 flex items-center gap-3">
            <Settings className="w-6 h-6 text-amber-400" />
            Platform Configuration & Settings
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Global concierge branding, support hotline, upload boundaries, and maintenance controls.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-300 bg-stone-900 border border-stone-800 rounded-lg hover:border-amber-700/50 hover:text-amber-200 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Reload
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
          Loading platform configurations...
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Brand & Support Contacts */}
          <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-amber-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              Brand & Concierge Hotline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Platform Brand Name</label>
                <input
                  type="text"
                  required
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Default Billing Currency</label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                >
                  <option value="INR">INR — Indian Rupee (₹)</option>
                  <option value="USD">USD — US Dollar ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Support Concierge Email</label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Concierge VIP Hotline</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Upload File Limits */}
          <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-amber-200 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-400" />
              Media Upload Limits & Storage Security
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Max Audio Upload Limit (MB)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={maxAudioMB}
                  onChange={(e) => setMaxAudioMB(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                />
                <p className="text-[10px] text-stone-500 mt-1">MP3, WAV, AAC, M4A with magic-byte validation.</p>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Max Image Upload Limit (MB)</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={maxImageMB}
                  onChange={(e) => setMaxImageMB(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                />
                <p className="text-[10px] text-stone-500 mt-1">JPEG, PNG, WebP up to 10MB default.</p>
              </div>
            </div>
          </div>

          {/* Operational Toggles */}
          <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-amber-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Operational Toggles
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 bg-stone-950/70 border border-stone-800/80 rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium text-stone-200">System Maintenance Mode</div>
                  <div className="text-[11px] text-stone-500">Temporarily pauses public publishing while keeping admin operational.</div>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-stone-950/70 border border-stone-800/80 rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium text-stone-200">Allow New Customer Registrations</div>
                  <div className="text-[11px] text-stone-500">Enable guest token issuance and public draft creation.</div>
                </div>
                <input
                  type="checkbox"
                  checked={allowNewRegistrations}
                  onChange={(e) => setAllowNewRegistrations(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>
            </div>
          </div>

          {canManage && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow-md transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Platform Changes
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
