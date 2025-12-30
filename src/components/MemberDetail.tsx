import { useState } from 'react';
import { members, items } from '../data/mockData';
import { ItemCard } from './ItemCard';
import { ChevronLeft } from 'lucide-react';

interface MemberDetailProps {
  memberId: string;
  onItemClick: (itemId: string) => void;
  savedItems: Set<string>;
  onToggleSave: (itemId: string) => void;
}

export function MemberDetail({ memberId, onItemClick, savedItems, onToggleSave }: MemberDetailProps) {
  const member = members.find(m => m.id === memberId);
  const memberItems = items.filter(item => item.memberId === memberId);
  
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (!member) return null;

  const allTags = ['전체', ...member.tags];
  const filteredItems = selectedTag && selectedTag !== '전체'
    ? memberItems.filter(item => item.tags.includes(selectedTag))
    : memberItems;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-gradient-to-br from-violet-100 via-blue-50 to-gray-100">
        <img 
          src={member.image} 
          alt={member.name}
          className="w-full h-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
          <h1 className="text-4xl md:text-5xl mb-2 uppercase tracking-tight">
            {member.name}
          </h1>
          <p className="text-gray-600">
            {member.name}의 실착 아이템을 기반으로 한 취향
          </p>
        </div>
      </div>

      <div className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
        {/* Tag Filter */}
        <div className="mb-10 overflow-x-auto pb-4">
          <div className="flex gap-2 min-w-max">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === '전체' ? null : tag)}
                className={`px-5 py-2.5 rounded-full text-sm transition-all duration-200 whitespace-nowrap ${
                  (tag === '전체' && !selectedTag) || tag === selectedTag
                    ? 'bg-gradient-to-r from-violet-400 to-blue-400 text-white shadow-lg shadow-violet-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Item Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onItemClick(item.id)}
              isSaved={savedItems.has(item.id)}
              onToggleSave={() => onToggleSave(item.id)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            해당 태그의 아이템이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
