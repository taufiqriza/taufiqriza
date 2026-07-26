-- Portfolio admin schema — run in Supabase SQL editor

create extension if not exists "pgcrypto";

-- Projects (extend if table exists)
create table if not exists public.projects (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  description text not null default '',
  content text,
  link_demo text,
  link_github text,
  stacks text[] not null default '{}',
  is_show boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Achievements
create table if not exists public.achievements (
  id bigint generated always as identity primary key,
  name text not null,
  slug text unique,
  credential_id text,
  issuing_organization text not null default '',
  type text not null default 'Certificate',
  category text not null default 'Other',
  url_credential text,
  issue_date date not null default current_date,
  expiration_date date,
  is_show boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.careers (
  id bigint generated always as identity primary key,
  position text not null,
  company text not null,
  logo text,
  location text not null default '',
  location_type text not null default 'Onsite' check (location_type in ('Onsite','Remote','Hybrid')),
  type text not null default 'Full-time',
  start_date text not null,
  end_date text,
  industry text,
  link text,
  responsibilities text[] not null default '{}',
  lessons_learned text[] not null default '{}',
  impact text[] not null default '{}',
  is_show boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id bigint generated always as identity primary key,
  school text not null,
  major text not null default '',
  logo text,
  location text not null default '',
  degree text not null default '',
  gpa text,
  start_year int not null,
  end_year int not null,
  link text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id bigint generated always as identity primary key,
  name text not null unique,
  title text not null,
  description text,
  href text not null,
  icon_key text not null default 'link',
  is_show boolean not null default true,
  sort_order int not null default 0,
  style_json jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id bigint generated always as identity primary key,
  name text not null unique,
  icon_key text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menus (
  id bigint generated always as identity primary key,
  title text not null,
  href text not null unique,
  icon_key text,
  is_show boolean not null default true,
  is_external boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array['projects','achievements','careers','education','social_links','skills','menus','site_settings']
  loop
    execute format('drop trigger if exists trg_%s_updated on public.%I', t, t);
    execute format(
      'create trigger trg_%s_updated before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end $$;

-- RLS: public read for showable content, deny writes for anon
alter table public.projects enable row level security;
alter table public.achievements enable row level security;
alter table public.careers enable row level security;
alter table public.education enable row level security;
alter table public.social_links enable row level security;
alter table public.skills enable row level security;
alter table public.menus enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

-- Drop & recreate read policies (idempotent-ish)
do $$
begin
  -- projects
  drop policy if exists "public read projects" on public.projects;
  create policy "public read projects" on public.projects for select using (is_show = true);

  drop policy if exists "public read achievements" on public.achievements;
  create policy "public read achievements" on public.achievements for select using (coalesce(is_show, true) = true);

  drop policy if exists "public read careers" on public.careers;
  create policy "public read careers" on public.careers for select using (coalesce(is_show, true) = true);

  drop policy if exists "public read education" on public.education;
  create policy "public read education" on public.education for select using (true);

  drop policy if exists "public read social" on public.social_links;
  create policy "public read social" on public.social_links for select using (coalesce(is_show, true) = true);

  drop policy if exists "public read skills" on public.skills;
  create policy "public read skills" on public.skills for select using (is_active = true);

  drop policy if exists "public read menus" on public.menus;
  create policy "public read menus" on public.menus for select using (is_show = true);

  drop policy if exists "public read settings" on public.site_settings;
  create policy "public read settings" on public.site_settings for select using (true);

  drop policy if exists "public insert messages" on public.contact_messages;
  create policy "public insert messages" on public.contact_messages for insert with check (true);
end $$;

-- Storage buckets (run once; ignore errors if exist)
insert into storage.buckets (id, name, public)
values
  ('projects', 'projects', true),
  ('achievements', 'achievements', true),
  ('careers', 'careers', true),
  ('education', 'education', true),
  ('profile', 'profile', true),
  ('media', 'media', true)
on conflict (id) do nothing;

-- Seed site settings
insert into public.site_settings (key, value) values
  ('profile', '{"name":"Your Name","username":"username","email":"you@example.com","location":"Indonesia","photo":"/images/satria.jpg"}'::jsonb),
  ('about', '{"en":["Bio paragraph 1.","Bio paragraph 2."],"id":["Paragraf bio 1.","Paragraf bio 2."]}'::jsonb),
  ('seo', '{"description":"Personal website, portfolio","keywords":"portfolio, developer","siteName":"Portfolio"}'::jsonb)
on conflict (key) do nothing;

-- Seed default menus
insert into public.menus (title, href, icon_key, is_show, sort_order) values
  ('Home', '/', 'home', true, 0),
  ('About', '/about', 'about', true, 1),
  ('Contents', '/contents', 'contents', true, 2),
  ('Achievements', '/achievements', 'achievements', true, 3),
  ('Projects', '/projects', 'projects', true, 4),
  ('Dashboard', '/dashboard', 'dashboard', true, 5),
  ('Chat Room', '/chat', 'chat', true, 6),
  ('Contact', '/contact', 'contact', true, 7),
  ('Smart Talk', '/smart-talk', 'smart-talk', false, 8)
on conflict (href) do nothing;
