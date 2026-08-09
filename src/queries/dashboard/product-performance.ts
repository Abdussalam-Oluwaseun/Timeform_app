import type { ColumnMetadataMap } from "@/lib/to-data-table";
import type { CrossFilterParams } from "@/lib/cross-filter";
import { applyCrossFilterToQuery } from "@/lib/cross-filter";
import baseQuery from "./product-performance.dax?raw";

const connection = "timeformSM";

/** Column metadata keyed by the exact DAX query output column names. */
export const columnMetadata: ColumnMetadataMap = {
  "products[productid]": { name: "productsproductid", displayName: "Product ID", format: "0" },
  "products[productname]": { name: "productsproductname", displayName: "Product" },
  "products[brand]": { name: "productsbrand", displayName: "Brand" },
  "products[gender]": { name: "productsgender", displayName: "Gender" },
  "products[price]": { name: "productsprice", displayName: "Price", format: "$#,0.00" },
  "products[url]": { name: "productsurl", displayName: "Image" },
  "[Units]": { name: "Units", displayName: "Units Sold", format: "#,0" },
  "[Revenue]": { name: "Revenue", displayName: "Revenue", format: "$#,0.00" },
  "[Orders]": { name: "Orders", displayName: "Orders", format: "#,0" },
};

export interface ProductPerformanceParams {
  /** Active cross-filter selection from the dashboard page. */
  crossFilter?: CrossFilterParams | null;
}

/** Per-product sales performance table for the dashboard DataGrid. */
export function productPerformance(params?: ProductPerformanceParams) {
  const query = applyCrossFilterToQuery(baseQuery, params?.crossFilter ?? null);
  return { connection, query, columnMetadata };
}
