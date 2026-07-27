"use client";

import { useCallback, useEffect, useState } from "react";

import type { SkillRow } from "@/common/types/admin";
import { STACKS } from "@/common/constants/stacks";
import { adminApi } from "@/modules/admin/lib/api";
import {
  Btn,
  ErrorBox,
  Field,
  Loading,
  PageHeader,
  Panel,
  Toggle,
} from "@/modules/admin/components/ui";

export default function AdminSkillsPage() {
  const [rows, setRows] = useState<SkillRow[]>([]);
  const [name, setName] = useState(Object.keys(STACKS)[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await adminApi.list<SkillRow>("skills"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addSkill() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await adminApi.create("skills", {
        name: name.trim(),
        icon_key: name.trim(),
        is_active: true,
        sort_order: rows.length,
      });
      setName(Object.keys(STACKS)[0]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(row: SkillRow) {
    await adminApi.update("skills", row.id, { is_active: !row.is_active });
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, is_active: !r.is_active } : r,
      ),
    );
  }

  async function remove(id: number) {
    if (!confirm("Delete skill?")) return;
    await adminApi.remove("skills", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Toggle skills shown on the homepage marquee."
      />
      {error && (
        <div className="mb-4">
          <ErrorBox message={error} />
        </div>
      )}

      <Panel className="mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <Field label="Skill registry" className="flex-1">
          <select
            className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-primary/40"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            {Object.keys(STACKS).map((stack) => (
              <option key={stack} value={stack}>
                {stack}
              </option>
            ))}
          </select>
        </Field>
        <Btn variant="primary" onClick={addSkill} disabled={saving}>
          Add
        </Btn>
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
                <p className="text-sm font-medium text-white">{row.name}</p>
                <p className="text-[11px] text-neutral-600">
                  {row.icon_key || row.name} · order #{row.sort_order ?? 0}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Toggle checked={row.is_active} onChange={() => toggle(row)} />
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
          {!rows.length && (
            <p className="px-4 py-10 text-center text-sm text-neutral-600">
              No skills yet
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}
