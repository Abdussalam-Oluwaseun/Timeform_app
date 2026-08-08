//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { productCatalog, columnMetadata } from "./product-catalog";
import baseQuery from "./product-catalog.dax?raw";

describe("productCatalog", () => {
  it("returns the base query and timeform connection", () => {
    const { connection, query } = productCatalog();
    expect(connection).toBe("timeformSM");
    expect(query).toBe(baseQuery);
  });

  it("exposes no vega-lite spec (cards render custom UI)", () => {
    const result = productCatalog();
    expect("vegaLiteSpec" in result).toBe(false);
  });

  it("keys column metadata by query output names", () => {
    expect(Object.keys(columnMetadata)).toEqual(
      expect.arrayContaining([
        "products[productid]",
        "products[brand]",
        "products[gender]",
        "products[productname]",
        "products[description]",
        "products[price]",
        "products[url]",
        "[Units]",
        "[Revenue]",
        "[Orders]",
      ]),
    );
    expect(columnMetadata["products[price]"]).toMatchObject({
      name: "productsprice",
      displayName: "Price",
      format: "$#,0.00",
    });
  });
});
