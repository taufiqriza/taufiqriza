import { NextResponse } from "next/server";

import { PROJECTS } from "@/common/constants/projects";
import { getProjectsDataBySlug } from "@/services/projects";

export const GET = async (
  _req: Request,
  { params }: { params: { slug: string } },
) => {
  try {
    const data = await getProjectsDataBySlug(params.slug);
    if (data) return NextResponse.json(data, { status: 200 });
  } catch {
    /* fallback */
  }

  const local = PROJECTS.find((p) => p.slug === params.slug);
  if (local) return NextResponse.json(local, { status: 200 });

  return NextResponse.json({ message: "Not found" }, { status: 404 });
};
