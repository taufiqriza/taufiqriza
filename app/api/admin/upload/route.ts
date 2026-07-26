import { NextRequest, NextResponse } from "next/server";

import {
  badRequest,
  requireAdminSession,
  serverError,
  unauthorized,
} from "@/common/utils/admin-auth";
import { repoUpload } from "@/services/admin/repository";

const ALLOWED = new Set([
  "projects",
  "achievements",
  "careers",
  "education",
  "profile",
  "media",
]);

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const form = await req.formData();
    const file = form.get("file");
    const bucket = String(form.get("bucket") || "media");
    const path = String(form.get("path") || "");

    if (!(file instanceof File)) return badRequest("file is required");
    if (!ALLOWED.has(bucket)) return badRequest("invalid bucket");
    if (!path) return badRequest("path is required");

    if (file.size > 5 * 1024 * 1024) {
      return badRequest("File too large (max 5MB)");
    }

    const url = await repoUpload(bucket, path, file);
    return NextResponse.json({ url, path, bucket });
  } catch (error) {
    return serverError(error);
  }
}
