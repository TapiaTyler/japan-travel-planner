import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useTheme, { THEME_STORAGE_KEY } from "./useTheme.js";

describe("useTheme", () => {
    beforeEach(() => {
        window.localStorage.clear();
        delete document.documentElement.dataset.theme;
        window.matchMedia = vi.fn(() => ({ matches: false }));
    });

    it("restores a saved theme", () => {
        window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe("dark");
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it("toggles and persists the selected theme", () => {
        const { result } = renderHook(() => useTheme());

        act(() => result.current.toggleTheme());

        expect(result.current.theme).toBe("dark");
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    });
});
