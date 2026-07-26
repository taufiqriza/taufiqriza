import { CAREERS } from "@/common/constants/carreers";
import type { CareerProps } from "@/common/types/careers";
import { createClient } from "@/common/utils/server";

export async function getCareersData(): Promise<CareerProps[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("careers")
      .select("*")
      .eq("is_show", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return CAREERS.filter((c) => c.isShow !== false);

    return data.map((item) => ({
      position: item.position,
      company: item.company,
      logo: item.logo,
      location: item.location,
      location_type: item.location_type,
      type: item.type,
      start_date: item.start_date,
      end_date: item.end_date,
      industry: item.industry || "",
      link: item.link,
      responsibilities: item.responsibilities || [],
      lessons_learned: item.lessons_learned || [],
      impact: item.impact || [],
      isShow: item.is_show,
    }));
  } catch {
    return CAREERS.filter((c) => c.isShow !== false);
  }
}
