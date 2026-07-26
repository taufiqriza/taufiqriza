import { EDUCATION } from "@/common/constants/education";
import type { EducationProps } from "@/common/types/education";
import { createClient } from "@/common/utils/server";

export async function getEducationData(): Promise<EducationProps[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return EDUCATION;

    return data.map((item) => ({
      school: item.school,
      major: item.major,
      logo: item.logo || "",
      location: item.location,
      degree: item.degree,
      GPA: item.gpa || undefined,
      start_year: item.start_year,
      end_year: item.end_year,
      link: item.link || "",
    }));
  } catch {
    return EDUCATION;
  }
}
