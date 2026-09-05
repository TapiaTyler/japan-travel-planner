import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

import AppHeader from "./AppHeader.jsx";

function renderHeader(overrides = {}) {
    const props = {
        currentUser: { username: "traveler" },
        handleLogout: vi.fn(),
        theme: "light",
        onToggleTheme: vi.fn(),
        ...overrides,
    };

    render(
        <MemoryRouter initialEntries={["/trips/7"]}>
            <AppHeader {...props} />
        </MemoryRouter>
    );

    return props;
}

describe("AppHeader user menu", () => {
    it("groups account, appearance, and logout controls under the username", async () => {
        const user = userEvent.setup();
        const { onToggleTheme } = renderHeader();

        const trigger = screen.getByRole("button", { name: "traveler" });
        expect(trigger).toHaveAttribute("aria-expanded", "false");
        await user.click(trigger);

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByRole("menuitem", { name: "Account Settings" })).toHaveAttribute("href", "/account");

        const themeToggle = screen.getByRole("menuitemcheckbox", { name: "Dark Mode" });
        expect(themeToggle).toHaveAttribute("aria-checked", "false");
        await user.click(themeToggle);
        expect(onToggleTheme).toHaveBeenCalledOnce();
    });

    it("closes with Escape and returns focus to the trigger", async () => {
        const user = userEvent.setup();
        renderHeader();

        const trigger = screen.getByRole("button", { name: "traveler" });
        await user.click(trigger);
        await user.keyboard("{Escape}");

        expect(screen.queryByRole("menu", { name: "User menu" })).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    });

    it("describes the theme action for the current mode", async () => {
        const user = userEvent.setup();
        renderHeader({ theme: "dark" });

        await user.click(screen.getByRole("button", { name: "traveler" }));

        const themeToggle = screen.getByRole("menuitemcheckbox", { name: "Light Mode" });
        expect(themeToggle).toHaveAttribute("aria-checked", "true");
    });

    it("offers language switching before authentication", async () => {
        const user = userEvent.setup();
        renderHeader({ currentUser: null });

        const languageSwitch = screen.getByRole("switch", { name: "Switch to Japanese" });
        expect(languageSwitch).toHaveAttribute("aria-checked", "false");
        await user.click(languageSwitch);

        expect(screen.getByRole("heading", { name: "日本旅行プランナー" })).toBeInTheDocument();
        expect(screen.getByRole("switch", { name: "英語に切り替える" })).toHaveAttribute("aria-checked", "true");
    });

    it("closes when the user clicks outside it", async () => {
        const user = userEvent.setup();
        renderHeader();

        await user.click(screen.getByRole("button", { name: "traveler" }));
        await user.click(document.body);

        expect(screen.queryByRole("menu", { name: "User menu" })).not.toBeInTheDocument();
    });
});
