import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

import AccountSettingsPage from "./AccountSettingsPage.jsx";
import { changePassword, deleteAccount } from "../api/api.js";

vi.mock("../api/api.js", () => ({
    changePassword: vi.fn(),
    deleteAccount: vi.fn(),
}));

describe("AccountSettingsPage", () => {
    it("changes a password after confirmation", async () => {
        const user = userEvent.setup();
        changePassword.mockResolvedValue({ message: "Password updated successfully." });

        render(
            <MemoryRouter>
                <AccountSettingsPage
                    currentUser={{ username: "traveler" }}
                    onAccountDeleted={vi.fn()}
                />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText("Current Password", { selector: "input[name='currentPassword']" }), "oldPassword");
        await user.type(screen.getByLabelText("New Password"), "newPassword");
        await user.type(screen.getByLabelText("Confirm New Password"), "newPassword");
        await user.click(screen.getByRole("button", { name: "Update Password" }));

        expect(changePassword).toHaveBeenCalledWith("oldPassword", "newPassword");
        expect(await screen.findByRole("status")).toHaveTextContent("Password updated successfully.");
    });

    it("requires explicit confirmation before account deletion", async () => {
        const user = userEvent.setup();
        const onAccountDeleted = vi.fn();
        deleteAccount.mockResolvedValue({ message: "Account deleted successfully." });

        render(
            <MemoryRouter>
                <AccountSettingsPage
                    currentUser={{ username: "traveler" }}
                    onAccountDeleted={onAccountDeleted}
                />
            </MemoryRouter>
        );

        const deleteButton = screen.getByRole("button", { name: "Delete Account Permanently" });
        expect(deleteButton).toBeDisabled();

        await user.type(screen.getAllByLabelText("Current Password")[1], "password");
        await user.click(screen.getByLabelText(/I understand that this permanently deletes/i));
        await user.click(deleteButton);

        expect(deleteAccount).toHaveBeenCalledWith("password");
        expect(onAccountDeleted).toHaveBeenCalledOnce();
    });

    it("returns to the itinerary that opened account settings", () => {
        render(
            <MemoryRouter
                initialEntries={[{
                    pathname: "/account",
                    state: { from: "/trips/42/tokyo-spring" },
                }]}
            >
                <AccountSettingsPage
                    currentUser={{ username: "traveler" }}
                    onAccountDeleted={vi.fn()}
                />
            </MemoryRouter>
        );

        expect(screen.getByRole("link", { name: /Back to Itinerary/ }))
            .toHaveAttribute("href", "/trips/42/tokyo-spring");
    });
});
