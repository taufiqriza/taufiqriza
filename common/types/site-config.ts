export type PublicProfile = {
  name: string;
  username: string;
  email: string;
  location: string;
  photo: string;
};

export type PublicSocialLink = {
  id?: number;
  name: string;
  title: string;
  description?: string | null;
  href: string;
  icon_key?: string | null;
  is_show: boolean;
  sort_order: number;
};

export type PublicSkill = {
  id?: number;
  name: string;
  icon_key?: string | null;
  is_active: boolean;
  sort_order: number;
};

export type PublicMenu = {
  id?: number;
  title: string;
  href: string;
  icon_key?: string | null;
  is_show: boolean;
  is_external: boolean;
  sort_order: number;
};

export type SiteConfig = {
  profile: PublicProfile;
  about: { en: string[]; id: string[] };
  seo: { description: string; keywords: string; siteName: string };
  social: PublicSocialLink[];
  skills: PublicSkill[];
  menus: PublicMenu[];
};
