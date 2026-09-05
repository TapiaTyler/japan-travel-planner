import { useState } from "react";
// Icons from Lucide
import {
    BedDouble,
    BusFront,
    CarTaxiFront,
    MapPinned,
    MapPin,
    LibraryBig,
    Pencil,
    Plane,
    Route,
    Ship,
    TrainFront,
    TramFront,
    Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatters.js";
import { buildGoogleMapsSearchUrl } from "../../utils/mapUrls.js";

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

function ItineraryItem({ item, onEdit, onDelete, onSaveToLibrary }) {
    // States
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);
    const { t, i18n } = useTranslation();
    const mapsUrl = buildGoogleMapsSearchUrl(item.mapSearchQuery);

    async function handleSaveToLibrary() {
        if (isSavingToLibrary) return;
        setIsSavingToLibrary(true);

        try {
            const savedItem = await onSaveToLibrary(item);
            if (savedItem) setMenuOpen(false);
        } finally {
            setIsSavingToLibrary(false);
        }
    }

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
                            {item.departureLocation ?? t("status.unknown")} →{" "}
                            {item.arrivalLocation ?? t("status.unknown")}
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
                            {t("itinerary.durationNights", { count: item.numberOfNights })}
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
                        {t("status.outsideDates")}
                    </p>
                )}

                {renderDetails()}

                {item.notes && <p className="item-notes">{item.notes}</p>}
            </div>

            {item.cost !== null && (
                <div className="item-cost">
                    <p className="item-cost-amount">{formatCurrency(item.cost, i18n.resolvedLanguage)}</p>
                    <p className={`cost-status-${item.costStatus.toLowerCase()}`}>
                        {t(`cost.${item.costStatus.toLowerCase()}`)}
                    </p>
                </div>
            )}

            <div className="item-card-controls">
                {mapsUrl && (
                    <a
                        className="item-map-link"
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("itinerary.openInMaps")}
                        title={t("itinerary.openInMaps")}
                    >
                        <MapPinned size={20} aria-hidden="true" />
                    </a>
                )}

                <div className="itinerary-item-actions">
                    <button
                        type="button"
                        aria-label={t("menu.optionsFor", { name: item.name })}
                        title={t("menu.itemOptions")}
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
                                {t("common.edit")}
                            </button>

                            <button
                                type="button"
                                disabled={isSavingToLibrary}
                                onClick={handleSaveToLibrary}
                            >
                                <LibraryBig size={16} aria-hidden="true" />
                                {isSavingToLibrary
                                    ? t("libraryItems.saving")
                                    : t("libraryItems.save")}
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
                                {t("common.delete")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ItineraryItem;
