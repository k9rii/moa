import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { ItemDetail } from "./components/ItemDetail";
import { MyPage } from "./components/MyPage";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import { GlobalLayout } from "./components/layout/GlobalLayout";
import { Search } from "./components/Search";

function App() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/outfit/:id" element={<ItemDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
      </Route>
    </Routes>
  );
}

export default App;
