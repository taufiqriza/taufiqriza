"use client";

import { Badge, Empty, Panel } from "./ui";

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

export default function DataTable<T extends { id?: number | string }>({
  columns,
  rows,
  onRowClick,
  emptyTitle = "No records",
  emptyDescription,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (!rows.length) {
    return (
      <Panel>
        <Empty title={emptyTitle} description={emptyDescription} />
      </Panel>
    );
  }

  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-neutral-500">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 font-medium ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={String(row.id ?? i)}
                onClick={() => onRowClick?.(row)}
                className="border-b border-white/[0.04] transition last:border-0 hover:bg-white/[0.03]"
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 ${col.className || ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function BoolBadge({ value, onLabel = "On", offLabel = "Off" }: {
  value?: boolean;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <Badge tone={value ? "green" : "neutral"}>
      {value ? onLabel : offLabel}
    </Badge>
  );
}
