"use client";

import { FormEvent, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { adminApi } from "../lib/api";
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
    };

function toFormValue(value: unknown, type: FormField["type"]): string | boolean {
  if (type === "toggle") return Boolean(value);
  if (type === "lines" && Array.isArray(value)) return value.join("\n");
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
        if (f.type === "number") {
          payload[f.name] = values[f.name] === "" ? null : Number(values[f.name]);
        }
        if (f.type === "toggle") {
          payload[f.name] = Boolean(values[f.name]);
        }
      });

      // stacks special: comma-separated stored as array later by API
      if (typeof payload.stacks === "string") {
        // keep as string for API normalize
      }

      if (transform) payload = transform(payload);

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
          if (field.type === "toggle") {
            return (
              <Field key={field.name} label={field.label} hint={field.hint} className="sm:col-span-2">
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
