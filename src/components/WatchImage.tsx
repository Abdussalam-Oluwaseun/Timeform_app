import { useState } from "react";
import { cn } from "@/lib/utils";

interface WatchImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Rounded corner style — "default" uses the muted surface, "light" suits dark panels. */
  variant?: "default" | "light";
}

/**
 * Product image with a graceful fallback label when the remote asset
 * fails to load or is missing.
 */
export function WatchImage({ src, alt, className, variant = "default" }: WatchImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl select-none",
        variant === "light"
          ? "bg-panel-secondary/50 text-panel-muted"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        <span className="px-[12px] text-center text-[length:var(--text-100)] font-medium uppercase tracking-[0.12em]">
          {alt}
        </span>
      )}
    </div>
  );
}
