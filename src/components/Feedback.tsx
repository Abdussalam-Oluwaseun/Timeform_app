import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  /** Height of the skeleton block in px. */
  height?: number;
  className?: string;
}

/** Pulsing placeholder shown while async data is loading. */
export function LoadingSkeleton({ height = 280, className }: LoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("w-full rounded-lg bg-muted animate-pulse", className)}
      style={{ height }}
    />
  );
}

interface ErrorBannerProps {
  message: string;
  className?: string;
}

/** Destructive-styled banner for query failures. */
export function ErrorBanner({ message, className }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border border-destructive/30 bg-destructive/5 text-destructive px-[16px] py-[12px] text-[length:var(--text-200)]",
        className,
      )}
    >
      {message}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  className?: string;
}

/** Centered muted message when a query returns no rows. */
export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-full min-h-[120px] text-muted-foreground text-[length:var(--text-200)]",
        className,
      )}
    >
      {message}
    </div>
  );
}
