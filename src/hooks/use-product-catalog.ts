//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { useMemo } from "react";
import { useSemanticModelQuery } from "./use-semantic-model-query";
import { productCatalog } from "@/queries/catalog/product-catalog";
import { rowsToProducts, type CatalogProduct } from "@/lib/catalog";

/**
 * Fetches the full watch catalog (all products + per-product sales measures)
 * and maps it to typed `CatalogProduct` objects.
 *
 * The SDK caches the query result, so multiple consumers (App shell,
 * collection page) share a single fetch.
 */
export function useProductCatalog() {
  const { connection, query } = productCatalog();
  const { data, isLoading, error, refetch } = useSemanticModelQuery({ connection, query });

  const products = useMemo<CatalogProduct[]>(
    () => (data?.status === "success" ? rowsToProducts(data.table) : []),
    [data],
  );

  return { products, isLoading, error, refetch };
}
