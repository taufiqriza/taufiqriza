"use client";

import { FormEvent, useEffect, useState } from "react";

import { adminApi } from "@/modules/admin/lib/api";
import {
  Btn,
  ErrorBox,
  Field,
  Input,
  Loading,
  PageHeader,
  Panel,
  Textarea,
} from "@/modules/admin/components/ui";

type Profile = {
  name: string;
  username: string;
  email: string;
  location: string;
  photo: string;
};

type About = { en: string[]; id: string[] };
type Seo = { description: string; keywords: string; siteName: string };

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [profile, setProfile] = useState<Profile>({
    name: "",
    username: "",
    email: "",
    location: "",
    photo: "",
  });
  const [aboutEn, setAboutEn] = useState("");
  const [aboutId, setAboutId] = useState("");
  const [seo, setSeo] = useState<Seo>({
    description: "",
    keywords: "",
    siteName: "",
  });

  useEffect(() => {
    adminApi
      .settings<Record<string, unknown>>()
      .then((data) => {
        const p = (data.profile || {}) as Partial<Profile>;
        setProfile({
          name: p.name || "",
          username: p.username || "",
          email: p.email || "",
          location: p.location || "",
          photo: p.photo || "",
        });
        const a = (data.about || { en: [], id: [] }) as About;
        setAboutEn((a.en || []).join("\n\n"));
        setAboutId((a.id || []).join("\n\n"));
        const s = (data.seo || {}) as Partial<Seo>;
        setSeo({
          description: s.description || "",
          keywords: s.keywords || "",
          siteName: s.siteName || "",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOk("");
    try {
      const about: About = {
        en: aboutEn
          .split(/\n\n+/)
          .map((s) => s.trim())
          .filter(Boolean),
        id: aboutId
          .split(/\n\n+/)
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await Promise.all([
        adminApi.saveSetting("profile", profile),
        adminApi.saveSetting("about", about),
        adminApi.saveSetting("seo", seo),
      ]);
      setOk("Settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Site identity, bio, and SEO — no code edits required."
      />
      {error && (
        <div className="mb-4">
          <ErrorBox message={error} />
        </div>
      )}
      {ok && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {ok}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <Panel className="grid gap-4 p-5 sm:grid-cols-2">
          <p className="sm:col-span-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            Profile
          </p>
          <Field label="Name">
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </Field>
          <Field label="Username">
            <Input
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <Input
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </Field>
          <Field label="Photo path" className="sm:col-span-2">
            <Input
              value={profile.photo}
              onChange={(e) => setProfile({ ...profile, photo: e.target.value })}
              placeholder="/images/you.jpg"
            />
          </Field>
        </Panel>

        <Panel className="grid gap-4 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            About (EN)
          </p>
          <Field label="Paragraphs" hint="Separate paragraphs with a blank line">
            <Textarea rows={8} value={aboutEn} onChange={(e) => setAboutEn(e.target.value)} />
          </Field>
          <p className="pt-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            About (ID)
          </p>
          <Field label="Paragraf">
            <Textarea rows={8} value={aboutId} onChange={(e) => setAboutId(e.target.value)} />
          </Field>
        </Panel>

        <Panel className="grid gap-4 p-5 sm:grid-cols-2">
          <p className="sm:col-span-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            SEO
          </p>
          <Field label="Site name">
            <Input
              value={seo.siteName}
              onChange={(e) => setSeo({ ...seo, siteName: e.target.value })}
            />
          </Field>
          <Field label="Keywords">
            <Input
              value={seo.keywords}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={seo.description}
              onChange={(e) => setSeo({ ...seo, description: e.target.value })}
            />
          </Field>
        </Panel>

        <Btn type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Btn>
      </form>
    </div>
  );
}
