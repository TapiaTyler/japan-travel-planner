import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CostSummary from "./CostSummary.jsx";

describe("CostSummary", () => {
    it("uses the standard item type order", () => {
        const { container } = render(
            <CostSummary
                items={[]}
                searchQuery=""
                hasActiveFilters={false}
            />
        );

        const labels = [...container.querySelectorAll(".cost-summary-label")]
            .map((element) => element.textContent.trim());

        expect(labels).toEqual([
            "Activities",
            "Transportation",
            "Lodging",
        ]);
    });
});
