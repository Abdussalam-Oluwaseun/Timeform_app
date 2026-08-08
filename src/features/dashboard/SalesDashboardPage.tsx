import { KpiCards } from "./KpiCards";
import { RevenueByBrandChart } from "./RevenueByBrandChart";
import { GenderSplitChart } from "./GenderSplitChart";
import { ProductPerformanceGrid } from "./ProductPerformanceGrid";
import { MonthlyTrendChart } from "@/components/MonthlyTrendChart";
import { CogentBrand } from "@/components/CogentBrand";

/**
 * View 3 — Flat Sales Dashboard.
 *
 * KPI row → monthly revenue/units trend + gender split →
 * revenue by brand → product performance grid.
 * The wrapper is constrained to a max width so charts stay proportional
 * on wide monitors.
 */
export function SalesDashboardPage() {
  return (
    <div className="relative h-full overflow-auto">
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

        {/* KPI row */}
        <KpiCards className="mb-[24px]" />

        {/* Trend + gender */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] mb-[24px]">
          <div className="xl:col-span-8">
            <MonthlyTrendChart
              title="REVENUE OVERTIME"
              subtitle="Whole catalog · Jan — Jun 2024"
            />
          </div>
          <div className="xl:col-span-4">
            <GenderSplitChart />
          </div>
        </div>

        {/* Brand breakdown */}
        <div className="mb-[24px]">
          <RevenueByBrandChart />
        </div>

        {/* Product grid */}
        <ProductPerformanceGrid />
      </div>

      <CogentBrand />
    </div>
  );
}
