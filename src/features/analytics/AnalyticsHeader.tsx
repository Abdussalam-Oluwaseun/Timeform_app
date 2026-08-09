import type { CatalogProduct } from "@/lib/catalog";

interface AnalyticsHeaderProps {
  product: CatalogProduct;
}

/**
 * Analytics detail view header — page title + product identifier subtitle.
 */
export function AnalyticsHeader({ product }: AnalyticsHeaderProps) {
  return (
    <div>
      <h1 className="text-[length:34px] font-semibold leading-[42px] text-foreground m-0">
        Analyze the Watch
      </h1>
      <p className="text-[length:var(--text-100)] font-semibold uppercase tracking-[0.12em] text-muted-foreground m-0 mt-[6px]">
        {product.brand} · {product.name} · {product.gender}
      </p>
    </div>
  );
}
