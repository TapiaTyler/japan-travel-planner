import { describe, expect, it } from "vitest";

import { getTripPath, getTripSlug } from "./routingUtils.js";

describe("getTripSlug", () => {
    it("creates a lowercase URL slug", () => {
        expect(getTripSlug("  Tokyo & Kyoto 2027!  "))
            .toBe("tokyo-kyoto-2027");
    });

    it("preserves Japanese letters", () => {
        expect(getTripSlug("東京・京都 2027"))
            .toBe("東京-京都-2027");
    });

    it("uses a fallback when the name has no letters or numbers", () => {
        expect(getTripSlug("---"))
            .toBe("trip");
    });
});

describe("getTripPath", () => {
    it("combines the stable ID with the readable slug", () => {
        expect(getTripPath({ id: 42, name: "Spring in Japan" }))
            .toBe("/trips/42/spring-in-japan");
    });
});
