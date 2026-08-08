import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./product-catalog.dax?raw";

const connection = "timeformSM";

/** Column metadata keyed by the exact DAX query output column names. */
export const columnMetadata: ColumnMetadataMap = {
  "products[productid]": { name: "productsproductid", displayName: "Product ID", format: "0" },
  "products[brand]": { name: "productsbrand", displayName: "Brand" },
  "products[gender]": { name: "productsgender", displayName: "Gender" },
  "products[productname]": { name: "productsproductname", displayName: "Product" },
  "products[description]": { name: "productsdescription", displayName: "Description" },
  "products[price]": { name: "productsprice", displayName: "Price", format: "$#,0.00" },
  "products[url]": { name: "productsurl", displayName: "Image" },
  "[Units]": { name: "Units", displayName: "Units Sold", format: "#,0" },
  "[Revenue]": { name: "Revenue", displayName: "Revenue", format: "$#,0.00" },
  "[Orders]": { name: "Orders", displayName: "Orders", format: "#,0" },
};

/**
 * Full watch catalog (all products) with per-product sales measures.
 * Used by the collection carousel and filters — cards render custom UI,
 * so this factory intentionally returns no Vega-Lite spec.
 */
export function productCatalog() {
  return { connection, query: baseQuery, columnMetadata };
}
