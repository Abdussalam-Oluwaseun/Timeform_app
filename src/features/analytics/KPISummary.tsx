import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/catalog";

export interface ProductKpis {
  units: number;
  revenue: number;
  orders: number;
  unitPrice: number;
}

interface KPISummaryProps {
  kpis: ProductKpis;
}

/**
 * Horizontal KPI card row with four columns — same card treatment as the
 * dashboard KPI cards (bg-card + border surface, hero value).
 */
export function KPISummary({ kpis }: KPISummaryProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-[20px] mb-[28px]">
      <KpiItem label="Units Sold" value={String(kpis.units)} />
      <KpiItem label="Revenue" value={formatCurrency(kpis.revenue)} />
      <KpiItem label="Orders" value={String(kpis.orders)} />
      <KpiItem label="Unit Price" value={formatCurrency(kpis.unitPrice)} />
    </div>
  );
}

function KpiItem({ label, value }: { label: string; value: string }) {
  const [displayed, setDisplayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl px-[24px] py-[20px] flex flex-col justify-center">
      <span className="text-[length:var(--text-100)] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-[8px]">
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
