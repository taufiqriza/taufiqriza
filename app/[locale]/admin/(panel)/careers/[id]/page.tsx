"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { CareerRow } from "@/common/types/admin";
import ResourceForm, { type FormField } from "@/modules/admin/components/ResourceForm";
import { ErrorBox, Loading, PageHeader } from "@/modules/admin/components/ui";
import { adminApi } from "@/modules/admin/lib/api";

const fields: FormField[] = [
  { name: "position", label: "Position", type: "text", required: true },
  { name: "company", label: "Company", type: "text", required: true },
  { name: "logo", label: "Logo", type: "image", bucket: "careers", hint: "Upload logo image" },
  { name: "location", label: "Location", type: "text" },
  {
    name: "location_type",
    label: "Location type",
    type: "select",
    options: [
      { value: "Onsite", label: "Onsite" },
      { value: "Remote", label: "Remote" },
      { value: "Hybrid", label: "Hybrid" },
    ],
  },
  { name: "type", label: "Employment type", type: "text" },
  { name: "start_date", label: "Start (YYYY-MM)", type: "text", required: true },
  { name: "end_date", label: "End (YYYY-MM)", type: "text" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "link", label: "Company URL", type: "url" },
  { name: "responsibilities", label: "Responsibilities", type: "lines" },
  { name: "lessons_learned", label: "Lessons learned", type: "lines" },
  { name: "impact", label: "Impact", type: "lines" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "is_show", label: "Visible", type: "toggle" },
];

export default function EditCareerPage() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<CareerRow | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get<CareerRow>("careers", id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error || "Not found"} />;

  return (
    <div>
      <PageHeader title="Edit career" description={`${data.position} @ ${data.company}`} />
      <ResourceForm
        resource="careers"
        fields={fields}
        id={data.id}
        redirectTo="/admin/careers"
        initial={data as unknown as Record<string, unknown>}
      />
    </div>
  );
}
