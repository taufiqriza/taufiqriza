"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ProjectRow } from "@/common/types/admin";
import ResourceForm, {
  type FormField,
} from "@/modules/admin/components/ResourceForm";
import { ErrorBox, Loading, PageHeader } from "@/modules/admin/components/ui";
import { adminApi } from "@/modules/admin/lib/api";
import { STACKS } from "@/common/constants/stacks";

const stackOptions = Object.keys(STACKS).map((stack) => ({
  value: stack,
  label: stack,
}));

const fields: FormField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text" },
  {
    name: "image",
    label: "Cover image",
    type: "image",
    bucket: "projects",
    hint: "Drop project cover · PNG/JPG/WEBP max 5MB",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    rows: 3,
    required: true,
  },
  { name: "content", label: "Content (Markdown)", type: "textarea", rows: 12 },
  {
    name: "stacks",
    label: "Tech stacks",
    type: "multiselect",
    options: stackOptions,
    hint: "Select stacks registered in the public design system",
  },
  { name: "link_demo", label: "Demo URL", type: "url" },
  { name: "link_github", label: "GitHub URL", type: "url" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "is_show", label: "Visible", type: "toggle" },
  { name: "is_featured", label: "Featured", type: "toggle" },
];

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ProjectRow | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get<ProjectRow>("projects", id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;
  if (!data) return <ErrorBox message="Not found" />;

  return (
    <div>
      <PageHeader title="Edit project" description={data.title} />
      <ResourceForm
        resource="projects"
        fields={fields}
        id={data.id}
        redirectTo="/admin/projects"
        initial={{
          ...data,
          stacks: data.stacks || [],
          image: data.image || "",
        }}
      />
    </div>
  );
}
