import type { CatalogProduct } from "@/lib/catalog";
import { formatCurrency } from "@/lib/catalog";

interface WatchSpecificationsProps {
  product: CatalogProduct;
}

interface SpecItemProps {
  label: string;
  value: string;
}

/**
 * Horizontal specifications strip — single rounded card with a subtle
 * border, four equally-spaced label/value columns inside.
 */
export function WatchSpecifications({ product }: WatchSpecificationsProps) {
  return (
    <div className="bg-secondary border border-border rounded-2xl px-[32px] py-[20px] grid grid-cols-4 gap-[16px]">
      <SpecItem label="GENDER" value={product.gender.toUpperCase()} />
      {/* <SpecItem label="UNIT PRICE" value={formatCurrency(product.price)} /> */}
      <SpecItem label="BRAND" value={product.brand.toUpperCase()} />
      <SpecItem label="MODEL" value={product.name.toUpperCase()} />
    </div>
  );
}

function SpecItem({ label, value }: SpecItemProps) {
  return (
    <div className="flex flex-col items-start justify-center">
      <span className="text-[length:var(--text-100)] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-[4px]">
        {label}
      </span>
      <span className="text-[length:var(--text-300)] font-semibold text-foreground uppercase tracking-[0.02em] truncate w-full">
        {value}
      </span>
    </div>
  );
}
