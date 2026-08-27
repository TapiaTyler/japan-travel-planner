export function formatDateHeading(date, dayNumber) {
    if (!date) {
        return "Unscheduled";
    }

    return `${formatDateLabel(date)} · Day ${dayNumber}`;
}

export function formatDateLabel(date) {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    const formattedDate = parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const weekday = parsedDate.toLocaleDateString("en-US", {
        weekday: "short",
    });

    return `${formattedDate} (${weekday})`;
}

export function getItemLocation(item) {
    if (item.itemType === "Transportation") {
        return item.departureLocation || "Other / Unspecified";
    }

    return item.location || "Other / Unspecified";
}