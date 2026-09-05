import { describe, expect, it } from "vitest";

import {
    countActiveFilters,
    EMPTY_ITINERARY_FILTERS,
    filterItineraryItems,
    getAvailableLocations,
} from "./itineraryFilters.js";

const items = [
    {
        id: 1,
        itemType: "Activity",
        name: "Tokyo Tower",
        date: "2027-04-02",
        location: "Tokyo",
        cost: 3000,
        costStatus: "CONFIRMED",
    },
    {
        id: 2,
        itemType: "Transportation",
        name: "Shinkansen",
        date: "2027-04-04",
        departureLocation: "Tokyo",
        arrivalLocation: "Kyoto",
        transportationType: "TRAIN",
        cost: 14000,
        costStatus: "ESTIMATED",
    },
    {
        id: 3,
        itemType: "Lodging",
        name: "Kyoto Stay",
        notes: "Near Gion",
        date: "2027-04-05",
        location: "Kyoto",
        cost: null,
        costStatus: "UNKNOWN",
    },
];

function filters(overrides = {}) {
    return { ...EMPTY_ITINERARY_FILTERS, ...overrides };
}

describe("filterItineraryItems", () => {
    it("combines search and structured filters", () => {
        const result = filterItineraryItems(
            items,
            "tokyo",
            filters({
                itemTypes: ["Transportation"],
                costStatuses: ["ESTIMATED"],
            })
        );

        expect(result.map((item) => item.id)).toEqual([2]);
    });

    it("uses inclusive date and cost boundaries", () => {
        const result = filterItineraryItems(
            items,
            "",
            filters({
                dateFrom: "2027-04-02",
                dateTo: "2027-04-04",
                minCost: "3000",
                maxCost: "14000",
            })
        );

        expect(result.map((item) => item.id)).toEqual([1, 2]);
    });

    it("matches either end of a transportation route", () => {
        const result = filterItineraryItems(
            items,
            "",
            filters({ locations: ["Kyoto"] })
        );

        expect(result.map((item) => item.id)).toEqual([2, 3]);
    });

    it("applies transportation subtypes only to transportation items", () => {
        const result = filterItineraryItems(
            items,
            "",
            filters({ transportationTypes: ["BUS"] })
        );

        expect(result.map((item) => item.id)).toEqual([1, 3]);
    });

    it("excludes unknown costs when a cost boundary is active", () => {
        const result = filterItineraryItems(
            items,
            "",
            filters({ minCost: "0" })
        );

        expect(result.map((item) => item.id)).toEqual([1, 2]);
    });

    it("does not apply cost status filters to items without a cost", () => {
        const result = filterItineraryItems(
            items,
            "",
            filters({ costStatuses: ["CONFIRMED"] })
        );

        expect(result.map((item) => item.id)).toEqual([1, 3]);
    });
});

describe("filter metadata", () => {
    it("returns unique sorted locations including both route endpoints", () => {
        expect(getAvailableLocations(items)).toEqual(["Kyoto", "Tokyo"]);
    });

    it("exposes an option for items without a location", () => {
        expect(getAvailableLocations([
            { itemType: "Activity", location: null },
        ])).toEqual(["Other / Unspecified"]);
    });

    it("counts active filter categories", () => {
        expect(countActiveFilters(filters({
            dateFrom: "2027-04-01",
            dateTo: "2027-04-10",
            locations: ["Tokyo", "Kyoto"],
            minCost: "1000",
        }))).toBe(3);
    });
});
