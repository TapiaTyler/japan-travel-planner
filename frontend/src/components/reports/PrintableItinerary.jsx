import {
    formatDateHeading,
    formatDateLabel,
} from "../../utils/itineraryUtils.js";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatDateTime } from "../../utils/formatters.js";

function PrintableItinerary({ trip, items, options }) {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage;
    const generatedAt = formatDateTime(new Date(), language);

    const filteredItems = items.filter((item) => {
        const typeIncluded =
            (item.itemType === "Activity" && options.activities) ||
            (item.itemType === "Transportation" &&
                options.transportation) ||
            (item.itemType === "Lodging" && options.lodging);

        if (!typeIncluded) {
            return false;
        }

        if (item.cost === null) {
            return options.includeItemsWithoutCost !== false;
        }

        const statusIncluded =
            (item.costStatus === "CONFIRMED" &&
                options.confirmed) ||
            (item.costStatus === "ESTIMATED" &&
                options.estimated) ||
            ((item.costStatus === "UNKNOWN" ||
                    !item.costStatus) &&
                options.unknown);

        return statusIncluded;
    });

    const totalCost = filteredItems.reduce((total, item) => {
        if (item.cost === null) {
            return total;
        }

        return total + Number(item.cost);
    }, 0);

    const groupedByDate = filteredItems.reduce(
        (groups, item) => {
            const key = item.date ?? "Unscheduled";

            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(item);

            return groups;
        },
        {}
    );

    return (
        <section className="printable-itinerary">
            <header className="print-report-header">
                <h1>{t("app.name")}</h1>

                <div className="print-report-trip-details">
                    <h2>{trip.name}</h2>

                    <p>
                        {formatDateLabel(trip.startDate, language)} -{" "}
                        {formatDateLabel(trip.endDate, language)}
                    </p>

                    <p>{t("report.generated", { date: generatedAt })}</p>

                    {options.includeNotes && trip.notes && (
                        <p>{trip.notes}</p>
                    )}
                </div>
            </header>

            {Object.entries(groupedByDate).map(
                ([date, dateItems]) => (
                    <section
                        key={date}
                        className="print-day"
                    >
                        <h3>
                            {date === "Unscheduled"
                                ? t("common.unscheduled")
                                : dateItems[0].outsideTripDates
                                    ? `${formatDateLabel(date, language)} · ${t("itinerary.outsideTripDates")}`
                                    : formatDateHeading(
                                        date,
                                        t("itinerary.day", { count: dateItems[0].dayNumber }),
                                        language
                                    )}
                        </h3>

                        <table>
                            <thead>
                            <tr>
                                <th>{t("report.item")}</th>
                                <th>{t("report.type")}</th>
                                <th>{t("report.details")}</th>
                                <th>{t("itinerary.cost")}</th>
                                <th>{t("report.status")}</th>
                            </tr>
                            </thead>

                            <tbody>
                            {dateItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div>{item.name}</div>
                                    </td>

                                    <td>{t(`itinerary.${item.itemType.toLowerCase()}`)}</td>

                                    <td>
                                        {getItemDetails(item, t)}
                                    </td>

                                    <td>
                                        {item.cost !== null
                                            ? formatCurrency(item.cost, language)
                                            : "—"}
                                    </td>

                                    <td>
                                        {item.cost !== null
                                            ? t(`cost.${item.costStatus.toLowerCase()}`)
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {options.includeNotes &&
                            dateItems.some((item) => item.notes) && (
                                <div className="print-notes">
                                    <h4>{t("itinerary.notes")}</h4>

                                    {dateItems
                                        .filter((item) => item.notes)
                                        .map((item) => (
                                            <p key={item.id}>
                                                <strong>{item.name}:</strong> {item.notes}
                                            </p>
                                        ))}
                                </div>
                            )}
                    </section>
                )
            )}

            {filteredItems.length === 0 && (
                <p>
                    {t("report.noMatches")}
                </p>
            )}

            {options.includeCostSummary && (
                <section className="print-cost-summary">
                    <h3>{t("cost.summary")}</h3>

                    <p>
                        <strong>{t("report.totalPlannedCost")}</strong>{" "}
                        {formatCurrency(totalCost, language)}
                    </p>
                </section>
            )}
        </section>
    );
}

function getItemDetails(item, t) {
    if (item.itemType === "Activity") {
        const parts = [
            item.location,
            item.startTime && item.endTime
                ? `${item.startTime.slice(
                    0,
                    5
                )} - ${item.endTime.slice(0, 5)}`
                : null,
        ];

        return parts.filter(Boolean).join(" · ") || "—";
    }

    if (item.itemType === "Transportation") {
        const route =
            item.departureLocation || item.arrivalLocation
                ? `${item.departureLocation ?? "—"} → ${
                    item.arrivalLocation ?? "—"
                }`
                : null;

        const times =
            item.departureTime || item.arrivalTime
                ? `${
                    item.departureTime?.slice(0, 5) ?? "—"
                } - ${
                    item.arrivalTime?.slice(0, 5) ?? "—"
                }`
                : null;

        return [
            item.transportationType ? t(`transport.${item.transportationType.toLowerCase()}`) : null,
            route,
            times,
        ]
            .filter(Boolean)
            .join(" · ") || "—";
    }

    if (item.itemType === "Lodging") {
        const stay =
            item.checkInDate || item.checkOutDate
                ? `${item.checkInDate ?? "—"} - ${
                    item.checkOutDate ?? "—"
                }`
                : null;

        const nights =
            item.numberOfNights !== null
                ? t("itinerary.durationNights", { count: item.numberOfNights })
                : null;

        return [item.location, stay, nights]
            .filter(Boolean)
            .join(" · ") || "—";
    }

    return "—";
}

export default PrintableItinerary;
