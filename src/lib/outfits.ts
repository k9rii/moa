import { supabase } from "./supabase";

export async function fetchOutfits() {
  const { data, error } = await supabase
    .from("outfits")
    .select(
      `
      id,
      image_url,
      instagram_post_url,
      description,
      celebrities (
        id,
        name,
        group_name
      ),
      outfit_items (
        id,
        category,
        affiliate_products (
          id,
          product_name,
          affiliate_url,
          price
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
