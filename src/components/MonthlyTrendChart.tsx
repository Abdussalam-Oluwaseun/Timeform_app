import { useState } from "react";
import type { InteractionEvent } from "@microsoft/fabric-visuals-core";
import { VegaVisual, useCssTheme } from "@microsoft/fabric-visuals";
import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { toDataTable } from "@/lib/to-data-table";
import type { CrossFilterParams } from "@/lib/cross-filter";
import { monthlyTrend, type TrendMeasure } from "@/queries/dashboard/monthly-trend";
import { productMonthlyTrend } from "@/queries/catalog/product-monthly-trend";
import { Card } from "./Card";
import { ToggleButtons } from "./ToggleButtons";
import { ErrorBanner, EmptyState, LoadingSkeleton } from "./Feedback";

interface MonthlyTrendChartProps {
  title: string;
  subtitle: string;
  /** When set, the chart plots the monthly trend for this single product. */
  productId?: number;
  chartHeight?: number;
  /** Active cross-filter selection from the dashboard page. */
  crossFilter?: CrossFilterParams | null;
  /** Called when the user clicks a data point or clears the selection. */
  onInteraction?: (events: InteractionEvent[]) => void;
}

const TREND_LABELS = ["Revenue", "Units Sold"] as const;
const TREND_MEASURES: readonly TrendMeasure[] = ["Revenue", "Units"];

/**
 * Monthly trend line chart with a Revenue / Units Sold toggle.
 *
 * Renders the dashboard-wide trend when `productId` is omitted, or the
 * trend for a single watch when `productId` is provided. Query + spec come
 * from the factory functions in `src/queries`.
 */
export function MonthlyTrendChart({ title, subtitle, productId, chartHeight = 300, crossFilter, onInteraction }: MonthlyTrendChartProps) {
  const theme = useCssTheme();
  const [measureIndex, setMeasureIndex] = useState(0);
  const measure = TREND_MEASURES[measureIndex];

  const { connection, query, columnMetadata, vegaLiteSpec } =
    productId != null
      ? productMonthlyTrend({ productId, measure })
      : monthlyTrend({ measure, crossFilter });

  const { data, isLoading, error } = useSemanticModelQuery({ connection, query });

  const queryError = error?.message ?? (data?.status === "error" ? data.error.message : undefined);

  let body: React.ReactNode;
  if (isLoading) {
    body = <LoadingSkeleton height={chartHeight} />;
  } else if (queryError) {
    body = <ErrorBanner message={queryError} />;
  } else if (data?.status === "success" && data.table.rows.length > 0) {
    const dataTable = toDataTable(data.table, columnMetadata);
    body = (
      <VegaVisual
        spec={vegaLiteSpec}
        data={dataTable}
        theme={theme}
        style={{ height: chartHeight }}
        onInteraction={onInteraction}
      />
    );
  } else {
    body = <EmptyState message="No data available" />;
  }

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <ToggleButtons
          labels={TREND_LABELS}
          activeIndex={measureIndex}
          onChange={setMeasureIndex}
        />
      }
      bodyClassName="pt-[8px]"
    >
      {body}
    </Card>
  );
}
