export function getLocale(language) {
    return language?.startsWith("ja") ? "ja-JP" : "en-US";
}

export function formatCurrency(amount, language = "en") {
    return new Intl.NumberFormat(getLocale(language), {
        style: "currency",
        currency: "JPY",
        currencyDisplay: "narrowSymbol",
        maximumFractionDigits: 0,
    }).format(Number(amount));
}

export function formatDate(date, language = "en", options = {}) {
    if (!date) return "";
    const isDateOnly = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
    const parsedDate = isDateOnly ? new Date(`${date}T00:00:00Z`) : date;
    const resolvedOptions = isDateOnly
        ? { timeZone: "UTC", ...options }
        : options;

    return new Intl.DateTimeFormat(getLocale(language), resolvedOptions).format(parsedDate);
}

export function formatDateTime(date, language = "en") {
    return new Intl.DateTimeFormat(getLocale(language), {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}
