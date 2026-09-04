import { useState } from "react";
// Icons from Lucide
import {
    BedDouble,
    BusFront,
    CarTaxiFront,
    MapPin,
    Pencil,
    Plane,
    Route,
    Ship,
    TrainFront,
    TramFront,
    Trash2,
} from "lucide-react";

// Components
function ItemIcon({ item }) {
    const iconProps = {
        size: 24,
        "aria-hidden": "true",
    };

    if (item.itemType === "Activity") {
        return <MapPin {...iconProps} />;
    }

    if (item.itemType === "Lodging") {
        return <BedDouble {...iconProps} />;
    }

    if (item.itemType === "Transportation") {
        switch (item.transportationType) {
            case "FLIGHT":
                return <Plane {...iconProps} />;

            case "TRAIN":
                return <TrainFront {...iconProps} />;

            case "SUBWAY":
                return <TramFront {...iconProps} />;

            case "BUS":
                return <BusFront {...iconProps} />;

            case "TAXI":
                return <CarTaxiFront {...iconProps} />;

            case "FERRY":
                return <Ship {...iconProps} />;

            default:
                return <Route {...iconProps} />;
        }
    }

    return <Route {...iconProps} />;
}

function ItineraryItem({ item, onEdit, onDelete }) {
    // States
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
            <div
                className={`itinerary-item-icon item-type-${item.itemType.toLowerCase()}`}
            >
                <ItemIcon item={item} />
            </div>

            <div className="itinerary-item-content">
                <strong className="itinerary-item-name">{item.name}</strong>

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
                    <p className={`cost-status-${item.costStatus.toLowerCase()}`}>
                        {item.costStatus.charAt(0) + item.costStatus.slice(1).toLowerCase()}
                    </p>
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
                            <Pencil
                                size={16}
                                aria-hidden="true"
                            />
                            Edit
                        </button>

                        <button
                            type="button"
                            className="item-menu-delete"
                            onClick={() => {
                                setMenuOpen(false);
                                onDelete(item);
                            }}
                        >
                            <Trash2
                                size={16}
                                aria-hidden="true"
                            />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItineraryItem;
