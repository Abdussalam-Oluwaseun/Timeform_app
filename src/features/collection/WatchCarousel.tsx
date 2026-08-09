import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectedWatchPanel } from "./SelectedWatchPanel";
import { WatchCard } from "./WatchCard";
import type { CatalogProduct } from "@/lib/catalog";

interface WatchCarouselProps {
  products: CatalogProduct[];
  onAnalyze: (product: CatalogProduct) => void;
  /** Called when the selected watch changes (e.g. clicking a surrounding card). */
  onSelectionChange?: (product: CatalogProduct) => void;
}

/** Maximum surrounding cards to show on each side of the selected watch. */
const SIDE_COUNT = 2;

/**
 * Horizontal watch carousel with a hero center panel.
 *
 * The selected watch occupies a large dark-indigo panel in the center.
 * Surrounding watches appear at reduced opacity and scale.
 */
export function WatchCarousel({ products, onAnalyze, onSelectionChange }: WatchCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedProduct = products[selectedIndex] ?? products[0];

  // Notify parent when selection changes
  useEffect(() => {
    if (selectedProduct) {
      onSelectionChange?.(selectedProduct);
    }
  }, [selectedProduct, onSelectionChange]);

  const handleSelect = useCallback((index: number) => setSelectedIndex(index), []);

  const handleAnalyze = useCallback(
    () => onAnalyze(selectedProduct),
    [onAnalyze, selectedProduct],
  );

  /** Products to show on the left side of the selected product. */
  const leftProducts = useMemo(() => {
    const items: { product: CatalogProduct; originalIndex: number }[] = [];
    for (let i = 1; i <= SIDE_COUNT; i++) {
      const idx = selectedIndex - i;
      if (idx >= 0 && products[idx]) {
        items.unshift({ product: products[idx], originalIndex: idx });
      }
    }
    return items;
  }, [products, selectedIndex]);

  /** Products to show on the right side of the selected product. */
  const rightProducts = useMemo(() => {
    const items: { product: CatalogProduct; originalIndex: number }[] = [];
    for (let i = 1; i <= SIDE_COUNT; i++) {
      const idx = selectedIndex + i;
      if (idx < products.length && products[idx]) {
        items.push({ product: products[idx], originalIndex: idx });
      }
    }
    return items;
  }, [products, selectedIndex]);

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[420px] text-muted-foreground">
        No watches to display
      </div>
    );
  }

  return (
    <div className="flex items-end justify-center gap-[32px] px-[48px] py-[8px]">
      {/* Left surrounding watches */}
      <div className="flex items-end gap-[24px] pb-[24px]">
        <AnimatePresence mode="popLayout">
          {leftProducts.map(({ product, originalIndex }) => (
            <motion.div
              key={product.productId}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 0.5, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <WatchCard product={product} onClick={() => handleSelect(originalIndex)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Selected center panel */}
      <AnimatePresence mode="wait">
        <SelectedWatchPanel
          key={selectedProduct.productId}
          product={selectedProduct}
          onAnalyze={handleAnalyze}
        />
      </AnimatePresence>

      {/* Right surrounding watches */}
      <div className="flex items-end gap-[24px] pb-[24px]">
        <AnimatePresence mode="popLayout">
          {rightProducts.map(({ product, originalIndex }) => (
            <motion.div
              key={product.productId}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 0.5, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <WatchCard product={product} onClick={() => handleSelect(originalIndex)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
