"use client";

import { useCallback, useEffect, useState } from "react";

import type { ContactMessageRow } from "@/common/types/admin";
import { adminApi } from "@/modules/admin/lib/api";
import { Badge, Btn, ErrorBox, Loading, PageHeader, Panel } from "@/modules/admin/components/ui";

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await adminApi.list<ContactMessageRow>("messages"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(row: ContactMessageRow) {
    await adminApi.update("messages", row.id, { is_read: true });
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, is_read: true } : r)),
    );
  }

  async function remove(id: number) {
    if (!confirm("Delete message?")) return;
    await adminApi.remove("messages", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Contact form inbox."
        actions={<Btn onClick={load}>Refresh</Btn>}
      />
      {error && (
        <div className="mb-4">
          <ErrorBox message={error} />
        </div>
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <Panel key={row.id} className="p-5">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{row.name}</p>
                    {!row.is_read && <Badge tone="yellow">Unread</Badge>}
                  </div>
                  <p className="text-xs text-neutral-500">{row.email}</p>
                  {row.created_at && (
                    <p className="mt-0.5 text-[11px] text-neutral-600">
                      {new Date(row.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!row.is_read && (
                    <Btn onClick={() => markRead(row)}>Mark read</Btn>
                  )}
                  <Btn variant="danger" onClick={() => remove(row.id)}>
                    Delete
                  </Btn>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                {row.message}
              </p>
            </Panel>
          ))}
          {!rows.length && (
            <Panel className="py-16 text-center text-sm text-neutral-600">
              Inbox is empty
            </Panel>
          )}
        </div>
      )}
    </div>
  );
}
