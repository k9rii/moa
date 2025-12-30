import { Heart, ExternalLink } from 'lucide-react';
import { items, members } from '../data/mockData';

interface ItemDetailProps {
  itemId: string;
  onItemClick: (itemId: string) => void;
  savedItems: Set<string>;
  onToggleSave: (itemId: string) => void;
}

export function ItemDetail({ itemId, onItemClick, savedItems, onToggleSave }: ItemDetailProps) {
  const item = items.find(i => i.id === itemId);
  
  if (!item) return null;

  const member = members.find(m => m.id === item.memberId);
  const relatedItems = items
    .filter(i => i.id !== itemId && i.tags.some(tag => item.tags.includes(tag)))
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
            <img 
              src={item.image} 
              alt={item.category}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onToggleSave(item.id)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <Heart 
                className={`w-5 h-5 transition-all ${
                  savedItems.has(item.id)
                    ? 'fill-violet-400 stroke-violet-400' 
                    : 'stroke-gray-800'
                }`}
              />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
              {member?.name}'s Pick
            </p>
            <h1 className="text-4xl md:text-5xl mb-6">
              {item.category}
            </h1>

            {/* Tags */}
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-3">Taste Tags</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-gradient-to-br from-violet-50 to-blue-50 text-violet-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <p className="text-2xl text-gray-800">{item.price}</p>
            </div>

            {/* Link Button */}
            <a
              href={item.productUrl}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full transition-all duration-200 hover:bg-gray-800 hover:shadow-lg"
            >
              <span>실제 판매 페이지</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div>
            <h2 className="text-2xl mb-8">Similar Mood Picks</h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {relatedItems.map((relatedItem) => (
                  <div
                    key={relatedItem.id}
                    onClick={() => onItemClick(relatedItem.id)}
                    className="w-64 cursor-pointer group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-3">
                      <img 
                        src={relatedItem.image} 
                        alt={relatedItem.category}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{relatedItem.category}</p>
                    <p className="text-gray-800">{relatedItem.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
