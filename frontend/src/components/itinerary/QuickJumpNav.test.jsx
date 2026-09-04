import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import QuickJumpNav from "./QuickJumpNav.jsx";

describe("QuickJumpNav", () => {
    it("marks the active group and keeps jump controls interactive", async () => {
        const user = userEvent.setup();
        const onJump = vi.fn();

        render(
            <QuickJumpNav
                groupBy="date"
                groupedByDate={{
                    "2027-11-02": [],
                    "2027-11-07": [],
                }}
                groupedByLocation={{}}
                activeGroup="2027-11-07"
                onJump={onJump}
            />
        );

        expect(screen.getByRole("button", { name: "Nov 7" }))
            .toHaveAttribute("aria-current", "location");

        await user.click(screen.getByRole("button", { name: "Nov 2" }));

        expect(onJump).toHaveBeenCalledWith("2027-11-02");
    });
});
