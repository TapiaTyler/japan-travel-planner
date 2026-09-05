import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import LandingPage from "./LandingPage.jsx";

function renderPage(props = {}) {
    render(
        <MemoryRouter>
            <LandingPage currentUser={null} onStart={vi.fn()} {...props} />
        </MemoryRouter>
    );
}

describe("LandingPage", () => {
    it("introduces the planner and links visitors to the public library", () => {
        renderPage();

        expect(screen.getByRole("heading", { name: "Your Japan trip, all in one place." }))
            .toBeInTheDocument();
        expect(screen.getAllByRole("link", { name: /Explore the Trip Library|Browse Templates/ }))
            .toHaveLength(2);
    });

    it("opens registration for a signed-out visitor", async () => {
        const user = userEvent.setup();
        const onStart = vi.fn();
        renderPage({ onStart });

        await user.click(screen.getByRole("button", { name: /Start Planning/ }));

        expect(onStart).toHaveBeenCalledOnce();
    });

    it("sends an authenticated user to their trips", () => {
        renderPage({ currentUser: { username: "traveler" } });

        expect(screen.getByRole("link", { name: /View My Trips/ }))
            .toHaveAttribute("href", "/trips");
    });
});
