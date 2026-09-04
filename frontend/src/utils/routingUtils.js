export function getTripSlug(name) {
    const slug = name
        .trim()
        .toLocaleLowerCase()
        .normalize("NFKC")
        .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
        .replace(/^-+|-+$/g, "");

    return slug || "trip";
}

export function getTripPath(trip) {
    return `/trips/${trip.id}/${getTripSlug(trip.name)}`;
}
