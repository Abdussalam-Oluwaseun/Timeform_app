import type { InteractionEvent } from "@microsoft/fabric-visuals-core";
import { VegaVisual, useCssTheme } from "@microsoft/fabric-visuals";
import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { toDataTable } from "@/lib/to-data-table";
import type { CrossFilterParams } from "@/lib/cross-filter";
import { genderSplit } from "@/queries/dashboard/gender-split";
import { Card } from "@/components/Card";
import { ErrorBanner, EmptyState, LoadingSkeleton } from "@/components/Feedback";

interface GenderSplitChartProps {
  /** Active cross-filter selection from the dashboard page. */
  crossFilter?: CrossFilterParams | null;
  /** Called when the user clicks a data point or clears the selection. */
  onInteraction?: (events: InteractionEvent[]) => void;
}

/**
 * Horizontal bar chart of revenue split by collection gender.
 */
export function GenderSplitChart({ crossFilter, onInteraction }: GenderSplitChartProps) {
  const theme = useCssTheme();
  const { connection, query, columnMetadata, vegaLiteSpec } = genderSplit({ crossFilter });
  const { data, isLoading, error } = useSemanticModelQuery({ connection, query });

  const queryError = error?.message ?? (data?.status === "error" ? data.error.message : undefined);

  let body: React.ReactNode;
  if (isLoading) {
    body = <LoadingSkeleton height={300} />;
  } else if (queryError) {
    body = <ErrorBanner message={queryError} />;
  } else if (data?.status === "success" && data.table.rows.length > 0) {
    const dataTable = toDataTable(data.table, columnMetadata);
    body = (
      <VegaVisual
        spec={vegaLiteSpec}
        data={dataTable}
        theme={theme}
        style={{ height: 300 }}
        onInteraction={onInteraction}
      />
    );
  } else {
    body = <EmptyState message="No data available" />;
  }

  return (
    <Card title="SALES BY GENDER" subtitle="Men vs Women" bodyClassName="pt-[8px]">
      {body}
    </Card>
  );
}
