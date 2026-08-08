import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "./components/Navigation";
import { CogentBrand } from "./components/CogentBrand";
import { ErrorBanner, LoadingSkeleton } from "./components/Feedback";
import { CollectionPage } from "./features/collection";
import { WatchAnalyticsPage } from "./features/analytics";
import { SalesDashboardPage } from "./features/dashboard";
import { useProductCatalog } from "./hooks/use-product-catalog";
import type { CatalogProduct } from "./lib/catalog";

type ViewId = "collection" | "analytics" | "dashboard";

/** Nav bar height in px (py-18 * 2 + ~20px line-height + 1px border). */
const NAV_HEIGHT = 57;

/**
 * Main application shell.
 *
 * Manages view routing between Collection, Analytics Detail and the flat
 * Sales Dashboard. On the analytics view the Navigation is overlaid so the
 * dark product panel can extend behind it to the top of the viewport.
 */
function App() {
  const { products, isLoading, error } = useProductCatalog();
  const [activeView, setActiveView] = useState<ViewId>("collection");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);

  const activeProduct = selectedProduct ?? products[0] ?? null;

  const handleNavigate = useCallback((view: ViewId) => {
    setActiveView(view);
  }, []);

  const handleAnalyze = useCallback((product: CatalogProduct) => {
    setSelectedProduct(product);
    setActiveView("analytics");
  }, []);

  const handleSelectionChange = useCallback((product: CatalogProduct) => {
    setSelectedProduct(product);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-background flex items-center justify-center">
        <div className="w-full max-w-[520px] px-[48px]">
          <p className="text-[length:var(--text-100)] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-[12px]">
            ~ TIMEFORM
          </p>
          <LoadingSkeleton height={240} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-background flex items-center justify-center p-[48px]">
        <div className="w-full max-w-[560px]">
          <ErrorBanner message={error.message} />
          <p className="text-[length:var(--text-200)] text-muted-foreground mt-[12px]">
            The watch catalog could not be loaded from the semantic model.
          </p>
        </div>
      </div>
    );
  }

  const isAnalytics = activeView === "analytics";

  return (
    <div className="w-full h-full relative bg-background overflow-hidden">
      {/* Navigation — overlays on analytics so panel extends behind it */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <Navigation
          activeView={activeView}
          onNavigate={handleNavigate}
          variant={isAnalytics ? "overlay" : "default"}
        />
      </div>

      <AnimatePresence mode="wait">
        {activeView === "collection" ? (
          <motion.div
            key="collection"
            className="absolute left-0 right-0 bottom-0"
            style={{ top: NAV_HEIGHT }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <CollectionPage
              products={products}
              onAnalyze={handleAnalyze}
              onSelectionChange={handleSelectionChange}
            />
          </motion.div>
        ) : activeView === "analytics" && activeProduct ? (
          <motion.div
            key="analytics"
            className="absolute inset-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <WatchAnalyticsPage product={activeProduct} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            className="absolute left-0 right-0 bottom-0"
            style={{ top: NAV_HEIGHT }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <SalesDashboardPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand watermark (hidden on analytics where the dark panel covers it) */}
      {!isAnalytics && <CogentBrand />}
    </div>
  );
}

export default App;
