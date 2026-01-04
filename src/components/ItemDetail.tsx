import { Heart, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function ItemDetail() {
  const { id } = useParams();
  const [outfit, setOutfit] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    supabase
      .from("outfits")
      .select(
        `
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
      `
      )
      .eq("id", id)
      .single()
      .then(({ data }) => setOutfit(data));
  }, [id]);

  if (!outfit) return null;

  return (
    <div className="pt-20 pb-24 px-6">
      {/* 🔑 전체 폭 제한 */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* ✅ 이미지 영역 */}
        <div className="w-full">
          <img
            src={outfit.image_url}
            alt=""
            className="
              w-full
              max-h-[520px]
              md:max-h-[640px]
              object-cover
              rounded-2xl
            "
          />
        </div>

        {/* 정보 영역 */}
        <div className="space-y-6">
          <div className="text-sm text-gray-500">
            {outfit.celebrities?.name}
          </div>

          <h1 className="text-3xl font-semibold">{outfit.description}</h1>

          <div className="space-y-3">
            {outfit.outfit_items?.[0]?.affiliate_products?.map((p: any) => (
              <a
                key={p.id}
                href={p.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-6 py-4 bg-black text-white rounded-full"
              >
                <span>에이블리에서 비슷한 상품 보기</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
