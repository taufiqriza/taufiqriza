"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { SocialLinkRow } from "@/common/types/admin";
import ResourceForm, { type FormField } from "@/modules/admin/components/ResourceForm";
import { ErrorBox, Loading, PageHeader } from "@/modules/admin/components/ui";
import { adminApi } from "@/modules/admin/lib/api";

const fields: FormField[] = [
  { name: "name", label: "Key", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", rows: 2 },
  { name: "href", label: "URL", type: "text", required: true },
  { name: "icon_key", label: "Icon key", type: "text", required: true },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "is_show", label: "Visible", type: "toggle" },
];

export default function EditSocialPage() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<SocialLinkRow | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get<SocialLinkRow>("social", id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error || "Not found"} />;

  return (
    <div>
      <PageHeader title="Edit social" description={data.title} />
      <ResourceForm
        resource="social"
        fields={fields}
        id={data.id}
        redirectTo="/admin/social"
        initial={data as unknown as Record<string, unknown>}
      />
    </div>
  );
}
