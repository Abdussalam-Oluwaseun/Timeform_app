import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
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
 * Supports mouse wheel/trackpad scrolling, drag/swipe gestures,
 * arrow-key keyboard navigation, and card click selection.
 */
export function WatchCarousel({ products, onAnalyze, onSelectionChange }: WatchCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isScrollingRef = useRef(false);

  // Reset selectedIndex if products array changes (e.g., filter changed)
  useEffect(() => {
    setSelectedIndex(0);
  }, [products]);

  const selectedProduct = products[selectedIndex] ?? products[0];

  // Notify parent when selection changes
  useEffect(() => {
    if (selectedProduct) {
      onSelectionChange?.(selectedProduct);
    }
  }, [selectedProduct, onSelectionChange]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => Math.min(products.length - 1, prev + 1));
  }, [products.length]);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleAnalyze = useCallback(
    () => onAnalyze(selectedProduct),
    [onAnalyze, selectedProduct],
  );

  // Keyboard arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Wheel / Trackpad scroll navigation with smooth throttling
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 15 || isScrollingRef.current) return;

      if (delta > 0) {
        handleNext();
      } else {
        handlePrev();
      }

      isScrollingRef.current = true;
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 250);
    },
    [handleNext, handlePrev],
  );

  // Pan / Swipe gesture handler
  const handlePanEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const swipeThreshold = 30;
      if (info.offset.x < -swipeThreshold || info.velocity.x < -150) {
        handleNext();
      } else if (info.offset.x > swipeThreshold || info.velocity.x > 150) {
        handlePrev();
      }
    },
    [handleNext, handlePrev],
  );

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[420px] text-muted-foreground">
        No watches to display
      </div>
    );
  }

  // Calculate visible side products
  const leftProducts: { product: CatalogProduct; originalIndex: number }[] = [];
  for (let i = SIDE_COUNT; i >= 1; i--) {
    const idx = selectedIndex - i;
    if (idx >= 0 && products[idx]) {
      leftProducts.push({ product: products[idx], originalIndex: idx });
    }
  }

  const rightProducts: { product: CatalogProduct; originalIndex: number }[] = [];
  for (let i = 1; i <= SIDE_COUNT; i++) {
    const idx = selectedIndex + i;
    if (idx < products.length && products[idx]) {
      rightProducts.push({ product: products[idx], originalIndex: idx });
    }
  }

  return (
    <motion.div
      onWheel={handleWheel}
      onPanEnd={handlePanEnd}
      className="relative flex items-center justify-center w-full max-w-[1280px] px-[24px] py-[12px] cursor-grab active:cursor-grabbing touch-pan-y select-none"
    >
      {/* Carousel Cards Container */}
      <div className="flex items-end justify-center gap-[28px] min-h-[360px]">
        {/* Left Cards */}
        <div className="flex items-end gap-[20px] pb-[16px]">
          <AnimatePresence mode="popLayout">
            {leftProducts.map(({ product, originalIndex }) => (
              <motion.div
                key={product.productId}
                layout
                initial={{ opacity: 0, scale: 0.8, x: -30 }}
                animate={{ opacity: 0.55, scale: 0.88, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -30 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              >
                <WatchCard product={product} onClick={() => handleSelect(originalIndex)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Selected Center Hero Card */}
        {selectedProduct && (
          <SelectedWatchPanel
            product={selectedProduct}
            onAnalyze={handleAnalyze}
          />
        )}

        {/* Right Cards */}
        <div className="flex items-end gap-[20px] pb-[16px]">
          <AnimatePresence mode="popLayout">
            {rightProducts.map(({ product, originalIndex }) => (
              <motion.div
                key={product.productId}
                layout
                initial={{ opacity: 0, scale: 0.8, x: 30 }}
                animate={{ opacity: 0.55, scale: 0.88, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 30 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              >
                <WatchCard product={product} onClick={() => handleSelect(originalIndex)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

