"use client";

import useSWR from "swr";

import type { SiteConfig } from "@/common/types/site-config";
import { fetcher } from "@/services/fetcher";

export default function useSiteConfig() {
  return useSWR<SiteConfig>("/api/site-config", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
}
