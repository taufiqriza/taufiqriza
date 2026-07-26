"use client";

import ResourceForm, { type FormField } from "@/modules/admin/components/ResourceForm";
import { PageHeader } from "@/modules/admin/components/ui";

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
  { name: "type", label: "Employment type", type: "text", placeholder: "Internship / Full-time" },
  { name: "start_date", label: "Start (YYYY-MM)", type: "text", required: true },
  { name: "end_date", label: "End (YYYY-MM)", type: "text", hint: "Leave empty if current" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "link", label: "Company URL", type: "url" },
  { name: "responsibilities", label: "Responsibilities", type: "lines", hint: "One per line" },
  { name: "lessons_learned", label: "Lessons learned", type: "lines" },
  { name: "impact", label: "Impact", type: "lines" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "is_show", label: "Visible", type: "toggle" },
];

export default function NewCareerPage() {
  return (
    <div>
      <PageHeader title="New career" />
      <ResourceForm
        resource="careers"
        fields={fields}
        redirectTo="/admin/careers"
        initial={{
          location_type: "Onsite",
          type: "Full-time",
          is_show: true,
          sort_order: 0,
        }}
      />
    </div>
  );
}
