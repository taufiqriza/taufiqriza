import { isSupabaseConfigured } from "@/common/utils/supabase-admin";
import * as db from "./crud";
import { getStore, nextId } from "./memory-store";
import type { TableName } from "./crud";
import type { AdminStats } from "@/common/types/admin";

type AnyRow = Record<string, unknown>;

const MEMORY_TABLES = [
  "projects",
  "achievements",
  "careers",
  "education",
  "social_links",
  "skills",
  "menus",
  "contact_messages",
] as const;

function useDb() {
  return isSupabaseConfigured();
}

function memoryEnabled() {
  return !useDb() || process.env.ADMIN_MEMORY_STORE === "true";
}

export async function repoList(table: TableName) {
  if (useDb()) {
    return db.listRows(table);
  }

  if (!memoryEnabled()) throw new Error("Persistent storage is unavailable");

  if (table === "site_settings") {
    const settings = getStore().site_settings;
    return Object.entries(settings).map(([key, value]) => ({ key, value }));
  }

  const store = getStore();
  const rows = (store as AnyRow)[table] as AnyRow[];
  return [...(rows || [])].sort((a, b) => {
    if (table === "contact_messages") {
      return Number(b.id) - Number(a.id);
    }
    return Number(a.sort_order ?? a.id) - Number(b.sort_order ?? b.id);
  });
}

export async function repoGet(table: TableName, id: number | string) {
  if (useDb()) {
    return db.getRow(table, id);
  }

  if (!memoryEnabled()) throw new Error("Persistent storage is unavailable");

  if (table === "site_settings") {
    const value = getStore().site_settings[String(id)];
    return value === undefined ? null : { key: id, value };
  }

  const rows = (getStore() as AnyRow)[table] as AnyRow[];
  return rows?.find((r) => String(r.id) === String(id)) || null;
}

export async function repoCreate(table: TableName, payload: AnyRow) {
  if (useDb()) {
    return db.createRow(table, payload);
  }

  if (!memoryEnabled()) throw new Error("Persistent storage is unavailable");

  if (table === "site_settings") {
    const key = String(payload.key);
    getStore().site_settings[key] = payload.value;
    return { key, value: payload.value };
  }

  if (!MEMORY_TABLES.includes(table as (typeof MEMORY_TABLES)[number])) {
    throw new Error(`Unsupported table: ${table}`);
  }

  const id = nextId(table as keyof ReturnType<typeof getStore>["seq"]);
  const row = { ...payload, id };
  ((getStore() as AnyRow)[table] as AnyRow[]).push(row);
  return row;
}

export async function repoUpdate(
  table: TableName,
  id: number | string,
  payload: AnyRow,
) {
  if (useDb()) {
    return db.updateRow(table, id, payload);
  }

  if (!memoryEnabled()) throw new Error("Persistent storage is unavailable");

  if (table === "site_settings") {
    getStore().site_settings[String(id)] = payload.value ?? payload;
    return { key: id, value: getStore().site_settings[String(id)] };
  }

  const rows = (getStore() as AnyRow)[table] as AnyRow[];
  const idx = rows.findIndex((r) => String(r.id) === String(id));
  if (idx < 0) throw new Error("Not found");
  rows[idx] = { ...rows[idx], ...payload, id: rows[idx].id };
  return rows[idx];
}

export async function repoDelete(table: TableName, id: number | string) {
  if (useDb()) {
    return db.deleteRow(table, id);
  }

  if (!memoryEnabled()) throw new Error("Persistent storage is unavailable");

  if (table === "site_settings") {
    delete getStore().site_settings[String(id)];
    return true;
  }

  const rows = (getStore() as AnyRow)[table] as AnyRow[];
  const idx = rows.findIndex((r) => String(r.id) === String(id));
  if (idx >= 0) rows.splice(idx, 1);
  return true;
}

export async function repoStats(): Promise<AdminStats> {
  if (useDb()) {
    return db.getAdminStats();
  }

  if (!memoryEnabled()) throw new Error("Persistent storage is unavailable");

  const s = getStore();
  return {
    projects: s.projects.length,
    achievements: s.achievements.length,
    careers: s.careers.length,
    education: s.education.length,
    messages: s.contact_messages.length,
    unreadMessages: s.contact_messages.filter((m) => !m.is_read).length,
  };
}

export async function repoSettings() {
  if (useDb()) {
    return db.getAllSettings();
  }
  if (!memoryEnabled()) throw new Error("Persistent storage is unavailable");
  return { ...getStore().site_settings };
}

export async function repoUpsertSetting(key: string, value: unknown) {
  if (useDb()) {
    return db.upsertSettings(key, value);
  }
  if (!memoryEnabled()) throw new Error("Persistent storage is unavailable");
  getStore().site_settings[key] = value;
  return { key, value };
}

export async function repoUpload(bucket: string, path: string, file: File) {
  if (useDb()) {
    return db.uploadFile(
      bucket,
      path,
      file,
      file.type || "application/octet-stream",
    );
  }
  throw new Error("Supabase Storage is required for uploads");
}

export async function repoListStorage(bucket: string, prefix = "") {
  if (useDb()) {
    return db.listStorage(bucket, prefix);
  }
  throw new Error("Supabase Storage is required for media management");
}

export async function repoDeleteStorage(bucket: string, path: string) {
  if (useDb()) {
    return db.deleteStorageFile(bucket, path);
  }
  throw new Error("Supabase Storage is required for media management");
}
