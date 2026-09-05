import { describe, expect, it } from "vitest";

import { formatCurrency, formatDate } from "./formatters.js";

describe("locale formatters", () => {
    it("formats whole-yen values for English and Japanese", () => {
        expect(formatCurrency(12500, "en")).toContain("12,500");
        expect(formatCurrency(12500, "ja")).toContain("12,500");
    });

    it("formats dates using the selected locale", () => {
        const options = { year: "numeric", month: "long", day: "numeric" };

        expect(formatDate("2027-11-02", "en", options)).toBe("November 2, 2027");
        expect(formatDate("2027-11-02", "ja", options)).toBe("2027年11月2日");
    });
});
