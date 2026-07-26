import { ABOUT } from "@/common/constants/about";
import { METADATA } from "@/common/constants/metadata";
import { createClient } from "@/common/utils/server";

export type SiteProfile = {
  name: string;
  username: string;
  email: string;
  location: string;
  photo: string;
};

export async function getSiteSettings(): Promise<{
  profile: SiteProfile;
  about: { en: string[]; id: string[] };
  seo: { description: string; keywords: string; siteName: string };
}> {
  const fallback = {
    profile: {
      name: METADATA.creator,
      username: "username",
      email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || "",
      location: "Indonesia",
      photo: METADATA.profile,
    },
    about: { en: ABOUT, id: ABOUT },
    seo: {
      description: METADATA.description,
      keywords: METADATA.keyword,
      siteName: METADATA.openGraph.siteName,
    },
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error || !data?.length) return fallback;

    const map: Record<string, unknown> = {};
    data.forEach((row: { key: string; value: unknown }) => {
      map[row.key] = row.value;
    });

    return {
      profile: { ...fallback.profile, ...(map.profile as object) },
      about: { ...fallback.about, ...(map.about as object) },
      seo: { ...fallback.seo, ...(map.seo as object) },
    };
  } catch {
    return fallback;
  }
}
