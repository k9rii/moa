import { members, items } from '../data/mockData';
import { ItemCard } from './ItemCard';

interface HomeProps {
  onMemberClick: (memberId: string) => void;
  onItemClick: (itemId: string) => void;
  savedItems: Set<string>;
  onToggleSave: (itemId: string) => void;
}

export function Home({ onMemberClick, onItemClick, savedItems, onToggleSave }: HomeProps) {
  return (
    <div className="min-h-screen px-6 md:px-12 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl mb-3 tracking-tight">aespa's closet</h1>
        <p className="text-gray-500 text-lg">실착 기반 취향 아카이브</p>
      </header>

      {/* Member Sections */}
      <div className="space-y-20">
        {members.map((member) => {
          const memberItems = items.filter(item => item.memberId === member.id);
          
          return (
            <section key={member.id} className="space-y-8">
              {/* Member Header */}
              <div 
                onClick={() => onMemberClick(member.id)}
                className="flex items-center gap-6 cursor-pointer group"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-violet-200">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl mb-2 uppercase tracking-tight">
                    {member.name}
                  </h2>
                  <p className="text-gray-500">
                    {member.tasteDescription}
                  </p>
                </div>
              </div>

              {/* Item Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {memberItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => onItemClick(item.id)}
                    isSaved={savedItems.has(item.id)}
                    onToggleSave={() => onToggleSave(item.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
