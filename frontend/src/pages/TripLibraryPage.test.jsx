import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TripLibraryPage from "./TripLibraryPage.jsx";
import useTripLibrary from "../hooks/useTripLibrary.js";

vi.mock("../hooks/useTripLibrary.js", () => ({ default: vi.fn() }));

const featuredTemplate = {
    id: 1,
    name: "Tokyo Highlights",
    durationDays: 3,
    notes: "A first visit to Tokyo.",
    publicTemplate: true,
    itemCount: 1,
    destinations: ["Tokyo"],
    totalCost: 4000,
    items: [{ id: 10, itemType: "Activity", name: "Senso-ji", dateOffset: 0, location: "Asakusa" }],
};

function libraryState() {
    return {
        publicTemplates: [featuredTemplate],
        myTemplates: [],
        savedItems: [],
        loading: false,
        error: "",
        createTripFromTemplate: vi.fn(),
        removeTemplate: vi.fn(),
        addSavedItem: vi.fn(),
        removeSavedItem: vi.fn(),
    };
}

describe("TripLibraryPage", () => {
    it("lets signed-out visitors preview templates and requests authentication to use one", async () => {
        const user = userEvent.setup();
        const onRequireAuth = vi.fn();
        useTripLibrary.mockReturnValue(libraryState());

        render(
            <TripLibraryPage
                currentUser={null}
                onRequireAuth={onRequireAuth}
                onTripCreated={vi.fn()}
            />
        );

        expect(screen.getByRole("heading", { name: "Tokyo Highlights" })).toBeInTheDocument();
        await user.click(screen.getByText("Preview itinerary"));
        expect(screen.getByText("Senso-ji")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Use Template" }));
        expect(onRequireAuth).toHaveBeenCalledOnce();
        expect(screen.queryByLabelText("Start Date")).not.toBeInTheDocument();
    });

    it("opens the trip setup form for an authenticated user", async () => {
        const user = userEvent.setup();
        useTripLibrary.mockReturnValue(libraryState());

        render(
            <TripLibraryPage
                currentUser={{ username: "traveler" }}
                onRequireAuth={vi.fn()}
                onTripCreated={vi.fn()}
            />
        );

        await user.click(screen.getByRole("button", { name: "Use Template" }));
        expect(screen.getByRole("dialog")).toHaveTextContent("Use Tokyo Highlights");
        expect(screen.getByLabelText("Trip Name")).toHaveValue("Tokyo Highlights");
        expect(screen.getByLabelText("Start Date")).toBeRequired();
    });

    it("resumes the selected template after in-place authentication", async () => {
        const user = userEvent.setup();
        useTripLibrary.mockReturnValue(libraryState());
        const props = {
            onRequireAuth: vi.fn(),
            onTripCreated: vi.fn(),
        };
        const { rerender } = render(
            <TripLibraryPage currentUser={null} {...props} />
        );

        await user.click(screen.getByRole("button", { name: "Use Template" }));
        rerender(
            <TripLibraryPage currentUser={{ username: "traveler" }} {...props} />
        );

        expect(screen.getByRole("dialog")).toHaveTextContent("Use Tokyo Highlights");
        expect(screen.getByLabelText("Trip Name")).toHaveValue("Tokyo Highlights");
    });

    it("opens saved-item setup with dates constrained to the destination trip", async () => {
        const user = userEvent.setup();
        useTripLibrary.mockReturnValue({
            ...libraryState(),
            savedItems: [{
                id: 20,
                itemType: "Lodging",
                name: "Kyoto Hotel",
                location: "Kyoto",
                cost: null,
                endDateOffset: 2,
            }],
        });

        render(
            <TripLibraryPage
                currentUser={{ username: "traveler" }}
                trips={[{
                    id: 4,
                    name: "Spring Japan",
                    startDate: "2027-04-01",
                    endDate: "2027-04-10",
                }]}
                onRequireAuth={vi.fn()}
                onTripCreated={vi.fn()}
                onItemAdded={vi.fn()}
            />
        );

        await user.click(screen.getByRole("button", { name: "Add to Trip" }));

        expect(screen.getByLabelText("Destination Trip")).toHaveValue("4");
        expect(screen.getByLabelText("Lodging Date")).toHaveAttribute("min", "2027-04-01");
        expect(screen.getByLabelText("Lodging Date")).toHaveAttribute("max", "2027-04-08");
    });
});
