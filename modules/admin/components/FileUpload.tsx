"use client";

import { useCallback, useRef, useState } from "react";

import cn from "@/common/libs/clsxm";
import { adminApi } from "../lib/api";
import { Btn } from "./ui";

type Props = {
  label?: string;
  bucket: string;
  value?: string;
  onChange: (url: string) => void;
  pathPrefix?: string;
  accept?: string;
  hint?: string;
  required?: boolean;
  objectName?: string;
  requireObjectName?: boolean;
};

export default function FileUpload({
  label = "Image",
  bucket,
  value,
  onChange,
  pathPrefix = "",
  accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
  hint = "PNG, JPG, WEBP · max 5MB",
  required = false,
  objectName,
  requireObjectName = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const upload = useCallback(
    async (file: File) => {
      setError("");
      if (requireObjectName && !objectName) {
        setError("Fill title/name or slug before uploading the image");
        return;
      }
      if (!file.type.startsWith("image/") && !file.type.includes("svg")) {
        setError("Only image files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File too large (max 5MB)");
        return;
      }

      setUploading(true);
      setProgress(20);
      try {
        const ext =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "") || "webp";
        const safe = file.name
          .replace(/\.[^.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 40);
        const generatedName = objectName
          ? `${objectName.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}.webp`
          : `${Date.now()}-${safe || "image"}.${ext}`;
        const path = `${pathPrefix}${pathPrefix && !pathPrefix.endsWith("/") ? "/" : ""}${generatedName}`;

        setProgress(55);
        const res = await adminApi.upload(bucket, path, file);
        setProgress(100);
        onChange(res.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 400);
      }
    },
    [bucket, objectName, onChange, pathPrefix, requireObjectName],
  );

  const onFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void upload(file);
  };

  return (
    <div className="space-y-2 sm:col-span-2">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed transition",
          dragging
            ? "border-primary bg-primary/10"
            : "border-white/[0.1] bg-black/30",
        )}
      >
        {value ? (
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-40"
            />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="truncate text-xs text-neutral-400">{value}</p>
              <div className="flex flex-wrap gap-2">
                <Btn
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading…" : "Replace"}
                </Btn>
                <Btn
                  type="button"
                  variant="danger"
                  onClick={() => onChange("")}
                  disabled={uploading}
                >
                  Remove
                </Btn>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              ↑
            </span>
            <span className="text-sm font-medium text-neutral-200">
              {uploading ? "Uploading…" : "Drop image here or click to browse"}
            </span>
            <span className="text-[11px] text-neutral-500">{hint}</span>
          </button>
        )}

        {progress > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        required={required && !value}
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
