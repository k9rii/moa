import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

export function ItemCard({ outfit }: { outfit: any }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("outfit_id", outfit.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setLiked(true);
      });
  }, [userId, outfit.id]);

  const toggleLike = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); //카드 클릭 방지

    if (!userId) {
      navigate("/login");
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
    <div
      onClick={() => navigate(`/outfit/${outfit.id}`)}
      className="relative cursor-pointer overflow-hidden rounded-xl"
    >
      <img
        src={outfit.image_url}
        alt=""
        className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform"
      />

      {/* 하트 */}
      <button
        onClick={toggleLike}
        className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full"
      >
        <Heart
          className={`w-5 h-5 ${
            liked ? "fill-red-500 stroke-red-500" : "stroke-gray-700"
          }`}
        />
      </button>

      {/* 연예인 이름 */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
        <div className="text-white text-sm font-medium">
          <span>{outfit.celebrities?.name}</span>
          {outfit.celebrities?.group_name && (
            <span className="ml-1 text-white/70 text-xs">
              · {outfit.celebrities.group_name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
