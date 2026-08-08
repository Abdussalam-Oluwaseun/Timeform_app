/**
 * Collection page heading with title and subtitle.
 */
export function CollectionHeader() {
  return (
    <div className="px-[48px] pt-[32px] pb-[12px]">
      <h1 className="text-[length:34px] font-semibold leading-[42px] text-foreground m-0">
        Watch Collection
      </h1>
      <p className="text-[length:var(--text-100)] font-semibold text-muted-foreground mt-[6px] m-0">
        Twelve smart timepieces, six months of sales, one performance view.
      </p>
    </div>
  );
}
