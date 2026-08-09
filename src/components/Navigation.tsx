import { cn } from "@/lib/utils";
import { useContext } from "react";
import { ThemeContext } from "@/hooks/theme.context";
import { Sun, Moon } from "lucide-react";

type ViewId = "collection" | "analytics" | "dashboard";
type NavVariant = "default" | "overlay";

interface NavigationProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  /** "overlay" makes the nav transparent so the dark product panel shows through. */
  variant?: NavVariant;
}

const NAV_ITEMS: { id: ViewId; label: string }[] = [
  { id: "collection", label: "Collection" },
  { id: "analytics", label: "Performance" },
  { id: "dashboard", label: "Dashboard" },
];

/**
 * Top navigation bar with three views and a theme toggle.
 *
 * Default: background with bottom border.
 * Overlay: transparent — used on the analytics page so the dark product
 * panel extends behind the nav.
 */
export function Navigation({ activeView, onNavigate, variant = "default" }: NavigationProps) {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const isOverlay = variant === "overlay";

  return (
    <nav
      className={cn(
        "flex items-center justify-between px-[48px] py-[18px]",
        isOverlay
          ? "bg-transparent border-b border-transparent"
          : "bg-background border-b border-border",
      )}
    >
      {/* Brand — always sits over the dark product panel on the analytics view */}
      <span
        className={cn(
          "text-[length:var(--text-300)] font-semibold tracking-[0.08em] uppercase",
          isOverlay ? "text-panel-foreground" : "text-foreground",
        )}
      >
        <span className={cn("mr-[6px]", isOverlay ? "text-panel-muted" : "text-muted-foreground")}>~</span>
        TIMEFORM
      </span>

      {/* Nav items + theme toggle — the right cluster sits over the light
          analytics content, so it always uses the default foreground colors */}
      <div className="flex items-center gap-[32px]">
        <div className="flex items-center gap-[24px]">
          {NAV_ITEMS.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "text-[length:var(--text-200)] font-semibold tracking-[0.04em] transition-colors duration-200 cursor-pointer bg-transparent border-none p-0",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center justify-center w-[32px] h-[32px] rounded-md bg-transparent border-none cursor-pointer transition-colors duration-200",
            "text-muted-foreground hover:text-foreground",
          )}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
}
