"use client";

import type { SocialLinkRow } from "@/common/types/admin";
import ResourceList, { BoolBadge } from "@/modules/admin/components/ResourceList";
import type { Column } from "@/modules/admin/components/DataTable";

const columns: Column<SocialLinkRow>[] = [
  {
    key: "name",
    header: "Link",
    render: (r) => (
      <div>
        <p className="font-medium text-white">{r.title}</p>
        <p className="text-xs text-neutral-500">
          {r.name} · {r.href}
        </p>
      </div>
    ),
  },
  {
    key: "icon",
    header: "Icon",
    render: (r) => <span className="text-xs text-neutral-400">{r.icon_key}</span>,
  },
  {
    key: "show",
    header: "Visible",
    render: (r) => <BoolBadge value={r.is_show !== false} />,
  },
];

export default function AdminSocialPage() {
  return (
    <ResourceList
      resource="social"
      title="Social links"
      description="Contact & social cards on the site."
      columns={columns}
      newHref="/admin/social/new"
    />
  );
}
