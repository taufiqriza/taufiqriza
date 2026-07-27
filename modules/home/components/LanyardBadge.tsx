"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useReducedMotion } from "framer-motion";

import { METADATA } from "@/common/constants/metadata";
import useSiteConfig from "@/hooks/useSiteConfig";
import Image from "@/common/components/elements/Image";

const Lanyard3D = dynamic(() => import("./Lanyard3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[360px] w-full items-center justify-center">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
    </div>
  ),
});

export default function LanyardBadge() {
  const { data } = useSiteConfig();
  const reducedMotion = useReducedMotion();
  const profile = data?.profile;

  if (reducedMotion) {
    return (
      <div className="flex h-full min-h-[360px] items-center justify-center p-8">
        <div className="w-full max-w-[220px] rounded-3xl border border-primary/15 bg-white/90 p-5 shadow-[0_24px_60px_-30px_rgba(6,92,194,0.45)] dark:bg-neutral-950/90">
          <Image
            src={profile?.photo || METADATA.profile}
            alt={profile?.name || METADATA.creator}
            width={180}
            height={220}
            className="aspect-[4/5] w-full rounded-2xl object-cover"
            rounded="rounded-2xl"
          />
          <p className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
            {profile?.name || METADATA.creator}
          </p>
          <p className="text-xs text-primary">Software Engineer</p>
        </div>
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex h-full min-h-[360px] w-full items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      }
    >
      <Lanyard3D frontImage={data?.profile.photo || METADATA.profile} fill />
    </Suspense>
  );
}
