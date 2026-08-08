import { WatchImage } from "@/components/WatchImage";
import type { CatalogProduct } from "@/lib/catalog";
import { formatCurrency } from "@/lib/catalog";

interface ProductPanelProps {
  product: CatalogProduct;
}

/**
 * Full-height dark indigo product panel for the analytics detail view.
 *
 * Left side of the split layout (~520px wide, full height).
 * Shows brand, model, description and a large product image.
 */
export function ProductPanel({ product }: ProductPanelProps) {
  return (
    <div
      className="flex flex-col bg-panel rounded-none h-full px-[40px] pt-[100px] pb-[40px]"
      style={{ width: 520, minWidth: 520 }}
    >
      {/* Brand & Model */}
      <p className="text-[length:var(--text-100)] font-semibold uppercase tracking-[0.14em] text-panel-muted m-0">
        {product.brand} · {product.gender}
      </p>
      <h2 className="text-[length:var(--text-600)] font-semibold text-panel-foreground m-0 mt-[8px]">
        {product.name}
      </h2>
      <p className="text-[length:var(--text-200)] text-panel-muted m-0 mt-[6px]">
        {formatCurrency(product.price)} · {product.units} units sold
      </p>
      <p className="text-[length:var(--text-300)] leading-400 text-panel-muted m-0 mt-[16px]">
        {product.description}
      </p>

      {/* Product image — centered vertically in remaining space */}
      <div className="flex-1 flex items-center justify-center py-[40px]">
        <WatchImage
          src={product.url}
          alt={product.name}
          variant="light"
          className="w-[300px] h-[360px]"
        />
      </div>
    </div>
  );
}
