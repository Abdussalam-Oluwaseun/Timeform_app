import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import type { CrossFilterParams } from "@/lib/cross-filter";
import { applyCrossFilterToQuery } from "@/lib/cross-filter";
import baseQuery from "./revenue-by-brand.dax?raw";
import baseSpec from "./revenue-by-brand.json";

const connection = "timeformSM";

/** Column metadata keyed by the exact DAX query output column names. */
export const columnMetadata: ColumnMetadataMap = {
  "products[brand]": { name: "productsbrand", displayName: "Brand" },
  "[Revenue]": { name: "Revenue", displayName: "Revenue", format: "$#,0.00" },
  "[Units]": { name: "Units", displayName: "Units Sold", format: "#,0" },
  "[Orders]": { name: "Orders", displayName: "Orders", format: "#,0" },
};

export interface RevenueByBrandParams {
  /** Active cross-filter selection from the dashboard page. */
  crossFilter?: CrossFilterParams | null;
}

/** Horizontal bar chart of revenue by brand. */
export function revenueByBrand(params?: RevenueByBrandParams) {
  const query = applyCrossFilterToQuery(baseQuery, params?.crossFilter ?? null);
  const vegaLiteSpec = baseSpec as VisualizationSpec;
  return { connection, query, columnMetadata, vegaLiteSpec };
}
