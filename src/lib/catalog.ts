//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import type { QueryTable } from "@microsoft/fabric-app-data";

/** A watch as rendered in the collection views (from the catalog query). */
export interface CatalogProduct {
  productId: number;
  brand: string;
  gender: string;
  name: string;
  description: string;
  price: number;
  url: string;
  units: number;
  revenue: number;
  orders: number;
}

/**
 * Converts the `product-catalog` query table into typed product objects.
 *
 * Row order matches the query's SELECTCOLUMNS/SUMMARIZECOLUMNS order:
 * productid, brand, gender, productname, description, price, url,
 * Units, Revenue, Orders.
 */
export function rowsToProducts(table: QueryTable): CatalogProduct[] {
  return table.rows.map((row) => ({
    productId: row[0] as number,
    brand: row[1] as string,
    gender: row[2] as string,
    name: row[3] as string,
    description: row[4] as string,
    price: row[5] as number,
    url: row[6] as string,
    units: row[7] as number,
    revenue: row[8] as number,
    orders: row[9] as number,
  }));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
