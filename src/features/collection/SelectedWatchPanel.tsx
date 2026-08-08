import { motion } from "framer-motion";
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
 */
export function SelectedWatchPanel({ product, onAnalyze }: SelectedWatchPanelProps) {
  return (
    <motion.div
      layout
      className="relative flex flex-col items-center bg-panel rounded-2xl px-[36px] pt-[28px] pb-[24px]"
      style={{ width: 380, minHeight: 400 }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Brand & Model */}
      <div className="w-full text-left mb-[4px]">
        <p className="text-[length:var(--text-100)] font-semibold uppercase tracking-[0.14em] text-panel-muted m-0">
          {product.brand} · {product.gender}
        </p>
        <h2 className="text-[length:var(--text-600)] font-semibold text-panel-foreground m-0 mt-[4px]">
          {product.name}
        </h2>
        <p className="text-[length:var(--text-200)] text-panel-muted m-0 mt-[4px]">
          {product.description}
        </p>
      </div>

      {/* Product image */}
      <div className="flex-1 flex items-center justify-center py-[12px]">
        <WatchImage
          src={product.url}
          alt={product.name}
          variant="light"
          className="w-[180px] h-[200px]"
        />
      </div>

      {/* Price + CTA */}
      <div className="w-full flex items-end justify-between">
        <div>
          <p className="text-[length:var(--text-100)] uppercase tracking-[0.1em] text-panel-muted m-0">
            Unit Price
          </p>
          <p
            className="text-[length:var(--text-hero-700)] font-bold text-panel-foreground m-0 mt-[2px]"
            style={{ fontFamily: "var(--font-numeric)" }}
          >
            {formatCurrency(product.price)}
          </p>
          <p className="text-[length:var(--text-200)] font-semibold text-positive m-0 mt-[2px]">
            {product.units} sold · {formatCurrency(product.revenue)}
          </p>
        </div>
        <button
          onClick={onAnalyze}
          className="px-[20px] py-[10px] rounded-md bg-accent text-accent-foreground text-[length:var(--text-200)] font-semibold border-none cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          Analyze →
        </button>
      </div>
    </motion.div>
  );
}
