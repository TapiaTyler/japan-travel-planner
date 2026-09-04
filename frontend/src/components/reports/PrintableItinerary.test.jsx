import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PrintableItinerary from "./PrintableItinerary.jsx";

const trip = {
    name: "Spring in Japan",
    startDate: "2027-04-01",
    endDate: "2027-04-10",
};

const options = {
    activities: true,
    transportation: true,
    lodging: true,
    confirmed: true,
    estimated: false,
    unknown: true,
    includeNotes: false,
    includeCostSummary: true,
};

describe("PrintableItinerary", () => {
    it("applies print options only to the visible source items", () => {
        const visibleItems = [
            {
                id: 1,
                itemType: "Activity",
                name: "Visible Activity",
                date: "2027-04-02",
                dayNumber: 2,
                cost: 3000,
                costStatus: "CONFIRMED",
            },
            {
                id: 2,
                itemType: "Transportation",
                name: "Excluded by Print Options",
                date: "2027-04-03",
                dayNumber: 3,
                cost: 14000,
                costStatus: "ESTIMATED",
            },
        ];

        render(
            <PrintableItinerary
                trip={trip}
                items={visibleItems}
                options={options}
            />
        );

        expect(screen.getByText("Visible Activity")).toBeInTheDocument();
        expect(screen.queryByText("Excluded by Print Options"))
            .not.toBeInTheDocument();
        expect(screen.queryByText("Hidden Full-Itinerary Item"))
            .not.toBeInTheDocument();
        expect(screen.getAllByText("¥3,000")).toHaveLength(2);
    });
});
