import { User, Search } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { AVATAR_IMAGE } from "@/lib/storage";
import logo from "@/assets/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const scope = location.pathname.startsWith("/mypage") ? "mine" : "all";

  const refreshProfile = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    setUserId(user?.id ?? null);
    setAvatarPath(user?.user_metadata?.avatar_url ?? null);
  };

  useEffect(() => {
    // 최초 1회
    refreshProfile();

    // 로그인 / 로그아웃
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      refreshProfile();
    });

    // 프로필 변경 (아바타 / 이름)
    window.addEventListener("profile-updated", refreshProfile);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("profile-updated", refreshProfile);
    };
  }, []);

  const handleProfileClick = () => {
    navigate(userId ? "/mypage" : "/login");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(searchQuery.trim())}&scope=${scope}`
      );
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-[#fefafb] backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-4xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="MOA logo" className="h-12 object-contain" />
        </Link>

        <div className="mx-4 flex flex-1 max-w-md items-center rounded-full border bg-white px-3 py-1.5 shadow-sm">
          <Search className="mr-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search outfits, styles, or celebrities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        <button
          onClick={handleProfileClick}
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-105"
        >
          {avatarPath ? (
            <img
              src={AVATAR_IMAGE(avatarPath)}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #F26B83 0%, #F29BAB 50%, #F2C2CF 100%)",
              }}
            >
              <User className="h-6 w-6 text-[#FEFAFB]" />
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
