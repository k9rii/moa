import { useEffect, useState } from "react";
import { ItemCard } from "./ItemCard";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export function MyPage() {
  const [likedOutfits, setLikedOutfits] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLikedOutfits() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      const user = session.user;

      const { data, error } = await supabase
        .from("likes")
        .select(
          `
        outfit:outfits (
          id,
          image_url,
          description,
          celebrities ( name )
        )
      `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      setLikedOutfits(data?.map((l) => l.outfit) ?? []);
    }

    fetchLikedOutfits();
  }, [navigate]);

  return (
    <div className="min-h-screen py-12">
      <h1 className="text-3xl font-semibold mb-8">My Page</h1>

      {likedOutfits.length === 0 ? (
        <p className="text-gray-400">You have no saved items yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {likedOutfits.map((outfit) => (
            <ItemCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      )}
    </div>
  );
}
