"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { METADATA } from "@/common/constants/metadata";

const Lanyard3D = dynamic(() => import("./Lanyard3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[380px] w-full max-w-[360px] items-center justify-center sm:h-[440px]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
    </div>
  ),
});

export default function LanyardBadge() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[380px] w-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      }
    >
      <Lanyard3D frontImage={METADATA.profile} />
    </Suspense>
  );
}
