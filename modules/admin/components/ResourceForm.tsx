"use client";

import { FormEvent, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { adminApi } from "../lib/api";
import FileUpload from "./FileUpload";
import { Btn, ErrorBox, Field, Input, Panel, Textarea, Toggle } from "./ui";

export type FormField =
  | {
      name: string;
      label: string;
      type: "text" | "url" | "number" | "date" | "email";
      required?: boolean;
      hint?: string;
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "textarea";
      rows?: number;
      required?: boolean;
      hint?: string;
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "toggle";
      hint?: string;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: { value: string; label: string }[];
      required?: boolean;
    }
  | {
      name: string;
      label: string;
      type: "lines";
      hint?: string;
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "image";
      bucket: string;
      pathPrefix?: string;
      hint?: string;
    }
  | {
      name: string;
      label: string;
      type: "multiselect";
      options: { value: string; label: string }[];
      hint?: string;
      required?: boolean;
    };

function toFormValue(
  value: unknown,
  type: FormField["type"],
): string | boolean {
  if (type === "toggle") return Boolean(value);
  if (type === "lines" && Array.isArray(value)) return value.join("\n");
  if (type === "multiselect" && Array.isArray(value)) return value.join(",");
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined) return "";
  return String(value);
}

export default function ResourceForm({
  resource,
  fields,
  initial,
  id,
  redirectTo,
  transform,
}: {
  resource: string;
  fields: FormField[];
  initial?: Record<string, unknown>;
  id?: number | string;
  redirectTo: string;
  transform?: (data: Record<string, unknown>) => Record<string, unknown>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {};
    fields.forEach((f) => {
      init[f.name] = toFormValue(initial?.[f.name], f.type);
    });
    return init;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (name: string, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let payload: Record<string, unknown> = { ...values };

      fields.forEach((f) => {
        if (f.type === "lines") {
          payload[f.name] = String(values[f.name] || "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        if (f.type === "multiselect") {
          payload[f.name] = String(values[f.name] || "")
            .split(",")
            .filter(Boolean);
        }
        if (f.type === "number") {
          payload[f.name] =
            values[f.name] === "" ? null : Number(values[f.name]);
        }
        if (f.type === "toggle") {
          payload[f.name] = Boolean(values[f.name]);
        }
        if (
          f.type !== "toggle" &&
          f.type !== "number" &&
          String(values[f.name] ?? "").trim() === "" &&
          !("required" in f && f.required)
        ) {
          payload[f.name] = null;
        }
      });

      if (transform) payload = transform(payload);

      // Project and achievement images use deterministic storage keys
      // (`{slug}.webp`) so this remains compatible with legacy DB schemas.
      if (resource === "projects" || resource === "achievements") {
        delete payload.image;
      }

      if (id !== undefined) {
        await adminApi.update(resource, id, payload);
      } else {
        await adminApi.create(resource, payload);
      }
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <ErrorBox message={error} />}
      <Panel className="grid gap-5 p-5 sm:grid-cols-2">
        {fields.map((field) => {
          if (field.type === "image") {
            const rawObjectName = String(
              values.slug || values.title || values.name || "",
            ).trim();
            const objectName = rawObjectName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            return (
              <FileUpload
                key={field.name}
                label={field.label}
                bucket={field.bucket}
                pathPrefix={field.pathPrefix}
                hint={field.hint}
                objectName={
                  resource === "projects" || resource === "achievements"
                    ? objectName
                    : undefined
                }
                requireObjectName={
                  resource === "projects" || resource === "achievements"
                }
                value={String(values[field.name] || "")}
                onChange={(url) => set(field.name, url)}
              />
            );
          }

          if (field.type === "toggle") {
            return (
              <Field
                key={field.name}
                label={field.label}
                hint={field.hint}
                className="sm:col-span-2"
              >
                <Toggle
                  checked={Boolean(values[field.name])}
                  onChange={(v) => set(field.name, v)}
                  label={Boolean(values[field.name]) ? "Enabled" : "Disabled"}
                />
              </Field>
            );
          }

          if (field.type === "textarea" || field.type === "lines") {
            return (
              <Field
                key={field.name}
                label={field.label}
                hint={field.hint}
                className="sm:col-span-2"
              >
                <Textarea
                  rows={field.type === "textarea" ? field.rows || 6 : 4}
                  value={String(values[field.name] ?? "")}
                  onChange={(e) => set(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.type === "textarea" ? field.required : false}
                />
              </Field>
            );
          }

          if (field.type === "select") {
            return (
              <Field key={field.name} label={field.label}>
                <select
                  className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-primary/40"
                  value={String(values[field.name] ?? "")}
                  onChange={(e) => set(field.name, e.target.value)}
                  required={field.required}
                >
                  {field.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            );
          }

          if (field.type === "multiselect") {
            const selected = new Set(
              String(values[field.name] || "")
                .split(",")
                .filter(Boolean),
            );
            return (
              <fieldset key={field.name} className="space-y-2 sm:col-span-2">
                <legend className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  {field.label}
                </legend>
                <div className="flex flex-wrap gap-2 rounded-xl border border-white/[0.08] bg-black/30 p-3">
                  {field.options.map((option) => {
                    const checked = selected.has(option.value);
                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs transition ${
                          checked
                            ? "border-primary/40 bg-primary/15 text-primary-300"
                            : "border-white/[0.08] text-neutral-400 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => {
                            const next = new Set(selected);
                            checked
                              ? next.delete(option.value)
                              : next.add(option.value);
                            set(field.name, Array.from(next).join(","));
                          }}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
                {field.hint && (
                  <p className="text-[11px] text-neutral-600">{field.hint}</p>
                )}
              </fieldset>
            );
          }

          return (
            <Field key={field.name} label={field.label} hint={field.hint}>
              <Input
                type={field.type}
                value={String(values[field.name] ?? "")}
                onChange={(e) => set(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            </Field>
          );
        })}
      </Panel>

      <div className="flex gap-2">
        <Btn type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving…" : id !== undefined ? "Update" : "Create"}
        </Btn>
        <Btn type="button" onClick={() => router.back()}>
          Cancel
        </Btn>
      </div>
    </form>
  );
}
