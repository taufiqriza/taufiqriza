export type ProjectRow = {
  id: number;
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  link_demo?: string | null;
  link_github?: string | null;
  stacks: string[];
  is_show: boolean;
  is_featured: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  image?: string;
};

export type AchievementRow = {
  id: number;
  name: string;
  slug?: string | null;
  credential_id?: string | null;
  issuing_organization: string;
  type: string;
  category: string;
  url_credential?: string | null;
  issue_date: string;
  expiration_date?: string | null;
  is_show?: boolean;
  sort_order?: number;
  image?: string;
};

export type CareerRow = {
  id: number;
  position: string;
  company: string;
  logo?: string | null;
  location: string;
  location_type: "Onsite" | "Remote" | "Hybrid";
  type: string;
  start_date: string;
  end_date?: string | null;
  industry?: string | null;
  link?: string | null;
  responsibilities?: string[];
  lessons_learned?: string[];
  impact?: string[];
  is_show?: boolean;
  sort_order?: number;
};

export type EducationRow = {
  id: number;
  school: string;
  major: string;
  logo?: string | null;
  location: string;
  degree: string;
  gpa?: string | null;
  start_year: number;
  end_year: number;
  link?: string | null;
  sort_order?: number;
};

export type SocialLinkRow = {
  id: number;
  name: string;
  title: string;
  description?: string | null;
  href: string;
  icon_key: string;
  is_show?: boolean;
  sort_order?: number;
  style_json?: Record<string, string> | null;
};

export type SkillRow = {
  id: number;
  name: string;
  icon_key?: string | null;
  is_active: boolean;
  sort_order?: number;
};

export type MenuRow = {
  id: number;
  title: string;
  href: string;
  icon_key?: string | null;
  is_show: boolean;
  is_external?: boolean;
  sort_order?: number;
};

export type ContactMessageRow = {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at?: string;
};

export type SiteSettingRow = {
  key: string;
  value: unknown;
  updated_at?: string;
};

export type AdminStats = {
  projects: number;
  achievements: number;
  careers: number;
  education: number;
  messages: number;
  unreadMessages: number;
};
