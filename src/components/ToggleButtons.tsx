import { cn } from "@/lib/utils";

interface ToggleButtonProps {
  labels: readonly string[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

/**
 * Segmented toggle pill group (e.g. Revenue / Units Sold).
 * The active segment is filled with the accent color.
 */
export function ToggleButtons({ labels, activeIndex, onChange, className }: ToggleButtonProps) {
  return (
    <div
      className={cn(
        "flex items-center bg-secondary rounded-md overflow-hidden shrink-0",
        className,
      )}
      role="tablist"
    >
      {labels.map((label, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={label}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(index)}
            className={cn(
              "px-[16px] py-[6px] text-[length:var(--text-100)] font-medium border-none cursor-pointer transition-all duration-200",
              active
                ? "bg-accent text-accent-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
