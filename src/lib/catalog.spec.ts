//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { rowsToProducts, formatCurrency } from "./catalog";
import type { QueryTable } from "@microsoft/fabric-app-data";

const table: QueryTable = {
  columns: [
    { name: "products[productid]", dataType: "unknown" },
    { name: "products[brand]", dataType: "unknown" },
    { name: "products[gender]", dataType: "unknown" },
    { name: "products[productname]", dataType: "unknown" },
    { name: "products[description]", dataType: "unknown" },
    { name: "products[price]", dataType: "unknown" },
    { name: "products[url]", dataType: "unknown" },
    { name: "[Units]", dataType: "unknown" },
    { name: "[Revenue]", dataType: "unknown" },
    { name: "[Orders]", dataType: "unknown" },
  ],
  rows: [
    [1, "Omega", "Men", "Omega Smart Watch M1", "A luxury smartwatch.", 163.5, "https://example.com/omega.png", 68, 11118, 31],
  ],
};

describe("rowsToProducts", () => {
  it("maps row values to typed product objects in column order", () => {
    const [product] = rowsToProducts(table);
    expect(product).toEqual({
      productId: 1,
      brand: "Omega",
      gender: "Men",
      name: "Omega Smart Watch M1",
      description: "A luxury smartwatch.",
      price: 163.5,
      url: "https://example.com/omega.png",
      units: 68,
      revenue: 11118,
      orders: 31,
    });
  });

  it("returns an empty array for an empty table", () => {
    expect(rowsToProducts({ ...table, rows: [] })).toEqual([]);
  });

  it("maps every row", () => {
    const multiRow = { ...table, rows: [table.rows[0], table.rows[0], table.rows[0]] };
    expect(rowsToProducts(multiRow)).toHaveLength(3);
  });
});

describe("formatCurrency", () => {
  it("formats integers without decimals", () => {
    expect(formatCurrency(14500)).toBe("$14,500");
  });

  it("rounds fractional values", () => {
    expect(formatCurrency(163.5)).toBe("$164");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});
