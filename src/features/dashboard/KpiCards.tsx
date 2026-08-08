import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { monthlyTrend } from "@/queries/dashboard/monthly-trend";
import { ErrorBanner, LoadingSkeleton } from "@/components/Feedback";

interface KpiCardsProps {
  className?: string;
}

interface Kpi {
  label: string;
  value: string;
}

/**
 * Dashboard KPI row — Total Revenue, Units Sold, Orders and Avg Order Value.
 *
 * Totals are rolled up in TypeScript from the monthly trend rows (already
 * fetched for the trend chart — same query, SDK cache hit).
 */
export function KpiCards({ className }: KpiCardsProps) {
  const { connection, query } = monthlyTrend({ measure: "Revenue" });
  const { data, isLoading, error } = useSemanticModelQuery({ connection, query });

  const queryError = error?.message ?? (data?.status === "error" ? data.error.message : undefined);

  let kpis: Kpi[] | null = null;

  if (data?.status === "success") {
    const columns = data.table.columns;
    const idxOf = (name: string) => columns.findIndex((c) => c.name === name);
    const revenueIdx = idxOf("[Revenue]");
    const unitsIdx = idxOf("[Units]");
    const ordersIdx = idxOf("[Orders]");

    let revenue = 0;
    let units = 0;
    let orders = 0;
    for (const row of data.table.rows) {
      revenue += Number(row[revenueIdx]) || 0;
      units += Number(row[unitsIdx]) || 0;
      orders += Number(row[ordersIdx]) || 0;
    }

    const fmt = new Intl.NumberFormat("en-US");
    const fmtUsd = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    const avgOrder = orders > 0 ? revenue / orders : 0;

    kpis = [
      { label: "Total Revenue", value: fmtUsd.format(revenue) },
      { label: "Units Sold", value: fmt.format(units) },
      { label: "Orders", value: fmt.format(orders) },
      { label: "Avg Order Value", value: fmtUsd.format(avgOrder) },
    ];
  }

  return (
    <div className={cn("grid grid-cols-2 xl:grid-cols-4 gap-[20px]", className)}>
      {isLoading ? (
        <LoadingSkeleton height={108} className="col-span-2 xl:col-span-4" />
      ) : queryError ? (
        <ErrorBanner
          className="col-span-2 xl:col-span-4"
          message={queryError}
        />
      ) : kpis ? (
        kpis.map((kpi) => <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} />)
      ) : null}
    </div>
  );
}

function KpiCard({ label, value }: Kpi) {
  const [displayed, setDisplayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl px-[24px] py-[20px] flex flex-col justify-center">
      <span className="text-[length:var(--text-100)] font-medium uppercase tracking-[0.1em] text-muted-foreground mb-[8px]">
        {label}
      </span>
      <span
        className={cn(
          "text-[length:var(--text-hero-700)] font-semibold text-foreground transition-opacity duration-700",
          displayed ? "opacity-100" : "opacity-0",
        )}
        style={{ fontFamily: "var(--font-numeric)" }}
      >
        {value}
      </span>
    </div>
  );
}
