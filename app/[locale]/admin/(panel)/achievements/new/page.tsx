"use client";

import ResourceForm, { type FormField } from "@/modules/admin/components/ResourceForm";
import { PageHeader } from "@/modules/admin/components/ui";

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

export default function NewAchievementPage() {
  return (
    <div>
      <PageHeader title="New achievement" />
      <ResourceForm
        resource="achievements"
        fields={fields}
        redirectTo="/admin/achievements"
        initial={{
          type: "Certificate",
          category: "Other",
          is_show: true,
          sort_order: 0,
          issue_date: new Date().toISOString().slice(0, 10),
        }}
      />
    </div>
  );
}
