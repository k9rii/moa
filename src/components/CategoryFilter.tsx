import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "group", label: "By Group" },
  { id: "top", label: "Top" },
  { id: "outer", label: "Outer" },
  { id: "skirt", label: "Skirt" },
  { id: "dress", label: "Dress" },
  { id: "pants", label: "Pants" },
  { id: "accessory", label: "Accessory" },
];

interface CategoryFilterProps {
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
}

export default function CategoryFilter({
  selectedFilter,
  onSelectFilter,
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-2 min-w-max px-1">
        {FILTERS.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectFilter(filter.id)}
            className={cn(
              "rounded-full px-4 text-sm font-medium transition-colors h-9",
              selectedFilter === filter.id
                ? "bg-[#F26B83] hover:bg-[#F26B83]/90 text-white border-transparent shadow-sm"
                : "text-gray-500 border-gray-200 hover:text-[#F26B83] hover:border-[#F26B83] bg-white"
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
