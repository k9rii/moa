import { Heart, ExternalLink } from "lucide-react";

interface ItemDetailProps {
  outfit: any;
  onToggleSave: (outfitId: string) => void;
  savedItems: Set<string>;
}

export function ItemDetail({
  outfit,
  savedItems,
  onToggleSave,
}: ItemDetailProps) {
  if (!outfit) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={outfit.image_url}
              alt={outfit.description}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onToggleSave(outfit.id)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  savedItems.has(outfit.id)
                    ? "fill-violet-400 stroke-violet-400"
                    : "stroke-gray-800"
                }`}
              />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
              {outfit.celebrities?.name}'s Pick
            </p>
            <h1 className="text-4xl md:text-5xl mb-6">{outfit.description}</h1>

            {/* Link Button */}
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
    </div>
  );
}
