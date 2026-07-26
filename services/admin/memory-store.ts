/**
 * In-memory fallback when Supabase is not configured.
 * Allows full admin UI development without a live DB.
 */
import type {
  AchievementRow,
  CareerRow,
  ContactMessageRow,
  EducationRow,
  MenuRow,
  ProjectRow,
  SkillRow,
  SocialLinkRow,
} from "@/common/types/admin";

type Store = {
  projects: ProjectRow[];
  achievements: AchievementRow[];
  careers: CareerRow[];
  education: EducationRow[];
  social_links: SocialLinkRow[];
  skills: SkillRow[];
  menus: MenuRow[];
  contact_messages: ContactMessageRow[];
  site_settings: Record<string, unknown>;
  seq: Record<string, number>;
};

const g = globalThis as unknown as { __adminStore?: Store };

function seed(): Store {
  return {
    projects: [],
    achievements: [],
    careers: [],
    education: [],
    social_links: [
      {
        id: 1,
        name: "gmail",
        title: "Stay in Touch",
        description: "Reach out via email",
        href: "mailto:you@example.com",
        icon_key: "gmail",
        is_show: true,
        sort_order: 0,
      },
      {
        id: 2,
        name: "github",
        title: "Explore the Code",
        description: "Projects on GitHub",
        href: "https://github.com",
        icon_key: "github",
        is_show: true,
        sort_order: 1,
      },
    ],
    skills: [
      { id: 1, name: "TypeScript", is_active: true, sort_order: 0 },
      { id: 2, name: "Next.js", is_active: true, sort_order: 1 },
      { id: 3, name: "React", is_active: true, sort_order: 2 },
      { id: 4, name: "TailwindCSS", is_active: true, sort_order: 3 },
    ],
    menus: [
      { id: 1, title: "Home", href: "/", is_show: true, sort_order: 0 },
      { id: 2, title: "About", href: "/about", is_show: true, sort_order: 1 },
      { id: 3, title: "Projects", href: "/projects", is_show: true, sort_order: 2 },
      { id: 4, title: "Contact", href: "/contact", is_show: true, sort_order: 3 },
    ],
    contact_messages: [],
    site_settings: {
      profile: {
        name: "Your Name",
        username: "username",
        email: "you@example.com",
        location: "Indonesia",
        photo: "/images/taufiq.jpg",
      },
      about: {
        en: ["Bio paragraph one.", "Bio paragraph two."],
        id: ["Paragraf bio satu.", "Paragraf bio dua."],
      },
      seo: {
        description: "Personal website, portfolio",
        keywords: "portfolio, developer",
        siteName: "Portfolio",
      },
    },
    seq: {
      projects: 1,
      achievements: 1,
      careers: 1,
      education: 1,
      social_links: 3,
      skills: 5,
      menus: 5,
      contact_messages: 1,
    },
  };
}

export function getStore(): Store {
  if (!g.__adminStore) g.__adminStore = seed();
  return g.__adminStore;
}

export function nextId(table: keyof Store["seq"]): number {
  const store = getStore();
  const id = store.seq[table] || 1;
  store.seq[table] = id + 1;
  return id;
}
