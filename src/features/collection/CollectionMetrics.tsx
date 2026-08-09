import type { CatalogProduct } from "@/lib/catalog";
import { formatCurrency } from "@/lib/catalog";

interface CollectionMetricsProps {
  /** The currently selected watch in the carousel. */
  selectedProduct: CatalogProduct;
  /** Total number of watches in the current filter. */
  totalCount: number;
}

/**
 * Bottom metrics strip showing watch-specific and collection KPIs.
 */
export function CollectionMetrics({ selectedProduct, totalCount }: CollectionMetricsProps) {
  return (
    <div className="px-[48px] pt-[20px] pb-[24px] border-t border-border">
      <div className="flex items-baseline gap-[64px]">
        <MetricItem value={String(totalCount)} label="TIMEPIECES" />
        <MetricItem value={String(selectedProduct.units)} label="UNITS SOLD" />
        <MetricItem value={formatCurrency(selectedProduct.revenue)} label="REVENUE" />
        <MetricItem value={String(selectedProduct.orders)} label="ORDERS" />
      </div>
    </div>
  );
}

function MetricItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-[10px]">
      <span
        className="text-[length:var(--text-hero-700)] font-semibold text-foreground"
        style={{ fontFamily: "var(--font-numeric)" }}
      >
        {value}
      </span>
      <span className="text-[length:var(--text-100)] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
