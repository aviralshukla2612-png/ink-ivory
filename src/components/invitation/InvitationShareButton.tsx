'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { shareInvitationNative } from '@/lib/native/capacitor-bridge';

interface Props {
  title: string;
  names: string;
  slug: string;
}

export function InvitationShareButton({ title, names, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/invite/${slug}` : `https://youaremine-online.com/invite/${slug}`;
    const shareText = `You are cordially invited to celebrate ${names} ✨ Open the bespoke interactive invitation:`;

    const success = await shareInvitationNative({
      title: `${title} | ${names}`,
      text: shareText,
      url,
      dialogTitle: 'Share Invitation via WhatsApp, Instagram or Messages',
    });

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1C1814]/90 backdrop-blur-md border border-[#C69A50]/50 text-[#FAF7F2] text-xs font-semibold shadow-xl hover:bg-[#30231D] transition-all hover:scale-105 active:scale-95"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-[#C69A50]" />
            <span>Share Invitation</span>
          </>
        )}
      </button>
    </div>
  );
}
