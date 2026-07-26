import { NextRequest, NextResponse } from "next/server";

import {
  badRequest,
  requireAdminSession,
  serverError,
  unauthorized,
} from "@/common/utils/admin-auth";
import { repoDeleteStorage, repoListStorage } from "@/services/admin/repository";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const bucket = req.nextUrl.searchParams.get("bucket") || "media";
    const data = await repoListStorage(bucket);
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
    await repoDeleteStorage(bucket, path);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
