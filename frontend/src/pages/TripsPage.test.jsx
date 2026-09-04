import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TripsPage from "./TripsPage.jsx";

function renderTripsPage(overrides = {}) {
    render(
        <TripsPage
            trips={[]}
            loadingTrips={false}
            hasLoadedTrips={false}
            tripError=""
            addingTrip={false}
            editingTrip={null}
            tripToDelete={null}
            setAddingTrip={vi.fn()}
            setEditingTrip={vi.fn()}
            setTripToDelete={vi.fn()}
            handleSelectTrip={vi.fn()}
            handleAddTrip={vi.fn()}
            handleSaveTrip={vi.fn()}
            handleDuplicateTrip={vi.fn()}
            handleConfirmDeleteTrip={vi.fn()}
            {...overrides}
        />
    );
}

describe("TripsPage loading", () => {
    it("does not show the empty state before the first request completes", () => {
        renderTripsPage();

        expect(screen.getByRole("status")).toHaveTextContent("Loading Trips");
        expect(screen.queryByText("No trips yet")).not.toBeInTheDocument();
    });

    it("preserves loaded content during a background refresh", () => {
        renderTripsPage({
            trips: [{
                id: 1,
                name: "Tokyo",
                startDate: "2027-04-01",
                endDate: "2027-04-02",
            }],
            loadingTrips: true,
            hasLoadedTrips: true,
        });

        expect(screen.getByRole("status")).toHaveTextContent(
            "Refreshing trips..."
        );
        expect(screen.getByText("Tokyo")).toBeInTheDocument();
    });
});
