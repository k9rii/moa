// src/components/ItemCard.tsx
import { useEffect, useState } from "react";
import { Heart, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";

export function ItemCard({ outfit }: { outfit: any }) {
  console.log("IMAGE_URL:", outfit.image_url, typeof outfit.image_url);
  const [liked, setLiked] = useState(false);

  const item = outfit.outfit_items?.[0];
  const products = item?.affiliate_products ?? [];
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function checkLiked() {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", userId)
        .eq("outfit_id", outfit.id)
        .maybeSingle(); // ⚠️ single() 쓰면 안 됨

      if (data) setLiked(true);
    }

    checkLiked();
  }, [userId, outfit.id]);

  // 2. 하트 클릭
  const toggleLike = async () => {
    if (!userId) {
      alert("로그인이 필요합니다");
      return;
    }

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("outfit_id", outfit.id);
      setLiked(false);
    } else {
      await supabase.from("likes").insert({
        user_id: userId,
        outfit_id: outfit.id,
      });
      setLiked(true);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden relative">
      {/* 이미지 */}
      <img
        src={outfit.image_url?.trim()}
        alt={outfit.description}
        className="w-full h-[400px] object-cover"
      />
      {/* 하트 */}
      <button
        onClick={toggleLike}
        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
      >
        <Heart
          className={`w-5 h-5 ${
            liked ? "fill-red-500 stroke-red-500" : "stroke-gray-600"
          }`}
        />
      </button>
      {/* 정보 */}
      <div className="p-4 space-y-3">
        <div className="text-sm text-gray-500">{outfit.celebrities?.name}</div>

        <div className="font-medium">{outfit.description}</div>

        <ul className="space-y-2">
          {products.map((p: any) => (
            <li key={p.id}>
              <a
                href={p.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-50"
              >
                <span className="text-sm font-medium">
                  View similar products on Ably
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
