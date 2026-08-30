import {
    formatDateHeading,
    formatDateLabel,
} from "../../utils/itineraryUtils.js";

function PrintableItinerary({ trip, items, options }) {
    const generatedAt = new Date().toLocaleString("en-US");

    const filteredItems = items.filter((item) => {
        const typeIncluded =
            (item.itemType === "Activity" && options.activities) ||
            (item.itemType === "Transportation" &&
                options.transportation) ||
            (item.itemType === "Lodging" && options.lodging);

        if (!typeIncluded) {
            return false;
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
                <h1>Japan Travel Planner</h1>

                <div className="print-report-trip-details">
                    <h2>{trip.name}</h2>

                    <p>
                        {formatDateLabel(trip.startDate)} -{" "}
                        {formatDateLabel(trip.endDate)}
                    </p>

                    <p>Generated: {generatedAt}</p>

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
                                ? "Unscheduled"
                                : dateItems[0].outsideTripDates
                                    ? `${formatDateLabel(date)} · Outside trip dates`
                                    : formatDateHeading(
                                        date,
                                        dateItems[0].dayNumber
                                    )}
                        </h3>

                        <table>
                            <thead>
                            <tr>
                                <th>Item</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th>Cost</th>
                                <th>Status</th>
                            </tr>
                            </thead>

                            <tbody>
                            {dateItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div>{item.name}</div>
                                    </td>

                                    <td>{item.itemType}</td>

                                    <td>
                                        {getItemDetails(item)}
                                    </td>

                                    <td>
                                        {item.cost !== null
                                            ? `¥${Number(
                                                item.cost
                                            ).toLocaleString()}`
                                            : "—"}
                                    </td>

                                    <td>{item.costStatus}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {options.includeNotes &&
                            dateItems.some((item) => item.notes) && (
                                <div className="print-notes">
                                    <h4>Notes</h4>

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
                    No itinerary items match the selected
                    report options.
                </p>
            )}

            {options.includeCostSummary && (
                <section className="print-cost-summary">
                    <h3>Cost Summary</h3>

                    <p>
                        <strong>Total Planned Cost:</strong>{" "}
                        ¥{totalCost.toLocaleString()}
                    </p>
                </section>
            )}
        </section>
    );
}

function getItemDetails(item) {
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
            item.transportationType,
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
                ? `${item.numberOfNights} ${
                    item.numberOfNights === 1
                        ? "night"
                        : "nights"
                }`
                : null;

        return [item.location, stay, nights]
            .filter(Boolean)
            .join(" · ") || "—";
    }

    return "—";
}

export default PrintableItinerary;