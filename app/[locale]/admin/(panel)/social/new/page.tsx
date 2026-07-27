"use client";

import ResourceForm, {
  type FormField,
} from "@/modules/admin/components/ResourceForm";
import { PageHeader } from "@/modules/admin/components/ui";

const fields: FormField[] = [
  {
    name: "name",
    label: "Key",
    type: "text",
    required: true,
    hint: "gmail, github, …",
  },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", rows: 2 },
  { name: "href", label: "URL", type: "text", required: true },
  {
    name: "icon_key",
    label: "Icon",
    type: "select",
    required: true,
    options: ["gmail", "github", "instagram", "linkedin", "link"].map(
      (value) => ({ value, label: value }),
    ),
  },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "is_show", label: "Visible", type: "toggle" },
];

export default function NewSocialPage() {
  return (
    <div>
      <PageHeader title="New social link" />
      <ResourceForm
        resource="social"
        fields={fields}
        redirectTo="/admin/social"
        initial={{ is_show: true, sort_order: 0, icon_key: "link" }}
      />
    </div>
  );
}
