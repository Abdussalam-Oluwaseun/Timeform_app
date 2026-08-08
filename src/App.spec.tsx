//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";

// Mock the Fabric client module so the app runs offline in tests.
const mockQuery = vi.fn();

vi.mock("@/lib/fabric-client", () => ({
    getFabricClient: () => ({
        clearCache: vi.fn(),
        semanticModel: () => ({
            query: mockQuery,
            clearCache: vi.fn(),
        }),
    }),
}));

/** A single-product catalog result matching the product-catalog query shape. */
const catalogTable = {
    columns: [
        { name: "products[productid]" },
        { name: "products[brand]" },
        { name: "products[gender]" },
        { name: "products[productname]" },
        { name: "products[description]" },
        { name: "products[price]" },
        { name: "products[url]" },
        { name: "[Units]" },
        { name: "[Revenue]" },
        { name: "[Orders]" },
    ],
    rows: [
        [1, "Omega", "Men", "Omega Smart Watch M1", "A luxury smartwatch.", 163.5, "https://example.com/omega.png", 68, 11118, 31],
    ],
};

describe("App", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockQuery.mockResolvedValue({
            status: "success",
            table: catalogTable,
            fromCache: false,
            cachedAt: undefined,
        });
    });

    it("renders the watch collection after loading the catalog", async () => {
        render(<App />);
        await waitFor(() =>
            expect(screen.getByRole("heading", { name: /watch collection/i })).toBeInTheDocument(),
        );
    });

    it("shows navigation buttons for all views", async () => {
        render(<App />);
        await waitFor(() =>
            expect(screen.getByRole("heading", { name: /watch collection/i })).toBeInTheDocument(),
        );

        for (const label of ["Collection", "Performance", "Dashboard"]) {
            expect(screen.getByRole("button", { name: new RegExp(label, "i") })).toBeInTheDocument();
        }
    });

    it("mounts content into the document", () => {
        render(<App />);
        expect(document.body).not.toBeEmptyDOMElement();
    });
});
