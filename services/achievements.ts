import { createClient } from "@/common/utils/server";

interface GetAchievementsDataProps {
  category?: string;
  search?: string;
}

export const getAchievementsData = async ({
  category,
  search,
}: GetAchievementsDataProps) => {
  const supabase = createClient();

  let query = supabase
    .from("achievements")
    .select()
    .order("sort_order", { ascending: true });

  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((item) => {
    if (!item.image) {
      const { data: imageData } = supabase.storage
        .from("achievements")
        .getPublicUrl(`${item.slug}.webp`);
      return { ...item, image: imageData.publicUrl };
    }
    if (item.image.startsWith("http") || item.image.startsWith("/")) {
      return item;
    }
    const { data: imageData } = supabase.storage
      .from("achievements")
      .getPublicUrl(item.image);
    return { ...item, image: imageData.publicUrl };
  });
};

export const getAchivementTypes = async () => ["Certificate", "Badge", "Award"];

export const getAchivementCategories = async () => [
  "Web Development",
  "Mobile Development",
  "Cloud",
  "Other",
];
