import { formatDate } from "./formatters.js";

export function formatDateHeading(date, dayLabel, language = "en") {
    if (!date) {
        return "Unscheduled";
    }

    return `${formatDateLabel(date, language)} · ${dayLabel}`;
}

export function formatDateLabel(date, language = "en") {
    if (!date) {
        return "";
    }

    const formattedDate = formatDate(date, language, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const weekday = formatDate(date, language, {
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
