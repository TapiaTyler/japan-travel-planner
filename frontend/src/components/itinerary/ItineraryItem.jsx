import { useState } from "react";

function ItineraryItem({ item, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);

    function renderDetails() {
        if (item.itemType === "Activity") {
            return (
                <>
                    {item.location && <p>{item.location}</p>}

                    {(item.startTime || item.endTime) && (
                        <p>
                            {item.startTime ?? "—"} - {item.endTime ?? "—"}
                        </p>
                    )}
                </>
            );
        }

        if (item.itemType === "Transportation") {
            return (
                <>
                    {item.transportationType && <p>{item.transportationType}</p>}

                    {(item.departureLocation || item.arrivalLocation) && (
                        <p>
                            {item.departureLocation ?? "Unknown"} →{" "}
                            {item.arrivalLocation ?? "Unknown"}
                        </p>
                    )}

                    {(item.departureTime || item.arrivalTime) && (
                        <p>
                            {item.departureTime ?? "—"} - {item.arrivalTime ?? "—"}
                        </p>
                    )}
                </>
            );
        }

        if (item.itemType === "Lodging") {
            return (
                <>
                    {item.location && <p>{item.location}</p>}

                    {(item.checkInDate || item.checkOutDate) && (
                        <p>
                            {item.checkInDate ?? "—"} - {item.checkOutDate ?? "—"}
                        </p>
                    )}

                    {item.numberOfNights !== null && (
                        <p>
                            {item.numberOfNights}{" "}
                            {item.numberOfNights === 1 ? "night" : "nights"}
                        </p>
                    )}
                </>
            );
        }

        return null;
    }

    return (
        <div className="itinerary-item">
            <div className="itinerary-item-icon">
                {item.itemType === "Activity" && "A"}
                {item.itemType === "Transportation" && "T"}
                {item.itemType === "Lodging" && "L"}
            </div>

            <div className="itinerary-item-content">
                <strong>{item.name}</strong>
                <p>{item.itemType}</p>

                {item.outsideTripDates && (
                    <p className="item-date-warning">
                        Date falls outside the current trip dates.
                    </p>
                )}

                {renderDetails()}

                {item.notes && <p className="item-notes">{item.notes}</p>}
            </div>

            {item.cost !== null && (
                <div className="item-cost">
                    <p className="item-cost-amount">¥{item.cost.toLocaleString()}</p>
                    <p className={`cost-status-${item.costStatus.toLowerCase()}`}>{item.costStatus}</p>
                </div>
            )}

            <div className="itinerary-item-actions">
                <button
                    type="button"
                    aria-label={`Options for ${item.name}`}
                    title="Item options"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ⋮
                </button>

                {menuOpen && (
                    <div className="item-menu">
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                onEdit(item);
                            }}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                onDelete(item);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItineraryItem;