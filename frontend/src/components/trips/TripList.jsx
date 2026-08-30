import { useState } from "react";

function TripList({
                      trips,
                      onSelectTrip,
                      onAddTrip,
                      onEditTrip,
                      onDuplicateTrip,
                      onDeleteTrip,
                  }) {
    const [openMenuId, setOpenMenuId] = useState(null);

    function getTripLength(startDate, endDate) {
        const start = new Date(`${startDate}T00:00:00Z`);
        const end = new Date(`${endDate}T00:00:00Z`);

        const millisecondsPerDay =
            1000 * 60 * 60 * 24;

        return (
            Math.round(
                (end - start) / millisecondsPerDay
            ) + 1
        );
    }

    function formatTripDate(date) {
        return new Date(
            `${date}T00:00:00Z`
        ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
        });
    }

    return (
        <section>
            <div className="trip-list-header">
                <h2>My Trips</h2>

                <button
                    className="add-button"
                    type="button"
                    onClick={onAddTrip}
                >
                    <span className="button-icon">+</span> New Trip
                </button>
            </div>

            {trips.length === 0 ? (
                <p>No trips yet.</p>
            ) : (
                <div className="trip-list">
                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            className="trip-card"
                        >
                            <button
                                type="button"
                                className="trip-card-main"
                                onClick={() => onSelectTrip(trip)}
                            >
                                <div className="trip-card-content">
                                    <h3 className="trip-card-name">
                                        {trip.name}
                                    </h3>

                                    <div className="trip-card-summary">
                                        <div className="trip-card-details">
                                            <p className="trip-card-dates">
                                                {formatTripDate(trip.startDate)}
                                                {" – "}
                                                {formatTripDate(trip.endDate)}
                                                {" · "}
                                                {getTripLength(
                                                    trip.startDate,
                                                    trip.endDate
                                                )} days
                                            </p>

                                            <p className="trip-card-locations">
                                                {trip.destinations?.length > 0
                                                    ? trip.destinations.join(", ")
                                                    : "No destinations added"}
                                            </p>
                                        </div>

                                        <div className="trip-card-cost">
                                            <span>Total (Est.)</span>

                                            <strong>
                                                ¥{Number(
                                                trip.totalCost ?? 0
                                                ).toLocaleString()}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </button>

                            <div className="trip-card-actions">
                                <button
                                    type="button"
                                    aria-label={`Options for ${trip.name}`}
                                    title="Trip options"
                                    onClick={() =>
                                        setOpenMenuId((current) =>
                                            current === trip.id
                                                ? null
                                                : trip.id
                                        )
                                    }
                                >
                                    ⋮
                                </button>

                                {openMenuId === trip.id && (
                                    <div className="item-menu">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                onEditTrip(trip);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                onDuplicateTrip(trip);
                                            }}
                                        >
                                            Duplicate
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                onDeleteTrip(trip);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default TripList;