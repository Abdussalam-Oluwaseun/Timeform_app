//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { monthlyTrend, columnMetadata } from "./monthly-trend";
import baseQuery from "./monthly-trend.dax?raw";

interface TrendSpecShape {
  mark?: { type: string; interpolate?: string };
  encoding: { y?: { field?: string; title?: string }; x?: unknown };
  layer?: { mark: { type: string }; encoding?: unknown }[];
}

function yField(spec: unknown): string | undefined {
  return (spec as { encoding: { y: { field?: string } } }).encoding.y.field;
}

function yTitle(spec: unknown): string | undefined {
  return (spec as { encoding: { y: { title?: string } } }).encoding.y.title;
}

describe("monthlyTrend", () => {
  it("uses the base query unchanged", () => {
    const { query } = monthlyTrend();
    expect(query).toBe(baseQuery);
    expect(query).toContain("SUMMARIZECOLUMNS");
  });

  it("connects to the timeform semantic model", () => {
    const { connection } = monthlyTrend();
    expect(connection).toBe("timeformSM");
  });

  it("defaults the chart y-axis to Revenue", () => {
    const { vegaLiteSpec } = monthlyTrend();
    expect(yField(vegaLiteSpec)).toBe("Revenue");
    expect(yTitle(vegaLiteSpec)).toBe("Revenue");
  });

  it("switches the y-axis to Units Sold when requested", () => {
    const { vegaLiteSpec } = monthlyTrend({ measure: "Units" });
    expect(yField(vegaLiteSpec)).toBe("Units");
    expect(yTitle(vegaLiteSpec)).toBe("Units Sold");
  });

  it("exposes column metadata keyed by the query output column names", () => {
    expect(Object.keys(columnMetadata)).toEqual(
      expect.arrayContaining(["sales[monthnumber]", "sales[month]", "[Revenue]", "[Units]", "[Orders]"]),
    );
    expect(columnMetadata["[Revenue]"]).toMatchObject({ name: "Revenue", format: "$#,0.00" });
    expect(columnMetadata["[Units]"]).toMatchObject({ name: "Units", displayName: "Units Sold" });
  });

  it("returns a spec without mutating the shared base spec", () => {
    const a = monthlyTrend({ measure: "Units" });
    const b = monthlyTrend();
    expect(yField(a.vegaLiteSpec)).toBe("Units");
    expect(yField(b.vegaLiteSpec)).toBe("Revenue");
    // Cloned specs are distinct objects
    expect(a.vegaLiteSpec).not.toBe(b.vegaLiteSpec);
    expect(a.vegaLiteSpec as unknown).toBeInstanceOf(Object);
  });

  it("produces a smooth line spec for Revenue", () => {
    const { vegaLiteSpec } = monthlyTrend();
    const spec = vegaLiteSpec as unknown as TrendSpecShape;
    expect(spec.mark).toEqual({ type: "line", interpolate: "monotone" });
    expect(spec.encoding).toBeDefined();
    expect(spec.layer).toBeUndefined();
  });

  it("produces a layered column spec for Units Sold", () => {
    const { vegaLiteSpec } = monthlyTrend({ measure: "Units" });
    const spec = vegaLiteSpec as unknown as TrendSpecShape;
    expect(spec.mark).toBeUndefined();
    expect(spec.layer).toHaveLength(2);
    expect(spec.layer?.[0].mark).toEqual({ type: "bar" });
    expect(spec.layer?.[1].mark).toMatchObject({ type: "text" });
  });
});
