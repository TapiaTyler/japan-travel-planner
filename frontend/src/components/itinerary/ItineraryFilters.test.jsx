import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ItineraryFilters from "./ItineraryFilters.jsx";
import { EMPTY_ITINERARY_FILTERS } from "../../utils/itineraryFilters.js";

function renderFilters(overrides = {}) {
    const onChange = vi.fn();
    const filters = {
        ...EMPTY_ITINERARY_FILTERS,
        ...overrides,
    };

    render(
        <ItineraryFilters
            filters={filters}
            locations={["Kyoto", "Tokyo"]}
            onChange={onChange}
            onReset={vi.fn()}
        />
    );

    return { filters, onChange };
}

describe("ItineraryFilters", () => {
    it("shows every multi-select option as selected by default", () => {
        renderFilters();

        const checkboxes = screen.getAllByRole("checkbox");
        expect(checkboxes).toHaveLength(15);
        checkboxes.forEach((checkbox) => {
            expect(checkbox).toBeChecked();
        });
    });

    it("narrows an all-selected group when an option is unchecked", async () => {
        const user = userEvent.setup();
        const { filters, onChange } = renderFilters();

        await user.click(screen.getByRole("checkbox", { name: "Activities" }));

        expect(onChange).toHaveBeenCalledWith({
            ...filters,
            itemTypes: ["Transportation", "Lodging"],
        });
    });

    it("restores a partially selected group with Select All", async () => {
        const user = userEvent.setup();
        const { filters, onChange } = renderFilters({
            costStatuses: ["CONFIRMED"],
        });

        await user.click(
            screen.getByRole("button", { name: "Select All Cost Statuses" })
        );

        expect(onChange).toHaveBeenCalledWith({
            ...filters,
            costStatuses: [],
        });
    });

    it("uses the standard Cost Status order", () => {
        renderFilters();

        const group = screen.getByRole("group", { name: "Cost Status" });
        const names = within(group)
            .getAllByRole("checkbox")
            .map((checkbox) => checkbox.getAttribute("aria-label") ||
                checkbox.parentElement.textContent.trim());

        expect(names).toEqual(["Confirmed", "Estimated", "Unknown"]);
    });
});
