import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import type { CrossFilterParams } from "@/lib/cross-filter";
import { applyCrossFilterToQuery } from "@/lib/cross-filter";
import baseQuery from "./gender-split.dax?raw";
import baseSpec from "./gender-split.json";

const connection = "timeformSM";

/** Column metadata keyed by the exact DAX query output column names. */
export const columnMetadata: ColumnMetadataMap = {
  "products[gender]": { name: "productsgender", displayName: "Gender" },
  "[Revenue]": { name: "Revenue", displayName: "Revenue", format: "$#,0.00" },
  "[Units]": { name: "Units", displayName: "Units Sold", format: "#,0" },
  "[Orders]": { name: "Orders", displayName: "Orders", format: "#,0" },
};

export interface GenderSplitParams {
  /** Active cross-filter selection from the dashboard page. */
  crossFilter?: CrossFilterParams | null;
}

/** Horizontal bar chart of revenue split by collection gender. */
export function genderSplit(params?: GenderSplitParams) {
  const query = applyCrossFilterToQuery(baseQuery, params?.crossFilter ?? null);
  const vegaLiteSpec = baseSpec as VisualizationSpec;
  return { connection, query, columnMetadata, vegaLiteSpec };
}
