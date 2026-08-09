import type { InteractionEvent, SetPredicate } from "@microsoft/fabric-visuals-core";

/**
 * Cross-filter parameters extracted from onInteraction events.
 *
 * Each field represents an optional filter dimension. When a field is
 * present the target visual should constrain its query to matching rows.
 * Multiple dimensions combine as AND (intersection).
 */
export interface CrossFilterParams {
  /** Filter to specific brands (matches products[brand] values). */
  brands?: string[];
  /** Filter to specific genders (matches products[gender] values). */
  genders?: string[];
  /** Filter to specific month numbers (matches sales[monthnumber] values). */
  monthNumbers?: number[];
}

/**
 * Maps cleaned DataTable column names (from columnMetadata.name) back to
 * their original DAX column references for use in TREATAS filters.
 */
const CLEANED_TO_DAX: Record<string, string> = {
  productsgender: "products[gender]",
  productsbrand: "products[brand]",
  salesmonth: "sales[month]",
  salesmonthnumber: "sales[monthnumber]",
};

/** Month abbreviation to numeric index. */
const MONTH_ABBR: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

/**
 * Extracts cross-filter parameters from a list of interaction events.
 *
 * Walks each `select` event's predicates, maps cleaned DataTable column
 * names back to their original DAX references, and collects unique values
 * per filter dimension.
 *
 * @returns `CrossFilterParams` when at least one filter dimension has
 * values, or `null` when there is no active selection (clear or no
 * select events).
 */
export function extractCrossFilterParams(events: InteractionEvent[]): CrossFilterParams | null {
  const selects = events.filter((e) => e.action === "select");
  if (selects.length === 0) return null;

  const brands: string[] = [];
  const genders: string[] = [];
  const monthNumbers: number[] = [];

  for (const event of selects) {
    for (const selection of event.selections) {
      for (const predicate of selection.predicates) {
        if (predicate.type !== "set") continue;

        const daxRef = CLEANED_TO_DAX[predicate.name];
        if (!daxRef) continue;

        if (daxRef === "products[brand]") {
          for (const v of predicate.values) brands.push(String(v));
        } else if (daxRef === "products[gender]") {
          for (const v of predicate.values) genders.push(String(v));
        } else if (daxRef === "sales[monthnumber]") {
          for (const v of predicate.values) {
            const n = Number(v);
            if (!isNaN(n)) monthNumbers.push(n);
          }
        } else if (daxRef === "sales[month]") {
          for (const v of predicate.values) {
            const n = MONTH_ABBR[String(v)] ?? Number(v);
            if (!isNaN(n)) monthNumbers.push(n);
          }
        }
      }
    }
  }

  const result: CrossFilterParams = {};
  if (brands.length > 0) result.brands = [...new Set(brands)];
  if (genders.length > 0) result.genders = [...new Set(genders)];
  if (monthNumbers.length > 0) result.monthNumbers = [...new Set(monthNumbers)];

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Wraps a base DAX query with `CALCULATETABLE` and `TREATAS` filters for
 * each active cross-filter dimension.
 *
 * Strips the leading `EVALUATE` keyword and trailing `ORDER BY` clause,
 * wraps the inner `SUMMARIZECOLUMNS` body in `CALCULATETABLE(...)` with
 * the filter arguments, then reassembles.
 *
 * Returns the base query unchanged when `params` is null or has no active
 * filter dimensions.
 */
export function applyCrossFilterToQuery(
  baseQuery: string,
  params: CrossFilterParams | null,
): string {
  if (!params) return baseQuery;

  const filters: string[] = [];

  if (params.brands?.length) {
    const values = params.brands.map((b) => `"${b}"`).join(", ");
    filters.push(`KEEPFILTERS(TREATAS({${values}}, products[brand]))`);
  }
  if (params.genders?.length) {
    const values = params.genders.map((g) => `"${g}"`).join(", ");
    filters.push(`KEEPFILTERS(TREATAS({${values}}, products[gender]))`);
  }
  if (params.monthNumbers?.length) {
    const values = params.monthNumbers.join(", ");
    filters.push(`KEEPFILTERS(TREATAS({${values}}, sales[monthnumber]))`);
  }

  if (filters.length === 0) return baseQuery;

  // Strip leading comments and the EVALUATE keyword, then separate
  // the query body from any trailing ORDER BY clause.
  const withoutEvaluate = baseQuery
    .replace(/EVALUATE\s*\n?/, "")
    .trimEnd();

  const orderByIdx = withoutEvaluate.search(/\nORDER BY\s/);
  const body =
    orderByIdx >= 0 ? withoutEvaluate.slice(0, orderByIdx).trimEnd() : withoutEvaluate;
  const orderByClause = orderByIdx >= 0 ? withoutEvaluate.slice(orderByIdx) : "";

  // Indent the body lines inside CALCULATETABLE.
  const bodyLines = body.split("\n");
  const indentedBody = bodyLines.map((line) => "    " + line).join("\n");
  const filterBlock = filters.map((f) => "    " + f).join(",\n");

  const wrapped = `EVALUATE
CALCULATETABLE(
${indentedBody},
${filterBlock}
)${orderByClause}`;

  return wrapped;
}
