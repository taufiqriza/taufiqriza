"use client";

import type { CareerRow } from "@/common/types/admin";
import ResourceList, { BoolBadge } from "@/modules/admin/components/ResourceList";
import type { Column } from "@/modules/admin/components/DataTable";

const columns: Column<CareerRow>[] = [
  {
    key: "role",
    header: "Role",
    render: (r) => (
      <div>
        <p className="font-medium text-white">{r.position}</p>
        <p className="text-xs text-neutral-500">{r.company}</p>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (r) => (
      <span className="text-xs text-neutral-400">
        {r.type} · {r.location_type}
      </span>
    ),
  },
  {
    key: "dates",
    header: "Period",
    render: (r) => (
      <span className="text-xs text-neutral-400">
        {r.start_date} → {r.end_date || "Present"}
      </span>
    ),
  },
  {
    key: "show",
    header: "Visible",
    render: (r) => <BoolBadge value={r.is_show !== false} />,
  },
];

export default function AdminCareersPage() {
  return (
    <ResourceList
      resource="careers"
      title="Careers"
      description="Work experience timeline."
      columns={columns}
      newHref="/admin/careers/new"
    />
  );
}
