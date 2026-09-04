import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App.jsx";
import useAuth from "./hooks/useAuth.js";
import useItinerary from "./hooks/useItinerary.js";
import useTrips from "./hooks/useTrips.js";

vi.mock("./hooks/useAuth.js", () => ({ default: vi.fn() }));
vi.mock("./hooks/useItinerary.js", () => ({ default: vi.fn() }));
vi.mock("./hooks/useTrips.js", () => ({ default: vi.fn() }));

vi.mock("./components/common/AppHeader.jsx", () => ({
    default: () => <header>Japan Travel Planner</header>,
}));

vi.mock("./pages/AuthPage.jsx", () => ({
    default: () => <section>Authentication page</section>,
}));

vi.mock("./pages/TripsPage.jsx", () => ({
    default: ({ handleSelectTrip }) => (
        <section>
            <h2>My Trips</h2>
            <button
                type="button"
                onClick={() => handleSelectTrip({
                    id: 42,
                    name: "Tokyo Spring",
                })}
            >
                Open Tokyo Spring
            </button>
        </section>
    ),
}));

vi.mock("./pages/TripDetailsPage.jsx", () => ({
    default: ({ tripState }) => (
        <section>Itinerary for {tripState.selectedTrip.name}</section>
    ),
}));

function LocationProbe() {
    const location = useLocation();
    return <output aria-label="Current path">{location.pathname}</output>;
}

function renderAt(path) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <App />
            <LocationProbe />
        </MemoryRouter>
    );
}

function createTripState(overrides = {}) {
    return {
        trips: [],
        selectedTrip: null,
        loadingTrips: false,
        hasLoadedTrips: true,
        addingTrip: false,
        editingTrip: null,
        tripToDelete: null,
        setAddingTrip: vi.fn(),
        setEditingTrip: vi.fn(),
        setTripToDelete: vi.fn(),
        handleSelectTrip: vi.fn(),
        handleAddTrip: vi.fn(),
        handleSaveTrip: vi.fn(),
        handleDuplicateTrip: vi.fn(),
        handleConfirmDeleteTrip: vi.fn(),
        handleBackToTrips: vi.fn(),
        ...overrides,
    };
}

describe("application routing", () => {
    const currentUser = { username: "traveler" };

    beforeEach(() => {
        useAuth.mockReturnValue({
            currentUser,
            checkingSession: false,
            sessionExpired: false,
            authMode: "login",
            setAuthMode: vi.fn(),
            handleLogin: vi.fn(),
            handleRegister: vi.fn(),
            handleLogout: vi.fn(),
            handleSessionExpired: vi.fn(),
        });

        useItinerary.mockReturnValue({});
        useTrips.mockReturnValue(createTripState());
    });

    it("shows the branded loading screen while restoring the session", () => {
        useAuth.mockReturnValue({
            currentUser: null,
            checkingSession: true,
        });

        renderAt("/login");

        const loadingStatus = screen
            .getByText("Restoring your session...")
            .closest('[role="status"]');

        expect(loadingStatus).toHaveTextContent(
            "Japan Travel PlannerRestoring your session..."
        );
        expect(screen.queryByText("Authentication page"))
            .not.toBeInTheDocument();
    });

    it("redirects protected routes to login when signed out", async () => {
        useAuth.mockReturnValue({
            currentUser: null,
            checkingSession: false,
            sessionExpired: false,
            authMode: "login",
            setAuthMode: vi.fn(),
            handleLogin: vi.fn(),
            handleRegister: vi.fn(),
            handleLogout: vi.fn(),
            handleSessionExpired: vi.fn(),
        });

        renderAt("/trips/42/tokyo-spring");

        expect(await screen.findByText("Authentication page"))
            .toBeInTheDocument();
        expect(screen.getByLabelText("Current path"))
            .toHaveTextContent("/login");
    });

    it("restores an itinerary directly from its URL", () => {
        const selectedTrip = { id: 42, name: "Tokyo Spring" };
        useTrips.mockReturnValue(createTripState({ selectedTrip }));

        renderAt("/trips/42/tokyo-spring");

        expect(useTrips).toHaveBeenCalledWith(currentUser, "42");
        expect(screen.getByText("Itinerary for Tokyo Spring"))
            .toBeInTheDocument();
    });

    it("replaces an outdated slug with the canonical trip URL", async () => {
        const selectedTrip = { id: 42, name: "Tokyo Spring" };
        useTrips.mockReturnValue(createTripState({ selectedTrip }));

        renderAt("/trips/42/old-name");

        await waitFor(() => {
            expect(screen.getByLabelText("Current path"))
                .toHaveTextContent("/trips/42/tokyo-spring");
        });
    });

    it("shows a private not-found message for an unavailable trip", () => {
        renderAt("/trips/999/missing-trip");

        expect(screen.getByRole("heading", { name: "Trip not found" }))
            .toBeInTheDocument();
        expect(screen.getByText(/may not belong to your account/i))
            .toBeInTheDocument();
    });

    it("navigates to the stable ID and readable slug when selected", async () => {
        const user = userEvent.setup();
        const tripState = createTripState();
        useTrips.mockReturnValue(tripState);

        renderAt("/trips");
        await user.click(
            screen.getByRole("button", { name: "Open Tokyo Spring" })
        );

        expect(tripState.handleSelectTrip).toHaveBeenCalledOnce();
        expect(screen.getByLabelText("Current path"))
            .toHaveTextContent("/trips/42/tokyo-spring");
    });
});
