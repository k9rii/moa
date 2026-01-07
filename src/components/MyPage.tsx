import { useEffect, useState, useRef } from "react";
import { ItemCard } from "./ItemCard";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { AVATAR_IMAGE } from "../lib/storage";
import { User } from "lucide-react";

export function MyPage() {
  const [likedOutfits, setLikedOutfits] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      const user = session.user;
      setEmail(user.email ?? "");
      setDisplayName(user.user_metadata?.display_name || user.email || "");
      setAvatarPath(user.user_metadata?.avatar_url ?? null);

      const { data: likes } = await supabase
        .from("likes")
        .select(
          `outfit:outfits (
            id,
            image_url,
            description,
            celebrities ( name, group_name )
          )`
        )
        .eq("user_id", user.id);

      setLikedOutfits(likes?.map((l) => l.outfit) ?? []);
    };

    init();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const handleSaveName = async () => {
    await supabase.auth.updateUser({
      data: { display_name: displayName },
    });
    setIsEditingName(false);
    window.dispatchEvent(new Event("profile-updated"));
  };

  const handleAvatarChange = async (file: File) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;

    const user = data.session.user;
    const ext = file.name.split(".").pop();
    const fileName = `${user.id}.${ext}`;

    await supabase.storage.from("avatars").upload(fileName, file, {
      upsert: true,
    });

    await supabase.auth.updateUser({
      data: { avatar_url: fileName },
    });

    setAvatarPath(fileName);
    window.dispatchEvent(new Event("profile-updated"));
  };

  return (
    <div className="min-h-screen py-12 space-y-12">
      {/* Profile */}
      <section className="flex items-center gap-6">
        <div
          className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {avatarPath ? (
            <img
              src={AVATAR_IMAGE(avatarPath)}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-gray-400" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              e.target.files && handleAvatarChange(e.target.files[0])
            }
          />
        </div>

        <div className="flex-1">
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border px-3 py-1 rounded text-sm"
              />
              <button
                onClick={handleSaveName}
                className="text-sm text-blue-600"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <h2 className="text-xl font-semibold">{displayName}</h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-sm text-gray-400"
              >
                Edit
              </button>
            </div>
          )}
          <p className="text-sm text-gray-400">{email}</p>
          <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded">
            Style analysis coming soon
          </span>
        </div>

        <button onClick={handleLogout} className="text-sm text-red-500">
          Log out
        </button>
      </section>

      <div className="h-px bg-gray-200 my-12" />

      {/* Saved outfits */}
      <section>
        <h1 className="text-2xl font-semibold mb-6">Saved outfits</h1>
        {likedOutfits.length === 0 ? (
          <p className="text-gray-400">You have no saved items yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {" "}
            {likedOutfits.map((outfit) => (
              <ItemCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
//커밋
