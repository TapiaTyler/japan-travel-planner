import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

import LoginForm from "../auth/LoginForm.jsx";
import TripList from "../trips/TripList.jsx";
import AppHeader from "./AppHeader.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";

function createDeferredPromise() {
    let resolve;
    const promise = new Promise((promiseResolve) => {
        resolve = promiseResolve;
    });

    return { promise, resolve };
}

describe("mutation loading states", () => {
    it("prevents duplicate login submissions while authentication is pending", async () => {
        const user = userEvent.setup();
        const pendingLogin = createDeferredPromise();
        const onLogin = vi.fn(() => pendingLogin.promise);

        render(<LoginForm onLogin={onLogin} onShowRegister={vi.fn()} />);

        await user.type(screen.getByLabelText("Username"), "traveler");
        await user.type(screen.getByLabelText("Password"), "password");
        await user.click(screen.getByRole("button", { name: "Login" }));

        const form = screen.getByRole("heading", { name: "Login" }).closest("form");
        expect(form).toHaveAttribute("aria-busy", "true");
        expect(screen.getByRole("button", { name: "Signing In..." })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Create Account" })).toBeDisabled();
        expect(onLogin).toHaveBeenCalledTimes(1);

        pendingLogin.resolve();

        expect(await screen.findByRole("button", { name: "Login" })).toBeEnabled();
        expect(form).toHaveAttribute("aria-busy", "false");
    });

    it("disables confirmation actions while deletion is pending", async () => {
        const user = userEvent.setup();
        const pendingDelete = createDeferredPromise();
        const onConfirm = vi.fn(() => pendingDelete.promise);

        render(
            <ConfirmDialog
                message="Delete this trip?"
                confirmLabel="Delete"
                onConfirm={onConfirm}
                onCancel={vi.fn()}
            />
        );

        await user.click(screen.getByRole("button", { name: "Delete" }));

        expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
        expect(onConfirm).toHaveBeenCalledTimes(1);

        pendingDelete.resolve();

        expect(await screen.findByRole("button", { name: "Delete" })).toBeEnabled();
    });

    it("keeps the trip menu visible and locked while duplication is pending", async () => {
        const user = userEvent.setup();
        const pendingDuplicate = createDeferredPromise();
        const onDuplicateTrip = vi.fn(() => pendingDuplicate.promise);
        const trip = {
            id: 7,
            name: "Spring in Japan",
            startDate: "2027-03-20",
            endDate: "2027-03-28",
            destinations: ["Tokyo", "Kyoto"],
            totalCost: 125000,
        };

        render(
            <TripList
                trips={[trip]}
                onSelectTrip={vi.fn()}
                onAddTrip={vi.fn()}
                onEditTrip={vi.fn()}
                onDuplicateTrip={onDuplicateTrip}
                onDeleteTrip={vi.fn()}
            />
        );

        await user.click(screen.getByRole("button", { name: "Options for Spring in Japan" }));
        await user.click(screen.getByRole("button", { name: "Duplicate" }));

        expect(screen.getByRole("button", { name: "Duplicating..." })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Edit" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
        expect(onDuplicateTrip).toHaveBeenCalledTimes(1);

        pendingDuplicate.resolve();

        expect(await screen.findByRole("button", { name: "Options for Spring in Japan" })).toBeEnabled();
        expect(screen.queryByRole("button", { name: "Duplicate" })).not.toBeInTheDocument();
    });

    it("shows progress and prevents repeated logout requests", async () => {
        const user = userEvent.setup();
        const pendingLogout = createDeferredPromise();
        const handleLogout = vi.fn(() => pendingLogout.promise);

        render(
            <MemoryRouter>
                <AppHeader
                    currentUser={{ username: "traveler" }}
                    handleLogout={handleLogout}
                    theme="light"
                    onToggleTheme={vi.fn()}
                />
            </MemoryRouter>
        );

        await user.click(screen.getByRole("button", { name: "traveler" }));
        await user.click(screen.getByRole("menuitem", { name: "Logout" }));

        expect(screen.getByRole("menuitem", { name: "Logging Out..." })).toBeDisabled();
        expect(handleLogout).toHaveBeenCalledTimes(1);

        pendingLogout.resolve();

        expect(await screen.findByRole("button", { name: "traveler" })).toBeEnabled();
    });
});
