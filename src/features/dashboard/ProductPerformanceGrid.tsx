import { DataGrid, ImageCell, type GridColumnDef } from "@microsoft/fabric-datagrid";
import { useCssTheme } from "@microsoft/fabric-visuals";
import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { toDataTable } from "@/lib/to-data-table";
import { productPerformance } from "@/queries/dashboard/product-performance";
import { Card } from "@/components/Card";
import { ErrorBanner, EmptyState, LoadingSkeleton } from "@/components/Feedback";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("en-US");

const GRID_COLUMNS: GridColumnDef[] = [
  {
    id: "productsurl",
    header: "",
    width: 72,
    sortable: false,
    filterable: false,
    cellRenderer: (value) =>
      typeof value === "string" && value ? <ImageCell src={value} alt="Product" /> : null,
  },
  {
    id: "productsproductname",
    header: "Product",
    minWidth: 240,
    cellRenderer: (value, row) => (
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-foreground">{String(value ?? "")}</span>
        <span className="text-200 text-muted-foreground">{String(row["productsbrand"] ?? "")}</span>
      </div>
    ),
  },
  { id: "productsgender", header: "Gender", minWidth: 100 },
  {
    id: "productsprice",
    header: "Price",
    minWidth: 110,
    numericStyling: true,
    cellRenderer: (value) => <span className="tabular-nums">{usd.format(Number(value) || 0)}</span>,
  },
  {
    id: "Units",
    header: "Units Sold",
    minWidth: 110,
    numericStyling: true,
    cellRenderer: (value) => <span className="tabular-nums">{num.format(Number(value) || 0)}</span>,
  },
  {
    id: "Revenue",
    header: "Revenue",
    minWidth: 130,
    numericStyling: true,
    cellRenderer: (value) => <span className="tabular-nums">{usd.format(Number(value) || 0)}</span>,
  },
  {
    id: "Orders",
    header: "Orders",
    minWidth: 100,
    numericStyling: true,
    cellRenderer: (value) => <span className="tabular-nums">{num.format(Number(value) || 0)}</span>,
  },
];

/**
 * Full-width data grid of per-product sales performance.
 *
 * The direct parent applies overflow-auto so the grid stays scrollable.
 */
export function ProductPerformanceGrid() {
  const theme = useCssTheme();
  const { connection, query, columnMetadata } = productPerformance();
  const { data, isLoading, error } = useSemanticModelQuery({ connection, query });

  const queryError = error?.message ?? (data?.status === "error" ? data.error.message : undefined);

  let body: React.ReactNode;
  if (isLoading) {
    body = <LoadingSkeleton height={420} />;
  } else if (queryError) {
    body = <ErrorBanner message={queryError} />;
  } else if (data?.status === "success" && data.table.rows.length > 0) {
    const dataTable = toDataTable(data.table, columnMetadata);
    body = (
      <div className="overflow-auto" style={{ maxHeight: 440 }}>
        <DataGrid columns={GRID_COLUMNS} data={dataTable} theme={theme} />
      </div>
    );
  } else {
    body = <EmptyState message="No data available" />;
  }

  return (
    <Card
      title="PRODUCT PERFORMANCE"
      subtitle="All 12 watches ranked by revenue"
      bodyClassName="pt-[4px]"
    >
      {body}
    </Card>
  );
}
