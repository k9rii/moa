import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { ItemDetail } from "./components/ItemDetail";
import { MyPage } from "./components/MyPage";
import { TopNav } from "./components/TopNav";

function App() {
  return (
    <BrowserRouter>
      <TopNav /> {/* 항상 고정 */}
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/outfit/:id" element={<ItemDetail />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
