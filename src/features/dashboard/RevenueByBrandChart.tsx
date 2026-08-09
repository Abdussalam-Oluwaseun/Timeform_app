import type { InteractionEvent } from "@microsoft/fabric-visuals-core";
import { VegaVisual, useCssTheme } from "@microsoft/fabric-visuals";
import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { toDataTable } from "@/lib/to-data-table";
import type { CrossFilterParams } from "@/lib/cross-filter";
import { revenueByBrand } from "@/queries/dashboard/revenue-by-brand";
import { Card } from "@/components/Card";
import { ErrorBanner, EmptyState, LoadingSkeleton } from "@/components/Feedback";

interface RevenueByBrandChartProps {
  /** Active cross-filter selection from the dashboard page. */
  crossFilter?: CrossFilterParams | null;
  /** Called when the user clicks a data point or clears the selection. */
  onInteraction?: (events: InteractionEvent[]) => void;
}

/**
 * Horizontal bar chart of revenue by brand.
 */
export function RevenueByBrandChart({ crossFilter, onInteraction }: RevenueByBrandChartProps) {
  const theme = useCssTheme();
  const { connection, query, columnMetadata, vegaLiteSpec } = revenueByBrand({ crossFilter });
  const { data, isLoading, error } = useSemanticModelQuery({ connection, query });

  const queryError = error?.message ?? (data?.status === "error" ? data.error.message : undefined);

  let body: React.ReactNode;
  if (isLoading) {
    body = <LoadingSkeleton height={380} />;
  } else if (queryError) {
    body = <ErrorBanner message={queryError} />;
  } else if (data?.status === "success" && data.table.rows.length > 0) {
    const dataTable = toDataTable(data.table, columnMetadata);
    body = (
      <VegaVisual
        spec={vegaLiteSpec}
        data={dataTable}
        theme={theme}
        style={{ height: 380 }}
        onInteraction={onInteraction}
      />
    );
  } else {
    body = <EmptyState message="No data available" />;
  }

  return (
    <Card title="REVENUE BY BRAND" subtitle="Jan — Jun 2024" bodyClassName="pt-[8px]">
      {body}
    </Card>
  );
}
