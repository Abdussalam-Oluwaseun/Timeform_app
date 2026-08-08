import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  subtitle?: string;
  /** Optional element rendered on the right side of the header row. */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Padding for the body area (defaults to 24px horizontal / 20px bottom). */
  bodyClassName?: string;
}

/**
 * Standard surface card used across the app — header row (title + action)
 * above a padded body. Uses the `card` surface token so it adapts to
 * light/dark mode.
 */
export function Card({ title, subtitle, action, children, className, bodyClassName }: CardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-[24px] pt-[20px] pb-[12px]">
          <div className="min-w-0">
            {title && (
              <h3 className="text-[length:var(--text-500)] font-semibold text-foreground m-0 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[length:var(--text-100)] text-muted-foreground m-0 mt-[2px] truncate">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={cn("px-[24px] pb-[20px]", bodyClassName)}>{children}</div>
    </div>
  );
}
