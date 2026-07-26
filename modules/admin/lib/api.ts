"use client";

export class AdminApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AdminApiError(
      (data as { message?: string }).message || res.statusText,
      res.status,
    );
  }
  return data as T;
}

export const adminApi = {
  list: <T>(resource: string) =>
    fetch(`/api/admin/${resource}`).then((r) => parse<T[]>(r)),

  get: <T>(resource: string, id: string | number) =>
    fetch(`/api/admin/${resource}/${id}`).then((r) => parse<T>(r)),

  create: <T>(resource: string, body: unknown) =>
    fetch(`/api/admin/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => parse<T>(r)),

  update: <T>(resource: string, id: string | number, body: unknown) =>
    fetch(`/api/admin/${resource}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => parse<T>(r)),

  remove: (resource: string, id: string | number) =>
    fetch(`/api/admin/${resource}/${id}`, { method: "DELETE" }).then((r) =>
      parse<{ ok: boolean }>(r),
    ),

  stats: <T>() => fetch("/api/admin/stats").then((r) => parse<T>(r)),

  settings: <T>() => fetch("/api/admin/settings").then((r) => parse<T>(r)),

  saveSetting: <T>(key: string, value: unknown) =>
    fetch(`/api/admin/settings/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    }).then((r) => parse<T>(r)),

  upload: async (bucket: string, path: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("bucket", bucket);
    form.append("path", path);
    return fetch("/api/admin/upload", { method: "POST", body: form }).then((r) =>
      parse<{ url: string; path: string; bucket: string }>(r),
    );
  },

  media: (bucket: string) =>
    fetch(`/api/admin/media?bucket=${encodeURIComponent(bucket)}`).then((r) =>
      parse<
        {
          name: string;
          url: string;
          created_at?: string;
        }[]
      >(r),
    ),

  deleteMedia: (bucket: string, path: string) =>
    fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, path }),
    }).then((r) => parse<{ ok: boolean }>(r)),
};
