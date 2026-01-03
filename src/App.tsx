import { useState } from "react";
import { Home } from "./components/Home";
import { ItemDetail } from "./components/ItemDetail";
import { MyPage } from "./components/MyPage";
import { TopNav } from "./components/TopNav";

type Page = "home" | "item" | "mypage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const navigateToHome = () => {
    setCurrentPage("home");
    setSelectedItemId(null);
  };

  const navigateToItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setCurrentPage("item");
  };

  const navigateToMyPage = () => {
    setCurrentPage("mypage");
    setSelectedItemId(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav onHomeClick={navigateToHome} onProfileClick={navigateToMyPage} />

      <main className="pt-16">
        {currentPage === "home" && <Home />}

        {currentPage === "item" && selectedItemId && (
          <ItemDetail itemId={selectedItemId} />
        )}

        {currentPage === "mypage" && <MyPage />}
      </main>
    </div>
  );
}
