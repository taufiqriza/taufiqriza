import { createAdminClient } from "@/common/utils/supabase-admin";
import type { AdminStats } from "@/common/types/admin";

export type TableName =
  | "projects"
  | "achievements"
  | "careers"
  | "education"
  | "social_links"
  | "skills"
  | "menus"
  | "site_settings"
  | "contact_messages";

const STORAGE_BUCKETS: Partial<Record<TableName, string>> = {
  projects: "projects",
  achievements: "achievements",
  careers: "careers",
  education: "education",
};

function withImageUrl<T extends { slug?: string | null; logo?: string | null }>(
  table: TableName,
  rows: T[],
): (T & { image?: string })[] {
  const supabase = createAdminClient();
  const bucket = STORAGE_BUCKETS[table];
  if (!bucket) return rows;

  return rows.map((item) => {
    if (table === "careers" || table === "education") {
      if (!item.logo) return item;
      if (item.logo.startsWith("http") || item.logo.startsWith("/")) {
        return { ...item, image: item.logo };
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(item.logo);
      return { ...item, image: data.publicUrl, logo: data.publicUrl };
    }

    const key = item.slug ? `${item.slug}.webp` : null;
    if (!key) return item;
    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    return { ...item, image: data.publicUrl };
  });
}

export async function listRows(table: TableName, orderBy = "id") {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(orderBy, { ascending: table === "contact_messages" ? false : true });

  if (error) throw new Error(error.message);
  return withImageUrl(table, data || []);
}

export async function getRow(table: TableName, id: number | string) {
  const supabase = createAdminClient();
  const column = table === "site_settings" ? "key" : "id";
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(column, id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return withImageUrl(table, [data])[0];
}

export async function createRow(table: TableName, payload: Record<string, unknown>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from(table).insert([payload]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateRow(
  table: TableName,
  id: number | string,
  payload: Record<string, unknown>,
) {
  const supabase = createAdminClient();
  const column = table === "site_settings" ? "key" : "id";
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq(column, id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteRow(table: TableName, id: number | string) {
  const supabase = createAdminClient();
  const column = table === "site_settings" ? "key" : "id";
  const { error } = await supabase.from(table).delete().eq(column, id);
  if (error) throw new Error(error.message);
  return true;
}

export async function upsertSettings(key: string, value: unknown) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getAllSettings() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw new Error(error.message);
  const map: Record<string, unknown> = {};
  (data || []).forEach((row: { key: string; value: unknown }) => {
    map[row.key] = row.value;
  });
  return map;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createAdminClient();
  const tables = ["projects", "achievements", "careers", "education", "contact_messages"] as const;

  const counts = await Promise.all(
    tables.map(async (t) => {
      const { count, error } = await supabase
        .from(t)
        .select("*", { count: "exact", head: true });
      if (error) return 0;
      return count || 0;
    }),
  );

  const { count: unread } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  return {
    projects: counts[0],
    achievements: counts[1],
    careers: counts[2],
    education: counts[3],
    messages: counts[4],
    unreadMessages: unread || 0,
  };
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Buffer,
  contentType: string,
) {
  const supabase = createAdminClient();
  const body =
    file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

  const { error } = await supabase.storage.from(bucket).upload(path, body, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function listStorage(bucket: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(bucket).list("", {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw new Error(error.message);

  return (data || []).map((item) => {
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(item.name);
    return {
      name: item.name,
      id: item.id,
      updated_at: item.updated_at,
      created_at: item.created_at,
      metadata: item.metadata,
      url: urlData.publicUrl,
    };
  });
}

export async function deleteStorageFile(bucket: string, path: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
  return true;
}
