//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { revenueByBrand, columnMetadata as brandMeta } from "./revenue-by-brand";
import { genderSplit, columnMetadata as genderMeta } from "./gender-split";
import { productPerformance, columnMetadata as perfMeta } from "./product-performance";
import brandQuery from "./revenue-by-brand.dax?raw";
import genderQuery from "./gender-split.dax?raw";
import perfQuery from "./product-performance.dax?raw";

describe("revenueByBrand", () => {
  it("returns the base query and timeform connection", () => {
    const { connection, query } = revenueByBrand();
    expect(connection).toBe("timeformSM");
    expect(query).toBe(brandQuery);
  });

  it("exposes a vega-lite spec with brand on the y-axis and revenue on the x-axis", () => {
    const { vegaLiteSpec } = revenueByBrand();
    const spec = vegaLiteSpec as unknown as {
      encoding: { x: { field: string }; y: { field: string } };
    };
    expect(spec.encoding.y.field).toBe("productsbrand");
    expect(spec.encoding.x.field).toBe("Revenue");
  });

  it("keys column metadata by query output names", () => {
    expect(Object.keys(brandMeta)).toEqual(
      expect.arrayContaining(["products[brand]", "[Revenue]", "[Units]", "[Orders]"]),
    );
  });
});

describe("genderSplit", () => {
  it("returns the base query and connection", () => {
    const { connection, query } = genderSplit();
    expect(connection).toBe("timeformSM");
    expect(query).toBe(genderQuery);
  });

  it("plots gender as a pie chart (theta + color encoding)", () => {
    const { vegaLiteSpec } = genderSplit();
    const spec = vegaLiteSpec as unknown as {
      mark: { type: string };
      encoding: { theta: { field: string }; color: { field: string; scale: { domain: string[] } } };
    };
    expect(spec.mark.type).toBe("arc");
    expect(spec.encoding.theta.field).toBe("Revenue");
    expect(spec.encoding.color.field).toBe("productsgender");
    expect(spec.encoding.color.scale.domain).toEqual(["Men", "Women"]);
  });

  it("keys column metadata by query output names", () => {
    expect(Object.keys(genderMeta)).toEqual(
      expect.arrayContaining(["products[gender]", "[Revenue]", "[Units]", "[Orders]"]),
    );
  });
});

describe("productPerformance", () => {
  it("returns the base query and connection", () => {
    const { connection, query } = productPerformance();
    expect(connection).toBe("timeformSM");
    expect(query).toBe(perfQuery);
  });

  it("keys column metadata by query output names including image url", () => {
    expect(Object.keys(perfMeta)).toEqual(
      expect.arrayContaining([
        "products[productid]",
        "products[productname]",
        "products[brand]",
        "products[gender]",
        "products[price]",
        "products[url]",
        "[Units]",
        "[Revenue]",
        "[Orders]",
      ]),
    );
    expect(perfMeta["[Revenue]"]).toMatchObject({ name: "Revenue", format: "$#,0.00" });
  });
});
