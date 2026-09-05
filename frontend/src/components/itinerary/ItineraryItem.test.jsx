import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ItineraryItem from "./ItineraryItem.jsx";

const activity = {
    id: 1,
    itemType: "Activity",
    name: "Fushimi Inari Taisha",
    cost: null,
    notes: "Arrive early.",
};

describe("ItineraryItem map link", () => {
    it("shows a safe Google Maps link when a map location is provided", () => {
        render(
            <ItineraryItem
                item={{
                    ...activity,
                    mapSearchQuery: "Fushimi Inari Taisha, Kyoto",
                }}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        const link = screen.getByRole("link", { name: "Open in Maps" });

        expect(link).toHaveAttribute(
            "href",
            "https://www.google.com/maps/search/?api=1&query=Fushimi%20Inari%20Taisha%2C%20Kyoto"
        );
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(link).toHaveAttribute("title", "Open in Maps");
        expect(link).not.toHaveTextContent("Open in Maps");
    });

    it("does not show a map link when no map location is provided", () => {
        render(
            <ItineraryItem
                item={activity}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );

        expect(
            screen.queryByRole("link", { name: "Open in Maps" })
        ).not.toBeInTheDocument();
    });
});
