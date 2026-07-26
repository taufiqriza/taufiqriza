"use client";

import cn from "@/common/libs/clsxm";
import { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-xl text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Btn({
  variant = "default",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "danger" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" &&
          "border border-white/[0.08] bg-white/[0.04] text-neutral-200 hover:bg-white/[0.08]",
        variant === "primary" &&
          "bg-primary text-white hover:bg-primary-400 shadow-[0_0_24px_-6px_rgba(6,92,194,0.5)]",
        variant === "danger" &&
          "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20",
        variant === "ghost" && "text-neutral-400 hover:bg-white/[0.04] hover:text-white",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-neutral-600">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-primary/40 focus:ring-2 focus:ring-primary/10";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, props.className)} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(inputClass, "min-h-[100px] resize-y font-mono text-[13px]", props.className)}
      {...props}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(inputClass, "appearance-none", props.className)}
      {...props}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          checked ? "bg-primary" : "bg-white/10",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
      {label && <span className="text-sm text-neutral-300">{label}</span>}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "yellow" | "red";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        tone === "neutral" && "bg-white/5 text-neutral-400",
        tone === "green" && "bg-emerald-500/10 text-emerald-400",
        tone === "yellow" && "bg-primary/10 text-primary",
        tone === "red" && "bg-red-500/10 text-red-400",
      )}
    >
      {children}
    </span>
  );
}

export function Empty({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-white/10 text-neutral-600">
        ∅
      </div>
      <p className="text-sm font-medium text-neutral-300">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-neutral-600">{description}</p>
      )}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {message}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <Panel className="p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-neutral-600">{hint}</p>}
    </Panel>
  );
}
