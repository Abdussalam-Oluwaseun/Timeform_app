import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import {
  columnMetadata as monthlyTrendMetadata,
  withTrendMeasure,
  type TrendMeasure,
} from "@/queries/dashboard/monthly-trend";
import baseQuery from "./product-monthly-trend.dax?raw";
import baseSpec from "./product-monthly-trend.json";

const connection = "timeformSM";

/**
 * Column metadata for the per-product monthly trend. The query shape is
 * identical to the dashboard monthly trend, so the same metadata applies.
 */
export const columnMetadata: ColumnMetadataMap = monthlyTrendMetadata;

export interface ProductMonthlyTrendParams {
  /** Numeric productid to filter the monthly trend to a single watch. */
  productId: number;
  /** Which measure to plot. Defaults to "Revenue". */
  measure?: TrendMeasure;
}

/**
 * Monthly revenue/units trend for a single product.
 *
 * The `.dax` file contains a `__PRODUCT_ID__` placeholder that is replaced
 * with the caller's product id before execution. Revenue renders as a smooth
 * line; Units Sold renders as a column chart.
 */
export function productMonthlyTrend(params: ProductMonthlyTrendParams) {
  const measure = params.measure ?? "Revenue";
  const query = baseQuery.replaceAll("__PRODUCT_ID__", String(params.productId));
  const vegaLiteSpec = withTrendMeasure(
    baseSpec as unknown as Record<string, unknown>,
    measure,
  ) as VisualizationSpec;

  return { connection, query, columnMetadata, vegaLiteSpec };
}
