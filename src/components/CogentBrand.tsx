/**
 * COGENT bi brand watermark.
 *
 * Positioned absolutely in the bottom-right corner of each view.
 */
export function CogentBrand() {
  return (
    <div className="absolute bottom-[20px] right-[32px] select-none pointer-events-none">
      <span className="text-[length:var(--text-200)] font-semibold tracking-[0.06em] text-muted-foreground">
        COGENT{" "}
      </span>
      <span className="text-[length:var(--text-200)] font-bold tracking-[0.06em] text-accent">
        bi
      </span>
    </div>
  );
}
