import {
    COST_STATUS_OPTIONS,
    ITEM_TYPE_OPTIONS,
    TRANSPORTATION_TYPE_OPTIONS,
} from "../../config/options.js";
import { useTranslation } from "react-i18next";

function ItineraryFilters({
                              filters,
                              locations,
                              onChange,
                              onReset,
                          }) {
    const { t } = useTranslation();
    function toggleValue(key, value, allValues) {
        const currentValues = filters[key].length === 0
            ? allValues
            : filters[key];
        const nextValues = currentValues.includes(value)
            ? currentValues.filter((current) => current !== value)
            : [...currentValues, value];

        // Keep at least one option selected in each multi-select group.
        if (nextValues.length === 0) {
            return;
        }

        onChange({
            ...filters,
            [key]: nextValues.length === allValues.length
                ? []
                : nextValues,
        });
    }

    function renderCheckboxes(options, key) {
        const allValues = options.map((option) => option.value);
        const allSelected = filters[key].length === 0;

        return options.map((option) => (
            <label key={option.value} className="filter-checkbox">
                <input
                    type="checkbox"
                    checked={
                        allSelected || filters[key].includes(option.value)
                    }
                    onChange={() => toggleValue(
                        key,
                        option.value,
                        allValues
                    )}
                />
                {option.labelKey ? t(option.labelKey) : option.label}
            </label>
        ));
    }

    function renderSelectAll(key, label, disabled = false) {
        return (
            <button
                type="button"
                className="filter-select-all"
                disabled={disabled || filters[key].length === 0}
                onClick={() => onChange({ ...filters, [key]: [] })}
            >
                {t("filters.selectAllGroup", { group: label })}
            </button>
        );
    }

    return (
        <section
            id="itinerary-filters"
            className="itinerary-filters"
            aria-label={t("filters.label")}
        >
            <div className="filter-grid">
                <fieldset>
                    <legend>{t("filters.dateRange")}</legend>
                    <label>
                        {t("filters.from")}
                        <input
                            type="date"
                            max={filters.dateTo || undefined}
                            value={filters.dateFrom}
                            onChange={(event) => onChange({
                                ...filters,
                                dateFrom: event.target.value,
                            })}
                        />
                    </label>
                    <label>
                        {t("filters.to")}
                        <input
                            type="date"
                            min={filters.dateFrom || undefined}
                            value={filters.dateTo}
                            onChange={(event) => onChange({
                                ...filters,
                                dateTo: event.target.value,
                            })}
                        />
                    </label>
                </fieldset>

                <fieldset>
                    <legend>{t("filters.locations")}</legend>
                    {renderSelectAll(
                        "locations",
                        t("filters.locations"),
                        locations.length === 0
                    )}
                    <div className="filter-checkbox-list">
                        {locations.length > 0
                            ? renderCheckboxes(
                                locations.map((location) => ({
                                    value: location,
                                    label: location === "Other / Unspecified"
                                        ? t("common.otherUnspecified")
                                        : location,
                                })),
                                "locations"
                            )
                            : <span className="filter-empty">{t("filters.noLocations")}</span>}
                    </div>
                </fieldset>

                <fieldset>
                    <legend>{t("filters.itemTypes")}</legend>
                    {renderSelectAll("itemTypes", t("filters.itemTypes"))}
                    {renderCheckboxes(ITEM_TYPE_OPTIONS, "itemTypes")}
                </fieldset>

                <fieldset>
                    <legend>{t("cost.status")}</legend>
                    {renderSelectAll("costStatuses", t("filters.costStatuses"))}
                    {renderCheckboxes(COST_STATUS_OPTIONS, "costStatuses")}
                </fieldset>

                <fieldset>
                    <legend>{t("filters.costRange")}</legend>
                    <label>
                        {t("filters.minimum")}
                        <input
                            type="number"
                            min="0"
                            max={filters.maxCost || undefined}
                            value={filters.minCost}
                            onChange={(event) => onChange({
                                ...filters,
                                minCost: event.target.value,
                            })}
                        />
                    </label>
                    <label>
                        {t("filters.maximum")}
                        <input
                            type="number"
                            min={filters.minCost || "0"}
                            value={filters.maxCost}
                            onChange={(event) => onChange({
                                ...filters,
                                maxCost: event.target.value,
                            })}
                        />
                    </label>
                </fieldset>

                <fieldset>
                    <legend>{t("filters.transportationTypes")}</legend>
                    {renderSelectAll(
                        "transportationTypes",
                        t("filters.transportationTypes")
                    )}
                    <div className="filter-checkbox-list">
                        {renderCheckboxes(
                            TRANSPORTATION_TYPE_OPTIONS,
                            "transportationTypes"
                        )}
                    </div>
                </fieldset>
            </div>

            <div className="filter-actions">
                <button type="button" onClick={onReset}>
                    {t("filters.reset")}
                </button>
            </div>
        </section>
    );
}

export default ItineraryFilters;
