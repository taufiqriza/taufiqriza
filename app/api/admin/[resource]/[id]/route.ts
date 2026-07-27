import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import {
  badRequest,
  requireAdminSession,
  serverError,
  slugify,
  unauthorized,
} from "@/common/utils/admin-auth";
import type { TableName } from "@/services/admin/crud";
import {
  repoDelete,
  repoGet,
  repoUpdate,
  repoUpsertSetting,
} from "@/services/admin/repository";

const RESOURCES: Record<string, TableName> = {
  projects: "projects",
  achievements: "achievements",
  careers: "careers",
  education: "education",
  social: "social_links",
  skills: "skills",
  menus: "menus",
  messages: "contact_messages",
  settings: "site_settings",
};

const REVALIDATE: Record<string, string[]> = {
  projects: ["/projects", "/"],
  achievements: ["/achievements"],
  careers: ["/about"],
  education: ["/about"],
  social: ["/"],
  skills: ["/"],
  menus: ["/"],
  settings: ["/", "/about"],
  messages: [],
};

const LOCALES = ["en", "id"];

function revalidateResource(resource: string) {
  for (const route of REVALIDATE[resource] || []) {
    for (const locale of LOCALES) {
      revalidatePath(route === "/" ? `/${locale}` : `/${locale}${route}`);
    }
  }
}

function normalizePayload(resource: string, body: Record<string, unknown>) {
  const payload = { ...body };
  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;

  if (resource === "projects") {
    if (!payload.slug && typeof payload.title === "string") {
      payload.slug = slugify(payload.title);
    }
    if (typeof payload.stacks === "string") {
      payload.stacks = (payload.stacks as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  if (
    resource === "achievements" &&
    !payload.slug &&
    typeof payload.name === "string"
  ) {
    payload.slug = slugify(payload.name);
  }

  for (const key of ["responsibilities", "lessons_learned", "impact"]) {
    if (typeof payload[key] === "string") {
      payload[key] = (payload[key] as string)
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  for (const key of [
    "is_show",
    "is_featured",
    "is_active",
    "is_external",
    "is_read",
  ]) {
    if (payload[key] !== undefined) payload[key] = Boolean(payload[key]);
  }

  if (payload.sort_order !== undefined)
    payload.sort_order = Number(payload.sort_order) || 0;
  if (payload.start_year !== undefined)
    payload.start_year = Number(payload.start_year);
  if (payload.end_year !== undefined)
    payload.end_year = Number(payload.end_year);

  return payload;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { resource: string; id: string } },
) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const table = RESOURCES[params.resource];
    if (!table) return badRequest("Unknown resource");

    const id = params.resource === "settings" ? params.id : Number(params.id);
    const data = await repoGet(table, id);
    if (!data) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { resource: string; id: string } },
) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { resource, id } = params;

    if (resource === "settings") {
      const data = await repoUpsertSetting(id, body.value ?? body);
      revalidateResource("settings");
      return NextResponse.json(data);
    }

    const table = RESOURCES[resource];
    if (!table) return badRequest("Unknown resource");

    const payload = normalizePayload(resource, body);
    const data = await repoUpdate(table, Number(id), payload);
    revalidateResource(resource);
    return NextResponse.json(data);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: { resource: string; id: string } },
) {
  return PUT(req, ctx);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { resource: string; id: string } },
) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const table = RESOURCES[params.resource];
    if (!table) return badRequest("Unknown resource");

    const id = params.resource === "settings" ? params.id : Number(params.id);
    await repoDelete(table, id);
    revalidateResource(params.resource);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
