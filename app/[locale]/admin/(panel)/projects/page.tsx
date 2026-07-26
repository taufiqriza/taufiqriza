"use client";

import type { ProjectRow } from "@/common/types/admin";
import ResourceList, { BoolBadge } from "@/modules/admin/components/ResourceList";
import type { Column } from "@/modules/admin/components/DataTable";

const columns: Column<ProjectRow>[] = [
  {
    key: "title",
    header: "Title",
    render: (r) => (
      <div>
        <p className="font-medium text-white">{r.title}</p>
        <p className="text-xs text-neutral-500">{r.slug}</p>
      </div>
    ),
  },
  {
    key: "stacks",
    header: "Stacks",
    render: (r) => (
      <span className="line-clamp-1 text-xs text-neutral-400">
        {(r.stacks || []).join(", ") || "—"}
      </span>
    ),
  },
  {
    key: "featured",
    header: "Featured",
    render: (r) => <BoolBadge value={r.is_featured} onLabel="Yes" offLabel="No" />,
  },
  {
    key: "show",
    header: "Visible",
    render: (r) => <BoolBadge value={r.is_show} onLabel="Show" offLabel="Hide" />,
  },
];

export default function AdminProjectsPage() {
  return (
    <ResourceList
      resource="projects"
      title="Projects"
      description="Portfolio projects shown on the public site."
      columns={columns}
      newHref="/admin/projects/new"
    />
  );
}
