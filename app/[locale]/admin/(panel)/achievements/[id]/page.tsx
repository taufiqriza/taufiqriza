"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { AchievementRow } from "@/common/types/admin";
import ResourceForm, { type FormField } from "@/modules/admin/components/ResourceForm";
import { ErrorBox, Loading, PageHeader } from "@/modules/admin/components/ui";
import { adminApi } from "@/modules/admin/lib/api";

const fields: FormField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text" },
  { name: "issuing_organization", label: "Organization", type: "text", required: true },
  { name: "credential_id", label: "Credential ID", type: "text" },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "Certificate", label: "Certificate" },
      { value: "Badge", label: "Badge" },
      { value: "Award", label: "Award" },
    ],
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "Web Development", label: "Web Development" },
      { value: "Mobile Development", label: "Mobile Development" },
      { value: "Cloud", label: "Cloud" },
      { value: "Other", label: "Other" },
    ],
  },
  { name: "url_credential", label: "Credential URL", type: "url" },
  { name: "issue_date", label: "Issue date", type: "date", required: true },
  { name: "expiration_date", label: "Expiration", type: "date" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "is_show", label: "Visible", type: "toggle" },
];

export default function EditAchievementPage() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<AchievementRow | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get<AchievementRow>("achievements", id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error || "Not found"} />;

  return (
    <div>
      <PageHeader title="Edit achievement" description={data.name} />
      <ResourceForm
        resource="achievements"
        fields={fields}
        id={data.id}
        redirectTo="/admin/achievements"
        initial={data as unknown as Record<string, unknown>}
      />
    </div>
  );
}
