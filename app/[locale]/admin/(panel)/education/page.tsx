"use client";

import type { EducationRow } from "@/common/types/admin";
import ResourceList from "@/modules/admin/components/ResourceList";
import type { Column } from "@/modules/admin/components/DataTable";

const columns: Column<EducationRow>[] = [
  {
    key: "school",
    header: "School",
    render: (r) => (
      <div>
        <p className="font-medium text-white">{r.school}</p>
        <p className="text-xs text-neutral-500">{r.major}</p>
      </div>
    ),
  },
  {
    key: "degree",
    header: "Degree",
    render: (r) => <span className="text-xs text-neutral-400">{r.degree}</span>,
  },
  {
    key: "years",
    header: "Years",
    render: (r) => (
      <span className="text-xs text-neutral-400">
        {r.start_year} – {r.end_year}
      </span>
    ),
  },
  {
    key: "gpa",
    header: "GPA",
    render: (r) => <span className="text-xs text-neutral-400">{r.gpa || "—"}</span>,
  },
];

export default function AdminEducationPage() {
  return (
    <ResourceList
      resource="education"
      title="Education"
      description="Academic background."
      columns={columns}
      newHref="/admin/education/new"
    />
  );
}
