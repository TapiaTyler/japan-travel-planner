import { useState } from "react";
import {
    Copy,
    Pencil,
    Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

function TripList({
                      trips,
                      onSelectTrip,
                      onAddTrip,
                      onEditTrip,
                      onDuplicateTrip,
                      onDeleteTrip,
                  }) {
    const { t, i18n } = useTranslation();
    const [openMenuId, setOpenMenuId] = useState(null);
    const [duplicatingTripId, setDuplicatingTripId] = useState(null);

    async function handleDuplicate(trip) {
        if (duplicatingTripId !== null) return;

        setDuplicatingTripId(trip.id);

        try {
            await onDuplicateTrip(trip);
        } finally {
            setDuplicatingTripId(null);
            setOpenMenuId(null);
        }
    }

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
        return formatDate(date, i18n.resolvedLanguage, {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
        });
    }

    return (
        <section>
            <div className="trip-list-header">
                <h2>{t("trips.title")}</h2>

                <button
                    className="add-button"
                    type="button"
                    onClick={onAddTrip}
                >
                    <span className="button-icon">+</span> {t("trips.new")}
                </button>
            </div>

            {trips.length === 0 ? (
                <div className="trip-empty-state">
                    <h3>{t("trips.empty")}</h3>

                    <p>
                        {t("trips.emptyHint")}
                    </p>

                    <button
                        type="button"
                        className="empty-state-add-button"
                        aria-label={t("trips.createNew")}
                        title={t("trips.createNew")}
                        onClick={onAddTrip}
                    >
                        +
                    </button>
                </div>
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
                                                {t("trips.days", { count: getTripLength(
                                                    trip.startDate,
                                                    trip.endDate
                                                ) })}
                                            </p>

                                            <p className="trip-card-locations">
                                                {trip.destinations?.length > 0
                                                    ? trip.destinations.join(", ")
                                                    : t("trips.noDestinations")}
                                            </p>
                                        </div>

                                        <div className="trip-card-cost">
                                            <span>{t("trips.totalEstimated")}</span>

                                            <strong>
                                                {formatCurrency(trip.totalCost ?? 0, i18n.resolvedLanguage)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </button>

                            <div className="trip-card-actions">
                                <button
                                    type="button"
                                    aria-label={t("trips.options", { name: trip.name })}
                                    title={t("trips.menuTitle")}
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
                                            disabled={duplicatingTripId !== null}
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                onEditTrip(trip);
                                            }}
                                        >
                                            <Pencil
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            {t("common.edit")}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={duplicatingTripId !== null}
                                            onClick={() => handleDuplicate(trip)}
                                        >
                                            <Copy
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            {duplicatingTripId === trip.id
                                                ? t("trips.duplicating")
                                                : t("trips.duplicate")}
                                        </button>

                                        <button
                                            type="button"
                                            className="item-menu-delete"
                                            disabled={duplicatingTripId !== null}
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                onDeleteTrip(trip);
                                            }}
                                        >
                                            <Trash2
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            {t("common.delete")}
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
