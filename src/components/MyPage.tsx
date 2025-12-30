import { User } from 'lucide-react';
import { items } from '../data/mockData';
import { ItemCard } from './ItemCard';

interface MyPageProps {
  savedItems: Set<string>;
  onItemClick: (itemId: string) => void;
  onToggleSave: (itemId: string) => void;
}

export function MyPage({ savedItems, onItemClick, onToggleSave }: MyPageProps) {
  const savedItemsArray = items.filter(item => savedItems.has(item.id));

  // Calculate taste analytics
  const tagCounts = new Map<string, number>();
  savedItemsArray.forEach(item => {
    item.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  return (
    <div className="min-h-screen px-6 md:px-12 py-12 max-w-7xl mx-auto">
      {/* Profile Section */}
      <div className="mb-16">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center">
            <User className="w-10 h-10 text-violet-400" />
          </div>
          <div>
            <h1 className="text-4xl mb-2">My Page</h1>
            <p className="text-gray-500">나만의 취향 요약</p>
          </div>
        </div>

        {/* Taste Analytics */}
        {topTags.length > 0 && (
          <div className="p-6 bg-gradient-to-br from-violet-50 via-blue-50 to-gray-50 rounded-2xl">
            <p className="text-lg text-gray-700">
              당신은{' '}
              <span className="text-violet-600">
                {topTags.join(' · ')}
              </span>
              {' '}아이템을 자주 저장했어요
            </p>
          </div>
        )}
      </div>

      {/* Saved Items */}
      <div>
        <h2 className="text-2xl mb-8">
          Saved Items
          <span className="ml-3 text-lg text-gray-400">
            {savedItemsArray.length}
          </span>
        </h2>

        {savedItemsArray.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {savedItemsArray.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => onItemClick(item.id)}
                isSaved={true}
                onToggleSave={() => onToggleSave(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400">아직 저장한 아이템이 없습니다</p>
            <p className="text-sm text-gray-400 mt-2">
              마음에 드는 아이템을 저장해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
