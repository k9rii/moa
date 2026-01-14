// src/lib/outfits.ts
import { supabase } from "./supabase";

// 1. 전체 조회 (기존과 동일하지만 명확성을 위해 포함)
export async function getOutfits() {
  const { data, error } = await supabase
    .from("outfits")
    .select(
      `
      id,
      created_at,
      image_url,
      instagram_post_url,
      description,
      celebrities:celebrity_id ( id, name, group_name ),
      outfit_items (
        id,
        category,
        affiliate_products ( id, product_name, affiliate_url, price )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// 2. 카테고리별 조회 (수정됨: 구조 통일 및 !inner 사용)
export async function getOutfitsByCategory(category: string) {
  const { data, error } = await supabase
    .from("outfits")
    .select(
      `
      id,
      created_at,
      image_url,
      instagram_post_url,
      description,
      celebrities:celebrity_id ( id, name, group_name ),
      outfit_items!inner (
        id,
        category,
        affiliate_products ( id, product_name, affiliate_url, price )
      )
    `
    )
    .eq("outfit_items.category", category) // !inner 덕분에 자식 조건으로 부모 필터링 가능
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching outfits by category:", error);
    return [];
  }

  return data;
}
