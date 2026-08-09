import { motion, AnimatePresence } from "framer-motion";
import { WatchImage } from "@/components/WatchImage";
import type { CatalogProduct } from "@/lib/catalog";
import { formatCurrency } from "@/lib/catalog";

interface SelectedWatchPanelProps {
  product: CatalogProduct;
  onAnalyze: () => void;
}

/**
 * Central hero panel in the carousel — dark indigo background with
 * product details, image, price and an Analyze CTA.
 *
 * Uses smooth popLayout transitions for seamless content crossfades.
 */
export function SelectedWatchPanel({ product, onAnalyze }: SelectedWatchPanelProps) {
  return (
    <div
      className="relative flex flex-col items-center bg-panel border border-panel-border/40 rounded-2xl px-[28px] pt-[20px] pb-[18px] shadow-2xl overflow-hidden shrink-0"
      style={{ width: 310, height: 348 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={product.productId}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="w-full h-full flex flex-col items-center justify-between"
        >
          {/* Brand & Model */}
          <div className="w-full text-left">
            <p className="text-[length:var(--text-100)] font-semibold uppercase tracking-[0.14em] text-panel-muted m-0">
              {product.brand} · {product.gender}
            </p>
            <h2 className="text-[length:var(--text-500)] font-semibold text-panel-foreground m-0 mt-[2px] leading-tight">
              {product.name}
            </h2>
          </div>

          {/* Product image */}
          <div className="flex-1 flex items-center justify-center py-[6px]">
            <WatchImage
              src={product.url}
              alt={product.name}
              variant="light"
              className="w-[145px] h-[155px] drop-shadow-xl transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Price + CTA */}
          <div className="w-full flex items-end justify-between">
            <div>
              <p className="text-[length:var(--text-100)] uppercase tracking-[0.1em] text-panel-muted m-0">
                Unit Price
              </p>
              <p
                className="text-[length:var(--text-600)] font-bold text-panel-foreground m-0 mt-[1px]"
                style={{ fontFamily: "var(--font-numeric)" }}
              >
                {formatCurrency(product.price)}
              </p>
              <p className="text-[length:var(--text-100)] font-semibold text-positive m-0 mt-[1px]">
                {product.units} sold · {formatCurrency(product.revenue)}
              </p>
            </div>
            <button
              onClick={onAnalyze}
              className="px-[16px] py-[8px] rounded-md bg-accent text-accent-foreground text-[length:var(--text-200)] font-semibold border-none cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md"
            >
              Analyze →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

