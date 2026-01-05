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
    instagram_post_url,
    celebrities ( name, group_name ),
    outfit_items (
      affiliate_products (
        id,
        product_name,
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
            <span className="font-semibold text-gray-800">
              {outfit.celebrities?.name}
            </span>
            {outfit.celebrities?.group_name && (
              <span className="ml-1 text-gray-400">
                · {outfit.celebrities.group_name}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-semibold">{outfit.description}</h1>

          <h2 className="text-lg font-semibold">Similar items on ABLY</h2>
          <div className="space-y-3">
            {outfit.outfit_items?.[0]?.affiliate_products?.map((p: any) => (
              <a
                key={p.id}
                href={p.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-6 py-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium text-gray-800 line-clamp-2">
                  {p.product_name}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ))}
          </div>
          <a
            href={outfit.instagram_post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-pink-600 border-pink-200 hover:bg-pink-50 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M7 2C4.239 2 2 4.239 2 7v10c0 2.761 2.239 5 5 5h10c2.761 0 5-2.239 5-5V7c0-2.761-2.239-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a.75.75 0 100 1.5.75.75 0 000-1.5z" />
            </svg>
            View on Instagram
          </a>
        </div>
      </div>
      <div className="mt-24 border-t pt-12">
        <h2 className="text-xl font-semibold mb-6">
          Similar celebrity outfits
        </h2>
        <div className="text-gray-400 text-sm">(Coming soon)</div>
      </div>
    </div>
  );
}
