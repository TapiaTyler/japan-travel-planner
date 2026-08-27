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

    return (
        <section>
            <div className="trip-list-header">
                <h2>My Trips</h2>

                <button
                    type="button"
                    onClick={onAddTrip}
                >
                    + New Trip
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
                                <strong>{trip.name}</strong>

                                <span>
                  {trip.startDate} - {trip.endDate}
                </span>
                            </button>

                            <div className="trip-card-actions">
                                <button
                                    type="button"
                                    aria-label={`Options for ${trip.name}`}
                                    title="Trip options"
                                    onClick={() =>
                                        setOpenMenuId((current) =>
                                            current === trip.id ? null : trip.id
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