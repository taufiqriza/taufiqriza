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
  repoCreate,
  repoList,
  repoStats,
  repoSettings,
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
};

function parseBody(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  return raw as Record<string, unknown>;
}

function normalizePayload(resource: string, body: Record<string, unknown>) {
  const payload = { ...body };
  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;
  // keep image / logo URLs from FileUpload

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
    if (!Array.isArray(payload.stacks)) payload.stacks = [];
  }

  if (resource === "achievements") {
    if (!payload.slug && typeof payload.name === "string") {
      payload.slug = slugify(payload.name);
    }
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
    if (payload[key] !== undefined) {
      payload[key] = Boolean(payload[key]);
    }
  }

  if (payload.sort_order !== undefined) {
    payload.sort_order = Number(payload.sort_order) || 0;
  }
  if (payload.start_year !== undefined) {
    payload.start_year = Number(payload.start_year);
  }
  if (payload.end_year !== undefined) {
    payload.end_year = Number(payload.end_year);
  }

  return payload;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { resource: string } },
) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const { resource } = params;

    if (resource === "stats") {
      return NextResponse.json(await repoStats());
    }

    if (resource === "settings") {
      return NextResponse.json(await repoSettings());
    }

    const table = RESOURCES[resource];
    if (!table) return badRequest("Unknown resource");

    const data = await repoList(table);
    return NextResponse.json(data);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { resource: string } },
) {
  const session = await requireAdminSession();
  if (!session) return unauthorized();

  try {
    const { resource } = params;
    const body = parseBody(await req.json());

    if (resource === "settings") {
      const key = String(body.key || "");
      if (!key) return badRequest("key is required");
      const data = await repoUpsertSetting(key, body.value);
      REVALIDATE.settings?.forEach((p) => revalidatePath(p));
      return NextResponse.json(data, { status: 201 });
    }

    const table = RESOURCES[resource];
    if (!table) return badRequest("Unknown resource");

    const payload = normalizePayload(resource, body);
    if (resource === "projects" && !payload.title) {
      return badRequest("title is required");
    }
    if (resource === "achievements" && !payload.name) {
      return badRequest("name is required");
    }

    const data = await repoCreate(table, payload);
    REVALIDATE[resource]?.forEach((p) => revalidatePath(p));
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
