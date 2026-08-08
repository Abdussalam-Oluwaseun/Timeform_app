import { useMemo } from "react";
import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { productMonthlyTrend } from "@/queries/catalog/product-monthly-trend";
import { ProductPanel } from "./ProductPanel";
import { AnalyticsHeader } from "./AnalyticsHeader";
import { KPISummary, type ProductKpis } from "./KPISummary";
import { WatchSpecifications } from "./WatchSpecifications";
import { MonthlyTrendChart } from "@/components/MonthlyTrendChart";
import { CogentBrand } from "@/components/CogentBrand";
import { ErrorBanner, LoadingSkeleton } from "@/components/Feedback";
import type { CatalogProduct } from "@/lib/catalog";

interface WatchAnalyticsPageProps {
  product: CatalogProduct;
}

/**
 * View 2 — Watch Analytics Detail page.
 *
 * Split layout: left dark product panel (~520px) + right analytics area.
 * The right side shows KPIs (rolled up from the monthly trend rows),
 * a Revenue/Units trend chart, and a specifications strip.
 */
export function WatchAnalyticsPage({ product }: WatchAnalyticsPageProps) {
  // Fetched once per product — the chart below reuses the SDK cache.
  const { connection, query } = productMonthlyTrend({
    productId: product.productId,
    measure: "Revenue",
  });
  const { data, isLoading, error } = useSemanticModelQuery({ connection, query });

  const queryError = error?.message ?? (data?.status === "error" ? data.error.message : undefined);

  const kpis = useMemo<ProductKpis | null>(() => {
    if (data?.status !== "success") return null;
    const columns = data.table.columns;
    const idxOf = (name: string) => columns.findIndex((c) => c.name === name);
    const revenueIdx = idxOf("[Revenue]");
    const unitsIdx = idxOf("[Units]");
    const ordersIdx = idxOf("[Orders]");
    if (revenueIdx < 0 || unitsIdx < 0 || ordersIdx < 0) return null;

    let units = 0;
    let revenue = 0;
    let orders = 0;
    for (const row of data.table.rows) {
      units += Number(row[unitsIdx]) || 0;
      revenue += Number(row[revenueIdx]) || 0;
      orders += Number(row[ordersIdx]) || 0;
    }
    return { units, revenue, orders, unitPrice: product.price };
  }, [data, product.price]);

  return (
    <div className="relative flex h-full">
      {/* Left: full-height product panel */}
      <ProductPanel product={product} />

      {/* Right: analytics content */}
      <div className="flex-1 flex flex-col px-[48px] pt-[32px] pb-[24px] overflow-auto">
        <AnalyticsHeader product={product} />

        {isLoading ? (
          <LoadingSkeleton height={96} className="mb-[24px]" />
        ) : queryError ? (
          <ErrorBanner className="mb-[24px]" message={queryError} />
        ) : kpis ? (
          <KPISummary kpis={kpis} />
        ) : null}

        <MonthlyTrendChart
          title="REVENUE OVERTIME"
          subtitle={`${product.brand} · ${product.name} · Jan — Jun 2024`}
          productId={product.productId}
        />

        <WatchSpecifications product={product} />
      </div>

      <CogentBrand />
    </div>
  );
}
