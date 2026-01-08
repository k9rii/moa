import { useEffect, useState } from "react";
import { fetchOutfits } from "../lib/outfits";
import { ItemCard } from "./ItemCard";

type ViewMode = "all" | "group";

type Celebrity = {
  id: string;
  name: string;
  group_name?: string | null;
};

type Outfit = {
  id: string;
  celebrities?: Celebrity | Celebrity[] | null;
};

export function Home() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOutfits()
      .then((data) => {
        setOutfits((data as Outfit[]) ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /**
   * ✅ 그룹 분류 (객체/배열 모두 대응)
   */
  const groupedByGroup = outfits.reduce<Record<string, Outfit[]>>(
    (acc, outfit) => {
      const celeb = Array.isArray(outfit.celebrities)
        ? outfit.celebrities[0]
        : outfit.celebrities;

      const groupName = celeb?.group_name ?? "Others";
      const key = groupName.trim().toLowerCase();

      if (!acc[key]) acc[key] = [];
      acc[key].push(outfit);
      return acc;
    },
    {}
  );

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const normalizeGroupName = (name: string) =>
    name === "others" ? "OTHERS" : name.toUpperCase();

  if (loading) {
    return <div className="min-h-screen p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-0 px-6">
      {/* View mode toggle */}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded border ${
            viewMode === "all" ? "bg-black text-white" : ""
          }`}
          onClick={() => setViewMode("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded border ${
            viewMode === "group" ? "bg-black text-white" : ""
          }`}
          onClick={() => setViewMode("group")}
        >
          By Group
        </button>
      </div>

      {/* Content */}
      {viewMode === "all" ? (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {outfits.map((outfit) => (
            <ItemCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByGroup).map(([groupName, items]) => {
            const isOpen = openGroups[groupName] ?? true;

            return (
              <section key={groupName} className="border rounded">
                <button
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold"
                  onClick={() => toggleGroup(groupName)}
                >
                  <span>{normalizeGroupName(groupName)}</span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {items.map((outfit) => (
                        <ItemCard key={outfit.id} outfit={outfit} />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
