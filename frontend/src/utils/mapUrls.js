const GOOGLE_MAPS_SEARCH_URL = "https://www.google.com/maps/search/?api=1&query=";

export function buildGoogleMapsSearchUrl(mapSearchQuery) {
    const normalizedQuery = mapSearchQuery?.trim();

    if (!normalizedQuery) {
        return null;
    }

    return `${GOOGLE_MAPS_SEARCH_URL}${encodeURIComponent(normalizedQuery)}`;
}
