import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./monthly-trend.dax?raw";
import baseSpec from "./monthly-trend.json";

const connection = "timeformSM";

/** Column metadata keyed by the exact DAX query output column names. */
export const columnMetadata: ColumnMetadataMap = {
  "sales[monthnumber]": { name: "salesmonthnumber", displayName: "Month", format: "0" },
  "sales[month]": { name: "salesmonth", displayName: "Month" },
  "[Revenue]": { name: "Revenue", displayName: "Revenue", format: "$#,0.00" },
  "[Units]": { name: "Units", displayName: "Units Sold", format: "#,0" },
  "[Orders]": { name: "Orders", displayName: "Orders", format: "#,0" },
};

/** The measure the trend chart can toggle between. */
export type TrendMeasure = "Revenue" | "Units";

interface TrendMeasureMeta {
  /** Cleaned field name (from columnMetadata) used in the Vega-Lite spec. */
  field: string;
  /** Human-readable axis title. */
  displayName: string;
}

const MEASURE_META: Record<TrendMeasure, TrendMeasureMeta> = {
  Revenue: { field: "Revenue", displayName: "Revenue" },
  Units: { field: "Units", displayName: "Units Sold" },
};

export interface MonthlyTrendParams {
  /** Which measure to plot on the y-axis. Defaults to "Revenue". */
  measure?: TrendMeasure;
}

/**
 * Applies the chosen measure to a cloned base trend spec:
 * - Revenue → smooth (monotone) line chart
 * - Units Sold → column chart with value labels
 *
 * Shared by the dashboard and per-product trend factories.
 */
export function withTrendMeasure(
  base: Record<string, unknown>,
  measure: TrendMeasure,
): Record<string, unknown> {
  const spec = structuredClone(base);
  const meta = MEASURE_META[measure];

  const encoding = spec.encoding as { y: { field?: string; title?: string; axis?: { title?: string | null } } };
  encoding.y.field = meta.field;
  // Axis title removed by design — keep axis.title null from the base spec
  delete encoding.y.title;
  spec.description = `Monthly ${meta.displayName.toLowerCase()} trend`;

  if (measure === "Units") {
    // Column chart: bars + value labels.
    spec.layer = [
      { mark: { type: "bar", color: "var(--color-brand)" } },
      {
        mark: { type: "text", style: "labelVertical" },
        encoding: {
          text: { field: "Units", type: "quantitative" },
        },
      },
    ];
  } else {
    // Smooth line chart with point markers and data labels.
    spec.layer = [
      { mark: { type: "line", interpolate: "monotone", color: "var(--color-brand-foreground)" } },
      { mark: { type: "point", color: "var(--color-brand-foreground)", filled: true, size: 40 } },
      {
        mark: { type: "text", style: "labelVertical" },
        encoding: {
          text: { field: meta.field, type: "quantitative" },
        },
      },
    ];
  }

  // Remove top-level mark if present (base spec is layered).
  delete spec.mark;

  return spec;
}

/**
 * Monthly revenue/units trend across the whole catalog.
 *
 * The same query returns Revenue, Units and Orders per month; the factory
 * only adjusts which field the trend chart plots and its mark type.
 */
export function monthlyTrend(params?: MonthlyTrendParams) {
  const measure = params?.measure ?? "Revenue";
  const vegaLiteSpec = withTrendMeasure(
    baseSpec as unknown as Record<string, unknown>,
    measure,
  ) as VisualizationSpec;

  return { connection, query: baseQuery, columnMetadata, vegaLiteSpec };
}
