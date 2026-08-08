//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { productMonthlyTrend, columnMetadata } from "./product-monthly-trend";
import baseQuery from "./product-monthly-trend.dax?raw";

function yField(spec: unknown): string | undefined {
  return (spec as { encoding: { y: { field?: string } } }).encoding.y.field;
}

describe("productMonthlyTrend", () => {
  it("substitutes the product id placeholder in the query", () => {
    const { query } = productMonthlyTrend({ productId: 5 });
    expect(query).toContain("products[productid] = 5");
    expect(query).not.toContain("__PRODUCT_ID__");
    expect(query).not.toBe(baseQuery);
  });

  it("keeps the filter value a plain integer", () => {
    const { query } = productMonthlyTrend({ productId: 12 });
    expect(query).toMatch(/products\[productid\] = 12/);
  });

  it("defaults the y-axis to Revenue", () => {
    const { vegaLiteSpec } = productMonthlyTrend({ productId: 1 });
    expect(yField(vegaLiteSpec)).toBe("Revenue");
  });

  it("switches the y-axis to Units Sold when requested", () => {
    const { vegaLiteSpec } = productMonthlyTrend({ productId: 1, measure: "Units" });
    expect(yField(vegaLiteSpec)).toBe("Units");
  });

  it("reuses the monthly trend column metadata", () => {
    expect(columnMetadata["[Revenue]"]).toMatchObject({ name: "Revenue", format: "$#,0.00" });
    expect(columnMetadata["[Units]"]).toMatchObject({ name: "Units", displayName: "Units Sold" });
  });
});
