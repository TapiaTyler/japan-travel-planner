import { beforeEach, describe, expect, it } from "vitest";

import i18n, { LANGUAGE_STORAGE_KEY } from "./index.js";

describe("localization", () => {
    beforeEach(async () => {
        window.localStorage.clear();
        await i18n.changeLanguage("en");
    });

    it("switches languages and updates document metadata", async () => {
        await i18n.changeLanguage("ja");

        expect(i18n.t("trips.title")).toBe("旅行一覧");
        expect(document.documentElement.lang).toBe("ja");
        expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("ja");
    });

    it("falls back to English resources", async () => {
        await i18n.changeLanguage("en");
        expect(i18n.t("app.name")).toBe("Japan Travel Planner");
    });
});
