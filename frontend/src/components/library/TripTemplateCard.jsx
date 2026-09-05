import { CalendarDays, ChevronDown, MapPin, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatters.js";

function itemDetails(item, t) {
    if (item.itemType === "Transportation") {
        const transportationType = item.transportationType
            ? t(`transport.${item.transportationType.toLowerCase()}`)
            : null;

        return [transportationType, item.departureLocation, item.arrivalLocation]
            .filter(Boolean)
            .join(" · ");
    }

    if (item.itemType === "Lodging" && item.checkInDateOffset != null) {
        return t("library.dayRange", {
            start: item.checkInDateOffset + 1,
            end: item.checkOutDateOffset + 1,
        });
    }

    return item.location ?? "";
}

function TripTemplateCard({ template, owned = false, onUse, onDelete }) {
    const { t, i18n } = useTranslation();

    return (
        <article className="template-card">
            <div className="template-card-header">
                <div>
                    <p className="template-eyebrow">
                        {owned ? t("library.personalTemplate") : t("library.featuredTemplate")}
                    </p>
                    <h3>{template.name}</h3>
                </div>

                <span className="template-duration">
                    <CalendarDays size={17} aria-hidden="true" />
                    {t("trips.days", { count: template.durationDays })}
                </span>
            </div>

            {template.notes && <p className="template-description">{template.notes}</p>}

            <div className="template-meta">
                <span>{t("common.items", { count: template.itemCount })}</span>
                {template.destinations?.length > 0 && (
                    <span>
                        <MapPin size={16} aria-hidden="true" />
                        {template.destinations.join(" · ")}
                    </span>
                )}
                <span>{formatCurrency(template.totalCost ?? 0, i18n.resolvedLanguage)}</span>
            </div>

            <details className="template-preview">
                <summary>
                    {t("library.preview")}
                    <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <ol>
                    {template.items.map((item) => (
                        <li key={item.id}>
                            <span className="template-item-day">
                                {item.dateOffset == null
                                    ? t("common.unscheduled")
                                    : t("itinerary.day", { count: item.dateOffset + 1 })}
                            </span>
                            <span>
                                <strong>{item.name}</strong>
                                <small>{itemDetails(item, t)}</small>
                            </span>
                        </li>
                    ))}
                </ol>
            </details>

            <div className="template-actions">
                <button type="button" className="add-button" onClick={() => onUse(template)}>
                    {t("library.useTemplate")}
                </button>
                {owned && (
                    <button
                        type="button"
                        className="template-delete-button"
                        aria-label={t("library.deleteNamed", { name: template.name })}
                        onClick={() => onDelete(template)}
                    >
                        <Trash2 size={17} aria-hidden="true" />
                        {t("common.delete")}
                    </button>
                )}
            </div>
        </article>
    );
}

export default TripTemplateCard;
