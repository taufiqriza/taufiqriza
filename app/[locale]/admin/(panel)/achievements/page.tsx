"use client";

import type { AchievementRow } from "@/common/types/admin";
import ResourceList, { BoolBadge } from "@/modules/admin/components/ResourceList";
import type { Column } from "@/modules/admin/components/DataTable";

const columns: Column<AchievementRow>[] = [
  {
    key: "name",
    header: "Name",
    render: (r) => (
      <div>
        <p className="font-medium text-white">{r.name}</p>
        <p className="text-xs text-neutral-500">{r.issuing_organization}</p>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (r) => <span className="text-xs text-neutral-400">{r.type}</span>,
  },
  {
    key: "category",
    header: "Category",
    render: (r) => <span className="text-xs text-neutral-400">{r.category}</span>,
  },
  {
    key: "show",
    header: "Visible",
    render: (r) => <BoolBadge value={r.is_show !== false} />,
  },
];

export default function AdminAchievementsPage() {
  return (
    <ResourceList
      resource="achievements"
      title="Achievements"
      description="Certificates, badges, and awards."
      columns={columns}
      newHref="/admin/achievements/new"
    />
  );
}
