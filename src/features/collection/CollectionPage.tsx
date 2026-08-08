import { useState, useCallback, useMemo } from "react";
import { CollectionHeader } from "./CollectionHeader";
import { WatchFilters, type GenderFilter } from "./WatchFilters";
import { WatchCarousel } from "./WatchCarousel";
import { CollectionMetrics } from "./CollectionMetrics";
import type { CatalogProduct } from "@/lib/catalog";

interface CollectionPageProps {
  products: CatalogProduct[];
  onAnalyze: (product: CatalogProduct) => void;
  onSelectionChange?: (product: CatalogProduct) => void;
}

/**
 * View 1 — Watch Collection page.
 *
 * Header → filters → carousel → metrics. Tracks the selected watch so the
 * bottom metrics reflect its real sales data.
 */
export function CollectionPage({ products, onAnalyze, onSelectionChange }: CollectionPageProps) {
  const [filter, setFilter] = useState<GenderFilter>("all");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);

  const filteredProducts = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((p) => p.gender === filter);
  }, [products, filter]);

  const activeProduct = selectedProduct ?? filteredProducts[0] ?? null;

  const handleFilterChange = useCallback((newFilter: GenderFilter) => {
    setFilter(newFilter);
    setSelectedProduct(null);
  }, []);

  // Stable callback so the carousel's selection effect doesn't re-fire.
  const handleSelectionChange = useCallback(
    (product: CatalogProduct) => {
      setSelectedProduct(product);
      onSelectionChange?.(product);
    },
    [onSelectionChange],
  );

  return (
    <div className="relative flex flex-col h-full">
      <CollectionHeader />
      <WatchFilters activeFilter={filter} onFilterChange={handleFilterChange} />

      {/* Carousel — fills remaining space */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <WatchCarousel
          key={filter}
          products={filteredProducts}
          onAnalyze={onAnalyze}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {activeProduct && (
        <CollectionMetrics
          selectedProduct={activeProduct}
          totalCount={filteredProducts.length}
        />
      )}
    </div>
  );
}
