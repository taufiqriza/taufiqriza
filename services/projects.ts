import { createClient } from "@/common/utils/server";

export const getProjectsData = async () => {
  const supabase = createClient();

  let { data, error } = await supabase
    .from("projects")
    .select()
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((item) => {
    if (item.image && String(item.image).startsWith("http")) {
      return item;
    }
    if (item.image && String(item.image).startsWith("/")) {
      return item;
    }

    const { data: imageData } = supabase.storage
      .from("projects")
      .getPublicUrl(`${item.slug}.webp`);

    return {
      ...item,
      image: imageData.publicUrl,
    };
  });
};

export const getProjectsDataBySlug = async (slug: string) => {
  const supabase = createClient();

  let { data, error } = await supabase
    .from("projects")
    .select()
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  if (!data) return null;

  if (
    data.image &&
    (String(data.image).startsWith("http") ||
      String(data.image).startsWith("/"))
  ) {
    return data;
  }

  const { data: imageData } = supabase.storage
    .from("projects")
    .getPublicUrl(`${data.slug}.webp`);

  return {
    ...data,
    image: imageData.publicUrl,
  };
};
