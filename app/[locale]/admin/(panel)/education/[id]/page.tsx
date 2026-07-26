"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { EducationRow } from "@/common/types/admin";
import ResourceForm, { type FormField } from "@/modules/admin/components/ResourceForm";
import { ErrorBox, Loading, PageHeader } from "@/modules/admin/components/ui";
import { adminApi } from "@/modules/admin/lib/api";

const fields: FormField[] = [
  { name: "school", label: "School", type: "text", required: true },
  { name: "major", label: "Major", type: "text", required: true },
  { name: "degree", label: "Degree", type: "text", required: true },
  { name: "logo", label: "Logo", type: "image", bucket: "education", hint: "Upload logo image" },
  { name: "location", label: "Location", type: "text" },
  { name: "gpa", label: "GPA", type: "text" },
  { name: "start_year", label: "Start year", type: "number", required: true },
  { name: "end_year", label: "End year", type: "number", required: true },
  { name: "link", label: "Website", type: "url" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export default function EditEducationPage() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<EducationRow | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get<EducationRow>("education", id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error || "Not found"} />;

  return (
    <div>
      <PageHeader title="Edit education" description={data.school} />
      <ResourceForm
        resource="education"
        fields={fields}
        id={data.id}
        redirectTo="/admin/education"
        initial={data as unknown as Record<string, unknown>}
      />
    </div>
  );
}
