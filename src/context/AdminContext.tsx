'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminRole, AdminPermission } from '@/lib/security/rbac';

export interface AdminActor {
  userId: string;
  role: AdminRole;
  email: string;
}

export interface AdminContextType {
  actor: AdminActor | null;
  permissions: AdminPermission[];
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (permission: AdminPermission) => boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const AdminContext = createContext<AdminContextType>({
  actor: null,
  permissions: [],
  isAuthenticated: false,
  loading: true,
  hasPermission: () => false,
  refreshAuth: async () => {},
  logout: async () => {},
  checkSession: async () => {},
});

export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [actor, setActor] = useState<AdminActor | null>(null);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const checkingRef = useRef<boolean>(false);
  const lastCheckTimeRef = useRef<number>(0);

  // Authenticate session via /api/admin/me
  const checkSession = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && checkingRef.current) return;
    if (!force && now - lastCheckTimeRef.current < 2000) return;

    checkingRef.current = true;
    lastCheckTimeRef.current = now;

    try {
      const res = await fetch('/api/admin/me', { credentials: 'include' });
      const data = await res.json();

      if (res.ok && data.success && data.actor) {
        setActor(data.actor);
        setPermissions(data.permissions || []);
        setIsAuthenticated(true);
      } else {
        setActor(null);
        setPermissions([]);
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error('Session check failed:', e);
      setActor(null);
      setIsAuthenticated(false);
    } finally {
      checkingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      // Continue client cleanup
    }
    setActor(null);
    setPermissions([]);
    setIsAuthenticated(false);
    router.push('/admin');
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    return permissions.includes(permission);
  };

  return (
    <AdminContext.Provider
      value={{
        actor,
        permissions,
        isAuthenticated,
        loading,
        hasPermission,
        refreshAuth: checkSession,
        logout: handleLogout,
        checkSession,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
