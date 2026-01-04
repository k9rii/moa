import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Header() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProfileClick = () => {
    navigate(userId ? "/mypage" : "/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-white/80 backdrop-blur-md">
      {/* 🔥 main 과 동일한 컨테이너 */}
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-5xl
          items-center
          justify-between
          px-4
          md:px-8
          lg:px-10
        "
      >
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold tracking-tight">
          MOA
        </Link>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className="
            flex h-9 w-9 items-center justify-center rounded-full
            bg-gradient-to-br from-violet-100 to-blue-100
            transition hover:scale-105
          "
        >
          <User className="h-5 w-5 text-violet-500" />
        </button>
      </div>
    </header>
  );
}
