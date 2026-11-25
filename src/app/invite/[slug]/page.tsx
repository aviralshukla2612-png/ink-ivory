import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { store } from "@/lib/store";
import { InvitationShareButton } from "@/components/invitation/InvitationShareButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await store.getInvitationBySlug(slug);

  if (!result) {
    return { title: "Invitation Not Found — You Are Mine" };
  }

  const { publication, template } = result;
  const title = publication.snapshotData?.fields?.headline || template?.title || "Bespoke Invitation";
  const names = publication.snapshotData?.fields?.names || "You are cordially invited";

  return {
    title: `${title} | ${names} — You Are Mine`,
    description: publication.snapshotData?.fields?.message || "A bespoke digital invitation web page.",
    openGraph: {
      title: `${title} | ${names}`,
      description: publication.snapshotData?.fields?.message || "Open your exclusive digital invitation.",
      images: [template?.previewImage || "/herobg.png"],
    },
  };
}

export default async function PublicInvitationPage({ params }: Props) {
  const { slug } = await params;
  const result = await store.getInvitationBySlug(slug);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF2ED] px-4 text-center">
        <div className="max-w-md bg-[#FFF9F4] rounded-3xl p-8 border border-[#E7A5A4]/40 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#B51F3B]/10 text-[#B51F3B] flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl">
            ♡
          </div>
          <h2 className="font-serif text-2xl text-[#641A2A] font-bold mb-2">
            Invitation Not Published
          </h2>
          <p className="text-xs text-[#50363A]/80 leading-relaxed mb-6">
            This invitation link is either inactive, unpublished, or has expired. If you are the creator, please publish your draft from the editor.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 rounded-full bg-[#641A2A] text-white text-xs font-medium hover:bg-[#B51F3B] transition-colors"
          >
            Visit You Are Mine
          </a>
        </div>
      </div>
    );
  }

  if (result.isSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1F1916] px-4 text-center">
        <div className="max-w-md bg-[#2A231F] rounded-3xl p-8 border border-[#D4AF37]/30 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl">
            ✦
          </div>
          <h2 className="font-serif text-2xl text-[#FAF5EE] font-bold mb-2">
            Invitation Temporarily Suspended
          </h2>
          <p className="text-xs text-[#EAD8C8]/80 leading-relaxed mb-6">
            {result.suspensionReason || "This bespoke invitation website has been temporarily suspended by administrative review."}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 rounded-full bg-[#D4AF37] text-[#1F1916] text-xs font-bold hover:bg-[#E5B942] transition-colors"
          >
            Return to You Are Mine
          </a>
        </div>
      </div>
    );
  }

  const { publication, template, invitation } = result;
  const { snapshotData } = publication;
  const templateId = template?.id || invitation.templateId;

  // Build query string for destination template component
  const searchParams = new URLSearchParams();
  searchParams.set("published", "true");
  searchParams.set("slug", invitation.slug);

  // Map snapshot fields to query params
  if (snapshotData.fields) {
    Object.entries(snapshotData.fields).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        searchParams.set(k, String(v));
      }
    });
  }

  // Canonical Instagram-Style Audio Start Time & End Time Snapshot Propagation
  const designConfig = (snapshotData as any).designConfig || {};
  const audioStartTime = snapshotData.fields?.audioStartTime ?? designConfig.audioStartTime ?? 0;
  const audioEndTime =
    snapshotData.fields?.audioEndTime ??
    designConfig.audioEndTime ??
    (designConfig.audioClipDuration ? Number(audioStartTime) + Number(designConfig.audioClipDuration) : 0);
  const audioSource =
    snapshotData.customAudioUrl ||
    snapshotData.fields?.audioSource ||
    designConfig.audioSource;

  if (audioSource) {
    searchParams.set("audioSource", String(audioSource));
    searchParams.set("songUrl", String(audioSource));
  }
  if (audioStartTime !== undefined && audioStartTime !== null) {
    searchParams.set("audioStartTime", String(audioStartTime));
    searchParams.set("audioStart", String(audioStartTime));
  }
  if (audioEndTime) {
    searchParams.set("audioEndTime", String(audioEndTime));
  }

  // Resolve target route
  let targetUrl = "/template-01";
  if (templateId === "tpl-date-planner-07" || template?.liveDemoUrl === "/date-planner") {
    targetUrl = `/date-planner?${searchParams.toString()}`;
  } else if (templateId === "tpl-valentine-interactive-05" || template?.liveDemoUrl === "/valentine") {
    targetUrl = `/valentine?${searchParams.toString()}`;
  } else if (templateId === "tpl-birthday-botanical-04" || template?.liveDemoUrl === "/birthday") {
    targetUrl = `/birthday?${searchParams.toString()}`;
  } else if (
    templateId === "tpl-wedding-south-indian-05" ||
    template?.slug === "traditional-south-indian-wedding" ||
    template?.rendererId === "wedding-traditional-tamil" ||
    template?.liveDemoUrl === "/template-05" ||
    template?.liveDemoUrl === "/template-05.html"
  ) {
    targetUrl = `/template-05.html?${searchParams.toString()}`;
  } else if (
    templateId === "tpl-wedding-paper-palace-04" ||
    template?.slug === "paper-palace-wedding" ||
    template?.rendererId === "wedding-paper-palace" ||
    template?.liveDemoUrl === "/template-04" ||
    template?.liveDemoUrl === "/template-04.html"
  ) {
    targetUrl = `/template-04.html?${searchParams.toString()}`;
  } else if (
    templateId === "tpl-engagement-garden-03" ||
    template?.liveDemoUrl === "/template-03" ||
    template?.liveDemoUrl === "/template-03.html"
  ) {
    targetUrl = `/template-03.html?${searchParams.toString()}`;
  } else if (
    templateId === "tpl-anniversary-gold-02" ||
    template?.liveDemoUrl === "/template-02" ||
    template?.liveDemoUrl === "/template-02.html"
  ) {
    targetUrl = `/template-02.html?${searchParams.toString()}`;
  } else {
    targetUrl = `/template-01?${searchParams.toString()}`;
  }

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* Full-bleed responsive iframe presenting the published invitation */}
      <iframe
        src={targetUrl}
        title={template?.title || "Bespoke Invitation"}
        className="w-full h-full border-none"
        allow="autoplay; encrypted-media; clipboard-write"
      />

      {/* Native & Omnichannel Share Button */}
      <InvitationShareButton
        title={template?.title || "Bespoke Invitation"}
        names={snapshotData.fields?.names || "Our Celebration"}
        slug={invitation.slug}
      />

      {/* Floating You Are Mine Watermark Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF9F4]/90 backdrop-blur-md border border-[#E7A5A4]/40 text-[#641A2A] text-[10px] font-serif font-bold shadow-lg hover:bg-white transition-all"
        >
          <span>You Are Mine</span>
          <span className="text-[#B51F3B]">✦</span>
        </a>
      </div>
    </div>
  );
}
