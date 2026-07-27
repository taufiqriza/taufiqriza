import { ABOUT } from "@/common/constants/about";
import { MENU_ITEMS } from "@/common/constants/menu";
import { METADATA } from "@/common/constants/metadata";
import { SOCIAL_MEDIA } from "@/common/constants/socialMedia";
import { STACKS } from "@/common/constants/stacks";
import type { SiteConfig } from "@/common/types/site-config";
import { createClient } from "@/common/utils/server";

const fallback: SiteConfig = {
  profile: {
    name: METADATA.creator,
    username: "taufiqriza",
    email:
      process.env.NEXT_PUBLIC_AUTHOR_EMAIL || "muhamad.taufiqriza@gmail.com",
    location: "Indonesia",
    photo: METADATA.profile,
  },
  about: { en: ABOUT, id: ABOUT },
  seo: {
    description: METADATA.description,
    keywords: METADATA.keyword,
    siteName: METADATA.openGraph.siteName,
  },
  social: SOCIAL_MEDIA.filter((item) => item.isShow !== false).map(
    (item, index) => ({
      name: item.name,
      title: item.title,
      description: item.description,
      href: item.href,
      icon_key: item.name,
      is_show: true,
      sort_order: index,
    }),
  ),
  skills: Object.entries(STACKS)
    .filter(([, item]) => item.isActive)
    .map(([name], index) => ({
      name,
      icon_key: name,
      is_active: true,
      sort_order: index,
    })),
  menus: MENU_ITEMS.filter((item) => item.isShow).map((item, index) => ({
    title: item.title,
    href: item.href,
    icon_key: item.title.toLowerCase().replace(/\s+/g, "-"),
    is_show: true,
    is_external: item.isExternal,
    sort_order: index,
  })),
};

export async function getPublicSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = createClient();
    const [settingsResult, socialResult, skillsResult, menusResult] =
      await Promise.all([
        supabase.from("site_settings").select("key,value"),
        supabase
          .from("social_links")
          .select("*")
          .eq("is_show", true)
          .order("sort_order"),
        supabase
          .from("skills")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("menus")
          .select("*")
          .eq("is_show", true)
          .order("sort_order"),
      ]);

    const settings: Record<string, unknown> = {};
    if (!settingsResult.error) {
      (settingsResult.data || []).forEach((row) => {
        settings[row.key] = row.value;
      });
    }

    return {
      profile: {
        ...fallback.profile,
        ...((settings.profile as Partial<SiteConfig["profile"]>) || {}),
      },
      about: {
        ...fallback.about,
        ...((settings.about as Partial<SiteConfig["about"]>) || {}),
      },
      seo: {
        ...fallback.seo,
        ...((settings.seo as Partial<SiteConfig["seo"]>) || {}),
      },
      social:
        !socialResult.error && socialResult.data?.length
          ? socialResult.data
          : fallback.social,
      skills:
        !skillsResult.error && skillsResult.data?.length
          ? skillsResult.data
          : fallback.skills,
      menus:
        !menusResult.error && menusResult.data?.length
          ? menusResult.data
          : fallback.menus,
    };
  } catch {
    return fallback;
  }
}
