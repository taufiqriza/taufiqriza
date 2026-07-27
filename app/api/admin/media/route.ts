import { NextRequest, NextResponse } from "next/server";

import {
  badRequest,
  requireAdminSession,
  serverError,
  unauthorized,
} from "@/common/utils/admin-auth";
import {
  repoDeleteStorage,
  repoListStorage,
} from "@/services/admin/repository";

const ALLOWED_BUCKETS = new Set([
  "projects",
  "achievements",
  "careers",
  "education",
  "profile",
  "media",
  "icons",
]);

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const bucket = req.nextUrl.searchParams.get("bucket") || "media";
    const prefix = req.nextUrl.searchParams.get("prefix") || "";
    if (!ALLOWED_BUCKETS.has(bucket)) return badRequest("invalid bucket");
    const data = await repoListStorage(bucket, prefix);
    return NextResponse.json(data);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const bucket = String(body.bucket || "");
    const path = String(body.path || "");
    if (!bucket || !path) return badRequest("bucket and path required");
    if (!ALLOWED_BUCKETS.has(bucket)) return badRequest("invalid bucket");
    await repoDeleteStorage(bucket, path);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
