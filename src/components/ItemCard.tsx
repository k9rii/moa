import { Heart } from 'lucide-react';
import { Item } from '../data/mockData';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export function ItemCard({ item, onClick, isSaved, onToggleSave }: ItemCardProps) {
  return (
    <div 
      className="group relative cursor-pointer transition-all duration-300 hover:opacity-95"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={item.image} 
          alt={item.category}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
            {item.category}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-white"
        >
          <Heart 
            className={`w-4 h-4 transition-all ${
              isSaved 
                ? 'fill-violet-400 stroke-violet-400' 
                : 'stroke-gray-800'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
