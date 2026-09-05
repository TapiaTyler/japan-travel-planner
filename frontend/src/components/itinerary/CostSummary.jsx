import { BedDouble, MapPin, Route } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatters.js";

function CostSummary({ items, searchQuery, hasActiveFilters }) {
    const { t, i18n } = useTranslation();
    const summary = items.reduce(
        (result, item) => {
            if (item.cost !== null) {
                const cost = Number(item.cost);

                if (item.itemType === "Activity") result.activities += cost;
                else if (item.itemType === "Transportation") result.transportation += cost;
                else if (item.itemType === "Lodging") result.lodging += cost;

                result.total += cost;

                if (item.costStatus === "CONFIRMED") result.confirmed += 1;
                else if (item.costStatus === "ESTIMATED") result.estimated += 1;
                else result.unknown += 1;
            }

            return result;
        },
        {
            activities: 0,
            transportation: 0,
            lodging: 0,
            total: 0,
            confirmed: 0,
            estimated: 0,
            unknown: 0,
        }
    );

    return (
        <aside className="cost-summary">
            <h3>
                {t("cost.summary")}
                {searchQuery.trim() && <> ({<em>{searchQuery.trim()}</em>})</>}
            </h3>

            {hasActiveFilters && (
                <p className="cost-summary-context">
                    {t("cost.filtered")}
                </p>
            )}

            <div className="cost-summary-row">
                <span className="cost-summary-label item-type-activity">
                    <MapPin size={18} aria-hidden="true" /> {t("cost.activities")}
                </span>
                <strong>{formatCurrency(summary.activities, i18n.resolvedLanguage)}</strong>
            </div>

            <div className="cost-summary-row">
                <span className="cost-summary-label item-type-transportation">
                    <Route size={18} aria-hidden="true" /> {t("cost.transportation")}
                </span>
                <strong>{formatCurrency(summary.transportation, i18n.resolvedLanguage)}</strong>
            </div>

            <div className="cost-summary-row">
                <span className="cost-summary-label item-type-lodging">
                    <BedDouble size={18} aria-hidden="true" /> {t("cost.lodging")}
                </span>
                <strong>{formatCurrency(summary.lodging, i18n.resolvedLanguage)}</strong>
            </div>

            <hr />

            <div className="cost-summary-total">
                <strong>{t("cost.total")}</strong>
                <strong>{formatCurrency(summary.total, i18n.resolvedLanguage)}</strong>
            </div>

            <hr />

            <h4 className="cost-summary-status-heading">{t("cost.status")}</h4>

            <div className="cost-summary-row">
                <span className="cost-summary-status cost-status-confirmed">
                    <span className="cost-status-dot" aria-hidden="true" /> {t("cost.confirmed")}
                </span>
                <span>{t("common.items", { count: summary.confirmed })}</span>
            </div>

            <div className="cost-summary-row">
                <span className="cost-summary-status cost-status-estimated">
                    <span className="cost-status-dot" aria-hidden="true" /> {t("cost.estimated")}
                </span>
                <span>{t("common.items", { count: summary.estimated })}</span>
            </div>

            <div className="cost-summary-row">
                <span className="cost-summary-status cost-status-unknown">
                    <span className="cost-status-dot" aria-hidden="true" /> {t("cost.unknown")}
                </span>
                <span>{t("common.items", { count: summary.unknown })}</span>
            </div>
        </aside>
    );
}

export default CostSummary;
