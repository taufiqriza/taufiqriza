"use client";

import ResourceForm, { type FormField } from "@/modules/admin/components/ResourceForm";
import { PageHeader } from "@/modules/admin/components/ui";

const fields: FormField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", hint: "Auto from title if empty" },
  {
    name: "image",
    label: "Cover image",
    type: "image",
    bucket: "projects",
    pathPrefix: "",
    hint: "Drop project cover · PNG/JPG/WEBP max 5MB",
  },
  { name: "description", label: "Description", type: "textarea", rows: 3, required: true },
  { name: "content", label: "Content (Markdown)", type: "textarea", rows: 12 },
  { name: "stacks", label: "Stacks", type: "text", hint: "Comma-separated", placeholder: "Next.js, TypeScript" },
  { name: "link_demo", label: "Demo URL", type: "url" },
  { name: "link_github", label: "GitHub URL", type: "url" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "is_show", label: "Visible", type: "toggle" },
  { name: "is_featured", label: "Featured", type: "toggle" },
];

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader title="New project" description="Add a portfolio project" />
      <ResourceForm
        resource="projects"
        fields={fields}
        redirectTo="/admin/projects"
        initial={{ is_show: true, is_featured: false, sort_order: 0 }}
      />
    </div>
  );
}
