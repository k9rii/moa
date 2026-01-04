import { useEffect, useState } from "react";
import { fetchOutfits } from "../lib/outfits";
import { ItemCard } from "./ItemCard";

export function Home() {
  const [outfits, setOutfits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutfits()
      .then((data) => {
        setOutfits(data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {outfits.map((outfit) => (
          <ItemCard key={outfit.id} outfit={outfit} />
        ))}
      </div>
    </div>
  );
}
