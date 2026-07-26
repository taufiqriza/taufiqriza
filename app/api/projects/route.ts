import { NextResponse } from "next/server";

import { PROJECTS } from "@/common/constants/projects";
import { getProjectsData } from "@/services/projects";

export const GET = async () => {
  try {
    const data = await getProjectsData();
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data, { status: 200 });
    }
    return NextResponse.json(PROJECTS, { status: 200 });
  } catch {
    return NextResponse.json(PROJECTS, { status: 200 });
  }
};
