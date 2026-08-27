import {
    formatDateHeading,
    formatDateLabel,
} from "../../utils/itineraryUtils.js";

function PrintableItinerary({ trip, groupedByDate, items }) {
    const generatedAt = new Date().toLocaleString("en-US");

    const totalCost = items.reduce((total, item) => {
        if (item.cost === null) {
            return total;
        }

        return total + Number(item.cost);
    }, 0);

    return (
        <section className="printable-itinerary">
            <header>
                <h1>Japan Travel Planner</h1>
                <h2>{trip.name}</h2>

                <p>
                    {formatDateLabel(trip.startDate)} -{" "}
                    {formatDateLabel(trip.endDate)}
                </p>

                <p>Generated: {generatedAt}</p>

                {trip.notes && <p>{trip.notes}</p>}
            </header>

            <hr />

            {Object.entries(groupedByDate).map(([date, dateItems]) => (
                <section key={date} className="print-day">
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
                                <td>{item.name}</td>
                                <td>{item.itemType}</td>
                                <td>{getItemDetails(item)}</td>
                                <td>
                                    {item.cost !== null
                                        ? `¥${Number(item.cost).toLocaleString()}`
                                        : "—"}
                                </td>
                                <td>{item.costStatus}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            ))}

            <section className="print-cost-summary">
                <h3>Cost Summary</h3>
                <p>
                    <strong>Total Planned Cost:</strong>{" "}
                    ¥{totalCost.toLocaleString()}
                </p>
            </section>
        </section>
    );
}

function getItemDetails(item) {
    if (item.itemType === "Activity") {
        const parts = [
            item.location,
            item.startTime && item.endTime
                ? `${item.startTime.slice(0, 5)} - ${item.endTime.slice(0, 5)}`
                : null,
        ];

        return parts.filter(Boolean).join(" · ") || "—";
    }

    if (item.itemType === "Transportation") {
        const route =
            item.departureLocation || item.arrivalLocation
                ? `${item.departureLocation ?? "—"} → ${item.arrivalLocation ?? "—"}`
                : null;

        const times =
            item.departureTime || item.arrivalTime
                ? `${item.departureTime?.slice(0, 5) ?? "—"} - ${
                    item.arrivalTime?.slice(0, 5) ?? "—"
                }`
                : null;

        return [item.transportationType, route, times]
            .filter(Boolean)
            .join(" · ") || "—";
    }

    if (item.itemType === "Lodging") {
        const stay =
            item.checkInDate || item.checkOutDate
                ? `${item.checkInDate ?? "—"} - ${item.checkOutDate ?? "—"}`
                : null;

        const nights =
            item.numberOfNights !== null
                ? `${item.numberOfNights} ${
                    item.numberOfNights === 1 ? "night" : "nights"
                }`
                : null;

        return [item.location, stay, nights]
            .filter(Boolean)
            .join(" · ") || "—";
    }

    return "—";
}

export default PrintableItinerary;