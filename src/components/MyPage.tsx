import { useEffect, useState, useRef } from "react";
import { ItemCard } from "./ItemCard";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { AVATAR_IMAGE } from "../lib/storage";
import { User, Sparkles, Loader2, Heart, Edit2, Check } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export function MyPage() {
  const [likedOutfits, setLikedOutfits] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<{
    title: string;
    desc: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
          `
          outfit:outfits (
            id, image_url, description, 
            celebrities ( name, group_name ),
            outfit_items ( sub_category, material, color, pattern )
          )
        `,
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
    await supabase.auth.updateUser({ data: { display_name: displayName } });
    setIsEditingName(false);
    window.dispatchEvent(new Event("profile-updated"));
  };

  const handleAvatarChange = async (file: File) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    const user = data.session.user;
    const fileName = `${user.id}.${file.name.split(".").pop()}`;
    await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });
    await supabase.auth.updateUser({ data: { avatar_url: fileName } });
    setAvatarPath(fileName);
    window.dispatchEvent(new Event("profile-updated"));
  };

  //구글 API로 직접 호출(Gemma-3-4b)
  const handleAIAnalysis = async () => {
    if (likedOutfits.length === 0) return;
    setIsAnalyzing(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemma-3-4b-it" });

      const styleString = likedOutfits
        .map((o) => {
          const item = o.outfit_items?.[0];
          if (!item || !item.sub_category) return null;
          return `${item.color || ""} ${item.material || ""} ${item.sub_category}`;
        })
        .filter(Boolean)
        .join(", ");

      const prompt = `
        You are a professional fashion stylist. 
        Analyze these items: [${styleString}]
        Return a JSON object only with "title" (creative style name) and "desc" (one-sentence sophisticated description).
        Example: {"title": "Urban Minimalist", "desc": "A sleek aesthetic focused on clean lines and neutral tones."}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{.*\}/s);
      if (jsonMatch) {
        setAnalysis(JSON.parse(jsonMatch[0]));
      }
    } catch (error) {
      console.error("AI Analysis Error:", error);
      alert("AI analysis is temporarily unavailable.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 space-y-12 max-w-5xl mx-auto px-4">
      <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        {/* User Info */}
        <div
          className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-white shadow-sm shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          {avatarPath ? (
            <img
              src={AVATAR_IMAGE(avatarPath)}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-gray-300" />
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

        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
            {isEditingName ? (
              <>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border-b-2 border-blue-400 px-1 py-0.5 text-xl font-bold focus:outline-none w-40"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Check className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800">
                  {displayName}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-gray-300 hover:text-gray-500"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-6 text-center md:text-left">
            {email}
          </p>

          {/* AI Analysis */}
          <div className="min-h-[80px] flex items-center justify-center md:justify-start">
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-xs font-medium text-pink-600 animate-pulse bg-pink-100 px-4 py-3 rounded-2xl">
                <Loader2 className="w-4 h-4 animate-spin" /> Your Own Style...
              </div>
            ) : analysis ? (
              <div className="bg-gradient-to-br from-red-50 to-red-100 text-gray px-6 py-4 rounded-2xl shadow-lg border border-red-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 text-black-400 font-bold text-sm mb-1.5">
                  <Sparkles className="w-4 h-4" /> {analysis.title}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {analysis.desc}
                </p>
                <button
                  onClick={handleAIAnalysis}
                  className="mt-3 text-[10px] text-gray-500 hover:text-white transition-colors underline underline-offset-4"
                >
                  Re-analyze
                </button>
              </div>
            ) : (
              <button
                onClick={handleAIAnalysis}
                className="group flex items-center gap-2.5 px-6 py-3 bg-red-100 text-black rounded-xl text-sm font-bold hover:bg-red-150 transition-all hover:scale-105 shadow-sm border border-red-150"
              >
                <Sparkles className="w-4 h-4 text-pink-600 group-hover:rotate-12 transition-transform" />{" "}
                Generate Style Report
              </button>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 font-medium hover:underline self-center md:self-start"
        >
          Log out
        </button>
      </section>

      <div className="h-px bg-gray-100" />

      {/* Saved outfits */}
      <section>
        <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
          <h1 className="text-2xl font-bold text-gray-800">Saved outfits</h1>
        </div>
        {likedOutfits.length === 0 ? (
          <div className="py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 text-sm">
            No items saved yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {likedOutfits.map((outfit) => (
              <ItemCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
