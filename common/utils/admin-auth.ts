import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions, isAdminEmail } from "@/common/libs/auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!session || !isAdminEmail(email)) {
    return null;
  }
  return session;
}

export function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal Server Error";
  return NextResponse.json({ message }, { status: 500 });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
