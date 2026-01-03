// src/components/MyPage.tsx
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { ItemCard } from "./ItemCard";
import { supabase } from "../lib/supabase";

export function MyPage() {
  const [likedOutfits, setLikedOutfits] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLikedOutfits() {
      const { data, error } = await supabase
        .from("likes")
        .select(
          `
          outfit:outfits (
            id,
            image_url,
            description,
            celebrities ( name ),
            outfit_items (
              affiliate_products (
                id,
                affiliate_url
              )
            )
          )
        `
        )
        .eq("user_id", "test-user");

      if (error) {
        console.error(error);
        return;
      }

      setLikedOutfits(data?.map((l) => l.outfit) ?? []);
    }

    fetchLikedOutfits();
  }, []);

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-4xl mb-8">My Page</h1>

      {likedOutfits.length === 0 ? (
        <p className="text-gray-400">아직 저장한 아이템이 없습니다</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {likedOutfits.map((outfit) => (
            <ItemCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      )}
    </div>
  );
}
