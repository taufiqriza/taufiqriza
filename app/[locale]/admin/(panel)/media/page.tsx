"use client";

import { useCallback, useEffect, useState } from "react";

import { adminApi } from "@/modules/admin/lib/api";
import {
  Btn,
  ErrorBox,
  Field,
  Loading,
  PageHeader,
  Panel,
  Select,
} from "@/modules/admin/components/ui";

const BUCKETS = ["projects", "achievements", "careers", "education", "profile", "media"];

type MediaItem = { name: string; url: string; created_at?: string };

export default function AdminMediaPage() {
  const [bucket, setBucket] = useState("media");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await adminApi.media(bucket));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [bucket]);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const path = file.name.replace(/\s+/g, "-").toLowerCase();
      await adminApi.upload(bucket, path, file);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    await adminApi.deleteMedia(bucket, name);
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Media"
        description="Browse and upload assets to Supabase Storage."
        actions={
          <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-white">
              {uploading ? "Uploading…" : "Upload"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => onUpload(e.target.files?.[0] || null)}
            />
          </label>
        }
      />

      <Panel className="mb-6 p-4">
        <Field label="Bucket">
          <Select value={bucket} onChange={(e) => setBucket(e.target.value)}>
            {BUCKETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </Field>
      </Panel>

      {error && (
        <div className="mb-4">
          <ErrorBox message={error} />
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Panel key={item.name} className="overflow-hidden">
              <div className="aspect-video bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs text-neutral-300">{item.name}</p>
                <div className="flex gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(item.name)}
                    className="text-[11px] text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Panel>
          ))}
          {!items.length && (
            <Panel className="col-span-full py-16 text-center text-sm text-neutral-600">
              No files in this bucket
            </Panel>
          )}
        </div>
      )}
    </div>
  );
}
