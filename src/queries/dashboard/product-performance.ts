import type { ColumnMetadataMap } from "@/lib/to-data-table";
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

/** Per-product sales performance table for the dashboard DataGrid. */
export function productPerformance() {
  return { connection, query: baseQuery, columnMetadata };
}
