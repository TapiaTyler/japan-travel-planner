import { BedDouble, LibraryBig, MapPinned, MapPin, Route, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatters.js";

function SavedItemIcon({ item }) {
    const props = { size: 22, "aria-hidden": "true" };
    if (item.itemType === "Activity") return <MapPin {...props} />;
    if (item.itemType === "Lodging") return <BedDouble {...props} />;
    return <Route {...props} />;
}

function SavedItineraryItemCard({ item, canAdd, onAdd, onDelete }) {
    const { t, i18n } = useTranslation();
    const location = item.itemType === "Transportation"
        ? [item.departureLocation, item.arrivalLocation].filter(Boolean).join(" → ")
        : item.location;

    return (
        <article className={`saved-item-card saved-item-${item.itemType.toLowerCase()}`}>
            <div className="saved-item-icon"><SavedItemIcon item={item} /></div>
            <div className="saved-item-content">
                <p className="template-eyebrow">{t(`itinerary.${item.itemType.toLowerCase()}`)}</p>
                <h4>{item.name}</h4>
                {location && <p>{location}</p>}
                <div className="saved-item-meta">
                    {item.cost != null && (
                        <span>{formatCurrency(item.cost, i18n.resolvedLanguage)}</span>
                    )}
                    {item.endDateOffset > 0 && (
                        <span>{t("libraryItems.duration", { count: item.endDateOffset })}</span>
                    )}
                    {item.mapSearchQuery && (
                        <span><MapPinned size={15} aria-hidden="true" />{t("libraryItems.mapSaved")}</span>
                    )}
                </div>
            </div>
            <div className="saved-item-actions">
                <button
                    type="button"
                    className="add-button"
                    disabled={!canAdd}
                    title={!canAdd ? t("libraryItems.createTripFirst") : undefined}
                    onClick={() => onAdd(item)}
                >
                    <LibraryBig size={17} aria-hidden="true" />
                    {t("libraryItems.addToTrip")}
                </button>
                <button
                    type="button"
                    className="saved-item-delete"
                    aria-label={t("libraryItems.deleteNamed", { name: item.name })}
                    onClick={() => onDelete(item)}
                >
                    <Trash2 size={17} aria-hidden="true" />
                </button>
            </div>
        </article>
    );
}

export default SavedItineraryItemCard;
