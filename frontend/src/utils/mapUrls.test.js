import { describe, expect, it } from "vitest";

import { buildGoogleMapsSearchUrl } from "./mapUrls.js";

describe("buildGoogleMapsSearchUrl", () => {
    it("builds an encoded Google Maps search URL", () => {
        expect(buildGoogleMapsSearchUrl("Fushimi Inari Taisha, Kyoto")).toBe(
            "https://www.google.com/maps/search/?api=1&query=Fushimi%20Inari%20Taisha%2C%20Kyoto"
        );
    });

    it("supports coordinates", () => {
        expect(buildGoogleMapsSearchUrl("35.6586,139.7454")).toContain(
            "query=35.6586%2C139.7454"
        );
    });

    it.each([undefined, null, "", "   "])(
        "returns null for an empty query",
        (query) => {
            expect(buildGoogleMapsSearchUrl(query)).toBeNull();
        }
    );
});
