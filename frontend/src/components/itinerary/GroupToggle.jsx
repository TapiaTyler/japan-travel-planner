import { useTranslation } from "react-i18next";

function GroupToggle({ groupBy, onChange }) {
    const { t } = useTranslation();
    return (
        <div
            className={`group-toggle group-toggle-${groupBy}`}
            aria-label={t("navigation.groupBy")}
        >
            <button
                type="button"
                className={groupBy === "date" ? "active-tab" : ""}
                onClick={() => onChange("date")}
                disabled={groupBy === "date"}
            >
                {t("itinerary.date")}
            </button>

            <button
                type="button"
                className={groupBy === "location" ? "active-tab" : ""}
                onClick={() => onChange("location")}
                disabled={groupBy === "location"}
            >
                {t("itinerary.location")}
            </button>
        </div>
    );
}

export default GroupToggle;
