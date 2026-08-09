import { cn } from "@/lib/utils";

export type GenderFilter = "all" | "Men" | "Women";

interface WatchFiltersProps {
  activeFilter: GenderFilter;
  onFilterChange: (filter: GenderFilter) => void;
}

const FILTERS: { id: GenderFilter; label: string }[] = [
  { id: "all", label: "All Watches" },
  { id: "Men", label: "Men" },
  { id: "Women", label: "Women" },
];

/**
 * Pill-style filter row for watch categories.
 */
export function WatchFilters({ activeFilter, onFilterChange }: WatchFiltersProps) {
  return (
    <div className="flex items-center gap-[8px] px-[48px] pb-[16px]">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "px-[20px] py-[8px] rounded-full text-[length:var(--text-200)] font-semibold",
            "transition-all duration-250 cursor-pointer border-none",
            activeFilter === filter.id
              ? "bg-foreground text-background"
              : "bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
