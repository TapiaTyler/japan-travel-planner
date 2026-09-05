import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import RegisterForm from "./RegisterForm.jsx";

describe("RegisterForm", () => {
    it("requires matching password confirmation", async () => {
        const user = userEvent.setup();
        const onRegister = vi.fn();

        render(<RegisterForm onRegister={onRegister} onCancel={vi.fn()} />);

        await user.type(screen.getByLabelText("Username"), "traveler");
        await user.type(screen.getByLabelText("Password"), "password");
        await user.type(screen.getByLabelText("Confirm Password"), "different");
        await user.click(screen.getByRole("button", { name: "Create Account" }));

        expect(screen.getByRole("alert")).toHaveTextContent("Passwords do not match.");
        expect(onRegister).not.toHaveBeenCalled();
    });
});
