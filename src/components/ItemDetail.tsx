import { Heart, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // navigate 추가

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]); // 추천 목록 상태

  useEffect(() => {
    if (!id) return;

    // 초기화 및 상단 이동
    setOutfit(null);
    setRecommendations([]);
    window.scrollTo(0, 0);

    async function fetchDetailAndRecs() {
      // 1. 현재 아이템 상세 정보
      const { data: outfitData } = await supabase
        .from("outfits")
        .select(
          `
          id,
          image_url,
          description,
          instagram_post_url,
          celebrities ( name, group_name ),
          outfit_items (
            id, sub_category, material, color, pattern, embedding, 
            affiliate_products ( id, product_name, affiliate_url )
          )
        `
        )
        .eq("id", id)
        .single();

      if (outfitData) {
        setOutfit(outfitData);

        // 2. 유사 게시물 추천 호출
        let currentEmbedding = outfitData.outfit_items?.[0]?.embedding;
        if (typeof currentEmbedding === "string") {
          try {
            currentEmbedding = JSON.parse(currentEmbedding);
          } catch (e) {
            // ignore JSON parse error
          }
        }

        if (currentEmbedding) {
          const { data: recData } = await supabase.rpc("match_outfits", {
            query_embedding: currentEmbedding,
            match_threshold: 0.4,
            current_outfit_id: id,
          });
          setRecommendations(recData || []);
        }
      }
    }
    fetchDetailAndRecs();
  }, [id]);

  if (!outfit)
    return (
      <div className="pt-40 text-center text-gray-400">
        Loading MOA Style...
      </div>
    );

  return (
    <div className="pt-20 pb-24 px-6" key={id}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* ✅ 이미지 영역 */}
        <div className="w-full">
          <img
            src={outfit.image_url}
            alt=""
            className="w-full max-h-[520px] md:max-h-[640px] object-cover rounded-2xl shadow-sm"
          />
        </div>

        {/* ✅ 정보 영역 */}
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

          <div>
            <h1 className="text-3xl font-semibold mb-3">
              {outfit.description}
            </h1>
            <div className="flex flex-wrap gap-2 mt-4">
              {outfit.outfit_items?.[0] && (
                <>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-full border border-gray-200 uppercase tracking-wider">
                    #{outfit.outfit_items[0].sub_category}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                    #{outfit.outfit_items[0].material}
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[11px] font-bold rounded-full border border-purple-100 uppercase tracking-wider">
                    #{outfit.outfit_items[0].color}
                  </span>
                  {outfit.outfit_items[0].pattern !== "solid" && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-100 uppercase tracking-wider">
                      #{outfit.outfit_items[0].pattern}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="pt-2">
            <h2 className="text-lg font-semibold mb-3">
              Similar items on ABLY
            </h2>
            <div className="space-y-3">
              {outfit.outfit_items?.[0]?.affiliate_products?.map((p: any) => (
                <a
                  key={p.id}
                  href={p.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-6 py-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
                >
                  <span className="flex-1 text-sm font-medium text-gray-800 line-clamp-2">
                    {p.product_name}
                  </span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              ))}
            </div>
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

      {/* 배송 대행 업체 정보 */}
      <div className="max-w-5xl mx-auto mt-8 text-sm text-gray-400 leading-snug italic">
        <p>
          Some items do not support international shipping. In this case, you
          can place an order through a purchasing agent or use an international
          parcel forwarding service:
        </p>

        <ul className="list-disc list-inside mt-2 space-y-1 not-italic">
          <li>
            <a
              href="https://post.malltail.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 hover:underline transition-colors"
            >
              Malltail — international shopping & parcel forwarding
            </a>
          </li>
          <li>
            <a
              href="https://www.worldexpress.link/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 hover:underline transition-colors"
            >
              WorldExpress — global parcel forwarding service
            </a>
          </li>
          <li>
            <a
              href="https://www.delivered.co.kr/en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 hover:underline transition-colors"
            >
              Delivered Korea — international purchasing & shipping
            </a>
          </li>
          <li>
            <a
              href="https://forward2me.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 hover:underline transition-colors"
            >
              Forward2me — worldwide package forwarding
            </a>
          </li>
        </ul>

        <p className="mt-2">
          Availability, fees, and supported countries vary by provider. Please
          check each service for details before ordering.
        </p>
      </div>

      {/* 유사 게시물 추천 */}
      <div className="max-w-5xl mx-auto mt-12 border-t pt-12">
        <h2 className="text-xl font-semibold mb-8">
          Similar celebrity outfits
        </h2>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <div
                key={item.res_id}
                className="group cursor-pointer"
                onClick={() => navigate(`/outfit/${item.res_id}`)}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 border border-gray-100">
                  <img
                    src={item.res_image_url}
                    alt={item.res_celebrity_name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-gray-900">
                    {item.res_celebrity_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-500 font-medium">
                      {item.res_sub_category}
                    </span>
                    <span className="text-[10px] text-blue-500 font-bold">
                      {Math.round(item.res_total_score * 100)}% match
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 text-sm">
            No similar outfits found yet.
          </div>
        )}
      </div>
    </div>
  );
}
