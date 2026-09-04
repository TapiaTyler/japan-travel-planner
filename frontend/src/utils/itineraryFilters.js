export const EMPTY_ITINERARY_FILTERS = {
    dateFrom: "",
    dateTo: "",
    locations: [],
    itemTypes: [],
    costStatuses: [],
    minCost: "",
    maxCost: "",
    transportationTypes: [],
};

export const FILTER_QUERY_KEYS = [
    "from",
    "to",
    "location",
    "type",
    "status",
    "minCost",
    "maxCost",
    "transportation",
];

function normalize(value) {
    return String(value ?? "").toLocaleLowerCase();
}

export function getItemLocations(item) {
    if (item.itemType === "Transportation") {
        const locations = [item.departureLocation, item.arrivalLocation]
            .filter(Boolean);

        return locations.length > 0
            ? locations
            : ["Other / Unspecified"];
    }

    return item.location
        ? [item.location]
        : ["Other / Unspecified"];
}

export function getAvailableLocations(items) {
    return [...new Set(items.flatMap(getItemLocations))]
        .sort((left, right) => left.localeCompare(right));
}

export function countActiveFilters(filters) {
    return [
        filters.dateFrom || filters.dateTo,
        filters.locations.length > 0,
        filters.itemTypes.length > 0,
        filters.costStatuses.length > 0,
        filters.minCost !== "" || filters.maxCost !== "",
        filters.transportationTypes.length > 0,
    ].filter(Boolean).length;
}

function matchesSearch(item, query) {
    if (!query) {
        return true;
    }

    const searchableValues = [
        item.name,
        item.notes,
        ...getItemLocations(item),
    ];

    return searchableValues.some(
        (value) => normalize(value).includes(query)
    );
}

export function filterItineraryItems(items, query, filters) {
    const normalizedQuery = normalize(query.trim());

    return items.filter((item) => {
        if (!matchesSearch(item, normalizedQuery)) {
            return false;
        }

        if (filters.dateFrom && (!item.date || item.date < filters.dateFrom)) {
            return false;
        }

        if (filters.dateTo && (!item.date || item.date > filters.dateTo)) {
            return false;
        }

        if (
            filters.locations.length > 0 &&
            !getItemLocations(item).some(
                (location) => filters.locations.includes(location)
            )
        ) {
            return false;
        }

        if (
            filters.itemTypes.length > 0 &&
            !filters.itemTypes.includes(item.itemType)
        ) {
            return false;
        }

        const costStatus = item.costStatus || "UNKNOWN";

        if (
            filters.costStatuses.length > 0 &&
            !filters.costStatuses.includes(costStatus)
        ) {
            return false;
        }

        if (filters.minCost !== "") {
            if (item.cost === null || Number(item.cost) < Number(filters.minCost)) {
                return false;
            }
        }

        if (filters.maxCost !== "") {
            if (item.cost === null || Number(item.cost) > Number(filters.maxCost)) {
                return false;
            }
        }

        if (
            filters.transportationTypes.length > 0 &&
            item.itemType === "Transportation" &&
            !filters.transportationTypes.includes(item.transportationType)
        ) {
            return false;
        }

        return true;
    });
}
