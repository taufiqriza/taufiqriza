export type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  group: "main" | "content" | "system";
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: "◎", group: "main" },
  { href: "/admin/projects", label: "Projects", icon: "◈", group: "content" },
  {
    href: "/admin/achievements",
    label: "Achievements",
    icon: "★",
    group: "content",
  },
  { href: "/admin/careers", label: "Careers", icon: "▣", group: "content" },
  { href: "/admin/education", label: "Education", icon: "◫", group: "content" },
  { href: "/admin/skills", label: "Skills", icon: "⬡", group: "content" },
  { href: "/admin/social", label: "Social", icon: "◌", group: "content" },
  { href: "/admin/menus", label: "Menus", icon: "☰", group: "system" },
  { href: "/admin/messages", label: "Messages", icon: "✉", group: "system" },
  { href: "/admin/media", label: "Media", icon: "▣", group: "system" },
  { href: "/admin/settings", label: "Settings", icon: "⚙", group: "system" },
];
