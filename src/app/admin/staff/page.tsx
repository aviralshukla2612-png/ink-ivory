'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck,
  Shield,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';

interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FINANCE' | 'CONTENT_MANAGER' | 'SUPPORT';
  isActive?: boolean;
  createdAt: string;
}

export default function AdminStaffPage() {
  const { hasPermission, actor } = useAdmin();
  const canManage = hasPermission('STAFF_MANAGE');

  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New staff form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'FINANCE' | 'CONTENT_MANAGER' | 'SUPPORT'>('SUPPORT');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<StaffUser[]>('/api/admin/staff');
      if (res.success && res.data) {
        setStaff(res.data);
      } else {
        showToast('error', res.error?.message || 'Failed to load staff list.');
      }
    } catch {
      showToast('error', 'Network error fetching staff directory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setInviting(true);
    try {
      const res = await apiRequest<StaffUser>('/api/admin/staff', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), role }),
      });

      if (res.success && res.data) {
        showToast('success', `Staff member ${res.data.name} created.`);
        setShowInviteModal(false);
        setName('');
        setEmail('');
        fetchStaff();
      } else {
        showToast('error', res.error?.message || 'Failed to create staff member.');
      }
    } catch {
      showToast('error', 'Network error inviting staff member.');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: any) => {
    try {
      const res = await apiRequest<StaffUser>(`/api/admin/staff/${encodeURIComponent(userId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });

      if (res.success) {
        showToast('success', `Role successfully updated to ${newRole}.`);
        fetchStaff();
      } else {
        showToast('error', res.error?.message || 'Failed to update role.');
      }
    } catch {
      showToast('error', 'Network error updating staff role.');
    }
  };

  const handleDeleteStaff = async (userId: string, staffName: string) => {
    if (!confirm(`Are you sure you want to revoke access for "${staffName}"?`)) return;

    try {
      const res = await apiRequest(`/api/admin/staff/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });

      if (res.success) {
        showToast('success', `Staff member "${staffName}" removed.`);
        fetchStaff();
      } else {
        showToast('error', res.error?.message || 'Failed to remove staff member.');
      }
    } catch {
      showToast('error', 'Network error removing staff.');
    }
  };

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-600/40">Super Admin</span>;
      case 'ADMIN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/60 text-blue-300 border border-blue-800/40">Admin</span>;
      case 'FINANCE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">Finance Director</span>;
      case 'CONTENT_MANAGER':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-950/60 text-purple-300 border border-purple-800/40">Creative Editor</span>;
      case 'SUPPORT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700">Concierge Specialist</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-stone-800 text-stone-400">{r}</span>;
    }
  };

  return (
    <div className="space-y-6">
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
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            Staff & RBAC Permissions
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Manage authorized staff members, role privileges (Finance, Content, Support), and session access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStaff}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-300 bg-stone-900 border border-stone-800 rounded-lg hover:border-amber-700/50 hover:text-amber-200 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {canManage && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Invite Staff Member
            </button>
          )}
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-medium">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Privileges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50 text-stone-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading staff directory...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No staff members found.
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-stone-200 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-800/50 flex items-center justify-center text-amber-300 font-serif text-xs">
                        {s.name ? s.name[0] : 'S'}
                      </div>
                      {s.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-400">
                      {s.email}
                    </td>
                    <td className="py-3.5 px-4">
                      {canManage && s.role !== 'SUPER_ADMIN' ? (
                        <select
                          value={s.role}
                          onChange={(e) => handleRoleChange(s.id, e.target.value)}
                          className="px-2.5 py-1 text-xs bg-stone-950 border border-stone-800 rounded text-amber-200 focus:outline-none focus:border-amber-600"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="FINANCE">Finance</option>
                          <option value="CONTENT_MANAGER">Content Manager</option>
                          <option value="SUPPORT">Support</option>
                        </select>
                      ) : (
                        getRoleBadge(s.role)
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canManage && s.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDeleteStaff(s.id, s.name)}
                          className="p-1.5 rounded-md hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 transition-colors"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Staff Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="text-base font-serif text-amber-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Invite Staff Member
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-stone-400 hover:text-stone-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInviteStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Apte"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@inkandivory.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                >
                  <option value="SUPPORT">Support Concierge (Inquiries, Customers)</option>
                  <option value="CONTENT_MANAGER">Content Manager (Templates, Builder, Media)</option>
                  <option value="FINANCE">Finance Director (Orders, Payments, Refunds, Coupons)</option>
                  <option value="ADMIN">Full Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-1.5 text-stone-400 hover:text-stone-200 bg-stone-800/60 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex items-center gap-1.5 px-4 py-1.5 font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg disabled:opacity-50"
                >
                  {inviting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
