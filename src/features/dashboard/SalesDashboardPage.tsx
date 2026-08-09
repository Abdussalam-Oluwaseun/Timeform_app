import { useLayoutEffect, useRef, useState, useCallback } from "react";
import type { InteractionEvent } from "@microsoft/fabric-visuals-core";
import { KpiCards } from "./KpiCards";
import { RevenueByBrandChart } from "./RevenueByBrandChart";
import { GenderSplitChart } from "./GenderSplitChart";
import { ProductPerformanceGrid } from "./ProductPerformanceGrid";
import { MonthlyTrendChart } from "@/components/MonthlyTrendChart";
import { CogentBrand } from "@/components/CogentBrand";
import {
  extractCrossFilterParams,
  type CrossFilterParams,
} from "@/lib/cross-filter";

/** Unique identifiers for each visual that supports cross-filtering. */
const SOURCE = {
  trend: "trend",
  gender: "gender",
  brand: "brand",
  products: "products",
} as const;

/**
 * View 3 — Flat Sales Dashboard.
 *
 * KPI row → monthly revenue/units trend + gender split →
 * revenue by brand → product performance grid.
 *
 * Coordinates cross-filtering: when a user clicks a data point in one
 * visual its selection cross-filters the others. The originating visual
 * is excluded from receiving its own filter.
 *
 * Scrolls to top on mount and after each cross-filter change to prevent
 * async layout shifts from pushing the viewport to the bottom.
 *
 * The wrapper is constrained to a max width so charts stay proportional
 * on wide monitors.
 *
 * `overflow-anchor: none` prevents the browser's scroll-anchoring algorithm
 * from jumping to the bottom as async content (charts, grids) loads in.
 */
export function SalesDashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectionSource, setSelectionSource] = useState<string | null>(null);
  const [crossFilter, setCrossFilter] = useState<CrossFilterParams | null>(null);

  /** Scroll to top on mount — prevents browser scroll restoration
   * or async layout shifts from leaving the viewport mid-page. */
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const handleInteraction = useCallback(
    (sourceId: string, events: InteractionEvent[]) => {
      const params = extractCrossFilterParams(events);
      setCrossFilter(params);
      setSelectionSource(params ? sourceId : null);
    },
    [],
  );

  /** CrossFilter forwarded to visuals that didn't emit the selection. */
  const filterFor = (sourceId: string) =>
    selectionSource === sourceId ? null : crossFilter;

  return (
    <div ref={containerRef} className="relative h-full overflow-auto" style={{ overflowAnchor: "none" }}>
      <div className="max-w-[1400px] mx-auto px-[48px] pt-[32px] pb-[64px]">
        {/* Page heading */}
        <div className="mb-[24px]">
          <h1 className="text-[length:34px] font-semibold leading-[42px] text-foreground m-0">
            Sales Dashboard
          </h1>
          <p className="text-[length:var(--text-100)] font-semibold text-muted-foreground mt-[6px] m-0">
            Six months of smart watch sales across the Timeform catalog.
          </p>
        </div>

        {/* KPI row — always reflects the active cross-filter */}
        <KpiCards className="mb-[24px]" crossFilter={crossFilter} />

        {/* Trend + gender */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] mb-[24px]">
          <div className="xl:col-span-8">
            <MonthlyTrendChart
              title="REVENUE OVERTIME"
              subtitle="Whole catalog · Jan — Jun 2024"
              crossFilter={filterFor(SOURCE.trend)}
              onInteraction={(e) => handleInteraction(SOURCE.trend, e)}
            />
          </div>
          <div className="xl:col-span-4">
            <GenderSplitChart
              crossFilter={filterFor(SOURCE.gender)}
              onInteraction={(e) => handleInteraction(SOURCE.gender, e)}
            />
          </div>
        </div>

        {/* Brand breakdown */}
        <div className="mb-[24px]">
          <RevenueByBrandChart
            crossFilter={filterFor(SOURCE.brand)}
            onInteraction={(e) => handleInteraction(SOURCE.brand, e)}
          />
        </div>

        {/* Product grid */}
        <ProductPerformanceGrid
          crossFilter={filterFor(SOURCE.products)}
          onInteraction={(e) => handleInteraction(SOURCE.products, e)}
        />
      </div>

      <CogentBrand />
    </div>
  );
}
