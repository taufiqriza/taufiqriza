"use client";

import ResourceForm, { type FormField } from "@/modules/admin/components/ResourceForm";
import { PageHeader } from "@/modules/admin/components/ui";

const fields: FormField[] = [
  { name: "school", label: "School", type: "text", required: true },
  { name: "major", label: "Major", type: "text", required: true },
  { name: "degree", label: "Degree", type: "text", required: true },
  { name: "logo", label: "Logo path/URL", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "gpa", label: "GPA", type: "text" },
  { name: "start_year", label: "Start year", type: "number", required: true },
  { name: "end_year", label: "End year", type: "number", required: true },
  { name: "link", label: "Website", type: "url" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export default function NewEducationPage() {
  return (
    <div>
      <PageHeader title="New education" />
      <ResourceForm
        resource="education"
        fields={fields}
        redirectTo="/admin/education"
        initial={{ sort_order: 0 }}
      />
    </div>
  );
}
