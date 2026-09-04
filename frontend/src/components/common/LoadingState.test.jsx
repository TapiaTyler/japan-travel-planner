import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoadingState from "./LoadingState.jsx";

describe("LoadingState", () => {
    it("announces loading status accessibly", () => {
        render(
            <LoadingState
                title="Loading Trips"
                message="Retrieving your saved trips..."
            />
        );

        const status = screen.getByRole("status");
        expect(status).toHaveAttribute("aria-busy", "true");
        expect(status).toHaveTextContent("Loading Trips");
        expect(status).toHaveTextContent("Retrieving your saved trips...");
    });
});
