"use client";

import { useCallback, useEffect, useState } from "react";

import type { MenuRow } from "@/common/types/admin";
import { adminApi } from "@/modules/admin/lib/api";
import {
  Btn,
  ErrorBox,
  Field,
  Input,
  Loading,
  PageHeader,
  Panel,
  Toggle,
} from "@/modules/admin/components/ui";

export default function AdminMenusPage() {
  const [rows, setRows] = useState<MenuRow[]>([]);
  const [title, setTitle] = useState("");
  const [href, setHref] = useState("");
  const [iconKey, setIconKey] = useState("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await adminApi.list<MenuRow>("menus"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add() {
    if (!title.trim() || !href.trim()) return;
    await adminApi.create("menus", {
      title: title.trim(),
      href: href.trim(),
      icon_key: iconKey,
      is_show: true,
      sort_order: rows.length,
    });
    setTitle("");
    setHref("");
    await load();
  }

  async function toggle(row: MenuRow) {
    await adminApi.update("menus", row.id, { is_show: !row.is_show });
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, is_show: !r.is_show } : r)),
    );
  }

  async function remove(id: number) {
    if (!confirm("Delete menu item?")) return;
    await adminApi.remove("menus", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <PageHeader title="Menus" description="Sidebar navigation visibility." />
      {error && (
        <div className="mb-4">
          <ErrorBox message={error} />
        </div>
      )}

      <Panel className="mb-6 grid gap-3 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Href">
          <Input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="/about"
          />
        </Field>
        <Field label="Icon">
          <select
            className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-primary/40"
            value={iconKey}
            onChange={(event) => setIconKey(event.target.value)}
          >
            {[
              "home",
              "about",
              "projects",
              "dashboard",
              "contact",
              "contents",
              "achievements",
              "chat",
              "smart-talk",
            ].map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-end">
          <Btn variant="primary" onClick={add}>
            Add
          </Btn>
        </div>
      </Panel>

      {loading ? (
        <Loading />
      ) : (
        <Panel className="divide-y divide-white/[0.04]">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-white">{row.title}</p>
                <p className="text-xs text-neutral-500">
                  {row.href} · {row.icon_key || "home"} · order #
                  {row.sort_order ?? 0}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Toggle
                  checked={row.is_show}
                  onChange={() => toggle(row)}
                  label="Show"
                />
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  className="text-xs text-red-400/80 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}
