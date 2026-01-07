import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ItemCard } from "@/components/ItemCard";

type Celebrity = {
  name: string;
  group_name: string | null;
};

type Outfit = {
  id: string;
  image_url: string;
  description: string | null;
  celebrities: Celebrity | null;
};

const normalizeOutfit = (raw: any): Outfit => ({
  id: raw.id,
  image_url: raw.image_url,
  description: raw.description,
  celebrities: Array.isArray(raw.celebrities)
    ? (raw.celebrities[0] ?? null)
    : (raw.celebrities ?? null),
});

export function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const scope = params.get("scope") ?? "all";
  const navigate = useNavigate();

  const setScope = (nextScope: "all" | "mine") => {
    const next = new URLSearchParams(params);
    next.set("scope", nextScope);
    navigate(`/search?${next.toString()}`);
  };

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Outfit[]>([]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);

      // scope === all
      if (scope === "all") {
        const { data, error } = await supabase.from("outfits").select(
          `
            id,
            image_url,
            description,
            celebrities (
              name,
              group_name
            )
          `
        );

        if (!error && data) {
          const normalized = data.map(normalizeOutfit);

          const filtered = normalized.filter((o) => {
            const celeb = o.celebrities;
            const q = query.toLowerCase();

            return (
              (o.description ?? "").toLowerCase().includes(q) ||
              celeb?.name.toLowerCase().includes(q) ||
              celeb?.group_name?.toLowerCase().includes(q)
            );
          });

          setResults(filtered);
        }
      }

      // scope === mine
      if (scope === "mine") {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("likes")
          .select(
            `
            outfits (
              id,
              image_url,
              description,
              celebrities (
                name,
                group_name
              )
            )
          `
          )
          .eq("user_id", user.id);

        if (!error && data) {
          const normalized =
            data
              ?.flatMap((row: { outfits: any[] | null }) => row.outfits ?? [])
              .map(normalizeOutfit) ?? [];

          const filtered = normalized.filter((o) => {
            const celeb = o.celebrities;
            const q = query.toLowerCase();

            return (
              (o.description ?? "").toLowerCase().includes(q) ||
              celeb?.name.toLowerCase().includes(q) ||
              celeb?.group_name?.toLowerCase().includes(q)
            );
          });

          setResults(filtered);
        }
      }

      setLoading(false);
    };

    fetchResults();
  }, [query, scope]);

  return (
    <main className="min-h-screen pt-10 px-4">
      <h1 className="text-lg font-semibold leading-tight mb-1">
        Search results for "{query}"
      </h1>

      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 text-sm max-w-md">
        <button
          onClick={() => setScope("all")}
          className={`w-full rounded-lg py-2.5 font-medium transition ${
            scope === "all"
              ? "bg-white text-black shadow"
              : "text-gray-500 hover:bg-white/70"
          }`}
        >
          All results
        </button>

        <button
          onClick={() => setScope("mine")}
          className={`w-full rounded-lg py-2.5 font-medium transition ${
            scope === "mine"
              ? "bg-white text-black shadow"
              : "text-gray-500 hover:bg-white/70"
          }`}
        >
          My MOA results
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {scope === "mine"
          ? "Searching within your saved outfits"
          : "Searching all outfits"}
      </p>

      {loading && <p className="mt-4 text-sm">Loading...</p>}

      {!loading && results.length === 0 && (
        <p className="mt-4 text-sm text-gray-400">No results found.</p>
      )}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {" "}
        {results.map((outfit) => (
          <div
            key={outfit.id}
            onClick={() => navigate(`/item/${outfit.id}`)}
            className="cursor-pointer"
          >
            <ItemCard outfit={outfit} />
          </div>
        ))}
      </div>
    </main>
  );
}
//커밋
