'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Plus,
  CheckCircle2,
  Clock,
  Smartphone,
  Globe,
  Users,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { NotificationCampaignRecord } from '@/lib/android-store';

export default function NotificationsAdminPage() {
  const [campaigns, setCampaigns] = useState<NotificationCampaignRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [sending, setSending] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    title: '',
    body: '',
    platform: 'ALL' as 'ALL' | 'WEB' | 'ANDROID',
    targetAudience: 'ALL_CUSTOMERS' as 'ALL_CUSTOMERS' | 'DRAFT_CREATORS' | 'PAID_CUSTOMERS',
    deepLink: 'youaremine://templates',
    status: 'SENT' as 'SENT' | 'SCHEDULED',
  });

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setCampaigns(data.data);
      }
    } catch (e) {
      console.error('Error fetching campaigns:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newCampaign),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowCompose(false);
        setNewCampaign({
          title: '',
          body: '',
          platform: 'ALL',
          targetAudience: 'ALL_CUSTOMERS',
          deepLink: 'youaremine://templates',
          status: 'SENT',
        });
        fetchCampaigns();
      }
    } catch (e) {
      console.error('Error dispatching notification:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E9DFD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C69A50]/15 text-[#C69A50] uppercase tracking-wider">
              Omnichannel Messaging
            </span>
            <span className="text-xs text-[#702E3D] font-medium">Push & Broadcast Studio</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#30231D]">Notifications & Campaigns</h1>
          <p className="text-sm text-[#702E3D]/80 mt-1">
            Compose and broadcast push notifications targeted to Website visitors or Android app devices.
          </p>
        </div>

        <button
          onClick={() => setShowCompose(!showCompose)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#C69A50] hover:bg-[#b08742] transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Compose Notification
        </button>
      </div>

      {/* Compose Drawer */}
      {showCompose && (
        <form onSubmit={handleSend} className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD2] space-y-4">
          <h3 className="font-serif text-sm font-semibold text-[#30231D]">Broadcast New Notification Campaign</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Campaign Title</label>
              <input
                type="text"
                required
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                placeholder="e.g. Royal Navy Wedding is Trending!"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Target Platform</label>
              <select
                value={newCampaign.platform}
                onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              >
                <option value="ALL">All Platforms (Web & Android)</option>
                <option value="ANDROID">Android App Only</option>
                <option value="WEB">Website Only</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Target Audience</label>
              <select
                value={newCampaign.targetAudience}
                onChange={(e) => setNewCampaign({ ...newCampaign, targetAudience: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              >
                <option value="ALL_CUSTOMERS">All Registered & Guest Customers</option>
                <option value="DRAFT_CREATORS">Customers with Unfinished Drafts</option>
                <option value="PAID_CUSTOMERS">Paid Published Customers</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Action Deep Link URL</label>
              <input
                type="text"
                value={newCampaign.deepLink}
                onChange={(e) => setNewCampaign({ ...newCampaign, deepLink: e.target.value })}
                placeholder="youaremine://template/the-royal-navy-wedding"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Notification Body</label>
              <textarea
                rows={2}
                required
                value={newCampaign.body}
                onChange={(e) => setNewCampaign({ ...newCampaign, body: e.target.value })}
                placeholder="Experience golden palace doors and sitar melodies for your grand celebration."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCompose(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#702E3D] bg-white border border-[#E9DFD2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#C69A50] hover:bg-[#b08742] flex items-center gap-2"
            >
              {sending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {sending ? 'Dispatching...' : 'Dispatch Now'}
            </button>
          </div>
        </form>
      )}

      {/* Campaigns History Table */}
      <div className="bg-white rounded-2xl border border-[#E9DFD2] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E9DFD2] bg-[#FAF7F2] text-[11px] font-semibold text-[#702E3D] uppercase tracking-wider">
              <th className="py-3 px-4">Campaign Title & Body</th>
              <th className="py-3 px-4">Target Channel</th>
              <th className="py-3 px-4">Audience</th>
              <th className="py-3 px-4">Delivered</th>
              <th className="py-3 px-4">Open Rate</th>
              <th className="py-3 px-4">Status & Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DFD2] text-xs">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-[#FAF7F2]/50 transition">
                <td className="py-3 px-4 max-w-sm">
                  <div className="font-semibold text-[#30231D]">{camp.title}</div>
                  <div className="text-[11px] text-[#702E3D]/80 line-clamp-1">{camp.body}</div>
                  {camp.deepLink && (
                    <code className="text-[10px] text-[#C69A50] font-mono">{camp.deepLink}</code>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E9DFD2] text-[#30231D] flex items-center gap-1 w-fit">
                    {camp.platform === 'ANDROID' ? <Smartphone className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {camp.platform}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#702E3D]">{camp.targetAudience.replace(/_/g, ' ')}</td>
                <td className="py-3 px-4 font-mono font-medium text-[#30231D]">
                  {camp.sentCount.toLocaleString()} devices
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-emerald-700">
                    {camp.sentCount > 0 ? ((camp.openCount / camp.sentCount) * 100).toFixed(1) : 0}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                  </div>
                  <div className="text-[10px] text-[#702E3D]/70 mt-0.5">
                    {new Date(camp.sentAt || camp.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
