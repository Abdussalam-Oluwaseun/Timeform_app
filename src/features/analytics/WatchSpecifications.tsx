import { Card } from "@/components/Card";
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
 * Specifications card with four real product attributes — same card
 * treatment as the KPI and chart cards above it.
 */
export function WatchSpecifications({ product }: WatchSpecificationsProps) {
  return (
    <Card title="SPECIFICATIONS" subtitle="Key attributes" bodyClassName="pt-[8px]">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-[16px]">
        <SpecItem label="GENDER" value={product.gender.toUpperCase()} />
        <SpecItem label="UNIT PRICE" value={formatCurrency(product.price)} />
        <SpecItem label="BRAND" value={product.brand.toUpperCase()} />
        <SpecItem label="MODEL" value={product.name.toUpperCase()} />
      </div>
    </Card>
  );
}

function SpecItem({ label, value }: SpecItemProps) {
  return (
    <div className="flex flex-col items-start justify-center px-[24px] py-[16px] bg-secondary rounded-xl">
      <span className="text-[length:var(--text-100)] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-[4px]">
        {label}
      </span>
      <span className="text-[length:var(--text-300)] font-semibold text-foreground uppercase tracking-[0.04em] truncate w-full">
        {value}
      </span>
    </div>
  );
}
