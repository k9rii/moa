import { useState } from 'react';
import { Home } from './components/Home';
import { MemberDetail } from './components/MemberDetail';
import { ItemDetail } from './components/ItemDetail';
import { MyPage } from './components/MyPage';
import { TopNav } from './components/TopNav';

type Page = 'home' | 'member' | 'item' | 'mypage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const toggleSaveItem = (itemId: string) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const navigateToMember = (memberId: string) => {
    setSelectedMember(memberId);
    setCurrentPage('member');
  };

  const navigateToItem = (itemId: string) => {
    setSelectedItem(itemId);
    setCurrentPage('item');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  const navigateToMyPage = () => {
    setCurrentPage('mypage');
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav 
        onHomeClick={navigateToHome}
        onProfileClick={navigateToMyPage}
      />
      
      <main className="pt-16">
        {currentPage === 'home' && (
          <Home 
            onMemberClick={navigateToMember}
            onItemClick={navigateToItem}
            savedItems={savedItems}
            onToggleSave={toggleSaveItem}
          />
        )}
        {currentPage === 'member' && selectedMember && (
          <MemberDetail 
            memberId={selectedMember}
            onItemClick={navigateToItem}
            savedItems={savedItems}
            onToggleSave={toggleSaveItem}
          />
        )}
        {currentPage === 'item' && selectedItem && (
          <ItemDetail 
            itemId={selectedItem}
            onItemClick={navigateToItem}
            savedItems={savedItems}
            onToggleSave={toggleSaveItem}
          />
        )}
        {currentPage === 'mypage' && (
          <MyPage 
            savedItems={savedItems}
            onItemClick={navigateToItem}
            onToggleSave={toggleSaveItem}
          />
        )}
      </main>
    </div>
  );
}