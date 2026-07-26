"use client";

import { useCallback, useEffect, useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";
import { adminApi } from "../lib/api";
import DataTable, { BoolBadge, type Column } from "./DataTable";
import { Btn, ErrorBox, Loading, PageHeader } from "./ui";

export default function ResourceList<T extends { id: number }>({
  resource,
  title,
  description,
  columns,
  newHref,
}: {
  resource: string;
  title: string;
  description: string;
  columns: Column<T>[];
  newHref: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.list<T>(resource);
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Delete this item?")) return;
    try {
      await adminApi.remove(resource, id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const cols: Column<T>[] = [
    ...columns,
    {
      key: "actions",
      header: "",
      className: "w-28 text-right",
      render: (row) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`${newHref.replace("/new", "")}/${row.id}`}
            className="rounded-lg px-2 py-1 text-xs text-neutral-400 hover:bg-white/5 hover:text-white"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={(e) => handleDelete(row.id, e)}
            className="rounded-lg px-2 py-1 text-xs text-red-400/80 hover:bg-red-500/10 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            <Btn onClick={load} disabled={loading}>
              Refresh
            </Btn>
            <Link href={newHref}>
              <Btn variant="primary">New</Btn>
            </Link>
          </>
        }
      />
      {error && (
        <div className="mb-4">
          <ErrorBox message={error} />
        </div>
      )}
      {loading ? (
        <Loading />
      ) : (
        <DataTable
          columns={cols}
          rows={rows}
          onRowClick={(row) => router.push(`${newHref.replace("/new", "")}/${row.id}`)}
          emptyTitle={`No ${title.toLowerCase()} yet`}
          emptyDescription="Create your first record to get started."
        />
      )}
    </div>
  );
}

export { BoolBadge };
