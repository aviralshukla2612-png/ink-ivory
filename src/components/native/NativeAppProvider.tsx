'use client';

import React, { useEffect, useState } from 'react';
import { initializeNativeApp, isNativePlatform } from '@/lib/native/capacitor-bridge';
import { WifiOff, AlertTriangle, ExternalLink, Download } from 'lucide-react';

export function NativeAppProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [forceUpdate, setForceUpdate] = useState<{
    required: boolean;
    message: string;
    playStoreUrl: string;
  } | null>(null);

  useEffect(() => {
    // 1. Initialize Capacitor native listeners
    initializeNativeApp({
      onNetworkChange: (connected) => {
        setIsOffline(!connected);
      },
    });

    // 2. Check for force update & announcement
    const checkAppConfig = async () => {
      try {
        const res = await fetch('/api/app/config');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.forceUpdateRequired) {
            setForceUpdate({
              required: true,
              message: json.data.forceUpdateMessage || 'A new update is available on Google Play. Please update to continue.',
              playStoreUrl: json.data.playStoreUrl || 'https://play.google.com/store/apps/details?id=com.youaremine.app',
            });
          }
        }
      } catch (e) {
        // Silently skip if offline
      }
    };

    checkAppConfig();
  }, []);

  return (
    <>
      {/* Offline Toast Notification */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-[#702E3D] text-white px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2 shadow-lg animate-fadeIn">
          <WifiOff className="w-4 h-4 text-[#C69A50]" />
          <span>You are currently offline. Your drafts remain saved locally.</span>
        </div>
      )}

      {/* Force Update Modal (Enforced when active) */}
      {forceUpdate && forceUpdate.required && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1C1814] border border-[#C69A50]/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#C69A50]/15 border border-[#C69A50] text-[#C69A50] flex items-center justify-center mx-auto">
              <Download className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#FAF8F5]">Update Required</h3>
            <p className="text-xs text-[#A69B8D] leading-relaxed">
              {forceUpdate.message}
            </p>
            <a
              href={forceUpdate.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#C69A50] hover:bg-[#b08742] text-white text-xs font-semibold shadow-lg transition"
            >
              <span>Update on Google Play Store</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
