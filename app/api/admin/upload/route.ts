import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

import {
  badRequest,
  requireAdminSession,
  serverError,
  unauthorized,
} from "@/common/utils/admin-auth";
import { isSupabaseConfigured } from "@/common/utils/supabase-admin";
import { repoUpload } from "@/services/admin/repository";

const ALLOWED = new Set([
  "projects",
  "achievements",
  "careers",
  "education",
  "profile",
  "media",
  "icons",
]);

const MIME_OK = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

function safePathSegment(value: string) {
  return value
    .replace(/\.\./g, "")
    .replace(/[^a-zA-Z0-9._/-]/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");
}

async function saveLocal(bucket: string, filePath: string, file: File) {
  const rel = path.join("uploads", bucket, filePath);
  const abs = path.join(process.cwd(), "public", rel);
  await mkdir(path.dirname(abs), { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(abs, buf);
  return `/${rel.replace(/\\/g, "/")}`;
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const form = await req.formData();
    const file = form.get("file");
    const bucket = String(form.get("bucket") || "media");
    let filePath = String(form.get("path") || "");

    if (!(file instanceof File)) return badRequest("file is required");
    if (!ALLOWED.has(bucket)) return badRequest("invalid bucket");
    if (file.size > 5 * 1024 * 1024) {
      return badRequest("File too large (max 5MB)");
    }
    if (file.type && !MIME_OK.has(file.type)) {
      return badRequest("Unsupported file type");
    }

    if (!filePath) {
      const ext =
        file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        "webp";
      filePath = `${Date.now()}.${ext}`;
    }
    filePath = safePathSegment(filePath);
    if (!filePath) return badRequest("invalid path");

    // Prefer Supabase when configured; always have solid local fallback
    if (isSupabaseConfigured()) {
      try {
        const url = await repoUpload(bucket, filePath, file);
        // If memory fallback returned relative without real file, write local too
        if (url.startsWith("/images/")) {
          const localUrl = await saveLocal(bucket, filePath, file);
          return NextResponse.json({
            url: localUrl,
            path: filePath,
            bucket,
            storage: "local",
          });
        }
        return NextResponse.json({
          url,
          path: filePath,
          bucket,
          storage: "supabase",
        });
      } catch {
        // fall through to local
      }
    }

    const localUrl = await saveLocal(bucket, filePath, file);
    return NextResponse.json({
      url: localUrl,
      path: filePath,
      bucket,
      storage: "local",
    });
  } catch (error) {
    return serverError(error);
  }
}
