import { motion } from "framer-motion";
import { WatchImage } from "@/components/WatchImage";
import type { CatalogProduct } from "@/lib/catalog";
import { formatCurrency } from "@/lib/catalog";

interface WatchCardProps {
  product: CatalogProduct;
  onClick: () => void;
}

/**
 * Smaller surrounding watch card in the carousel.
 *
 * Shows the product image with brand/model label and price.
 */
export function WatchCard({ product, onClick }: WatchCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer bg-transparent border-none p-0 outline-none"
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <WatchImage
        src={product.url}
        alt={product.name}
        className="w-[120px] h-[140px] mb-[10px]"
      />
      <span className="text-[length:11px] font-semibold text-foreground">
        {product.brand} {product.name.replace(`${product.brand} `, "")}
      </span>
      <span className="text-[length:var(--text-200)] text-muted-foreground mt-[2px]">
        {formatCurrency(product.price)}
      </span>
    </motion.button>
  );
}
