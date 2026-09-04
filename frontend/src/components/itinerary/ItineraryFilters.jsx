import {
    COST_STATUS_OPTIONS,
    ITEM_TYPE_OPTIONS,
    TRANSPORTATION_TYPE_OPTIONS,
} from "../../config/options.js";

function ItineraryFilters({
                              filters,
                              locations,
                              onChange,
                              onReset,
                          }) {
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
                {option.label}
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
                Select All {label}
            </button>
        );
    }

    return (
        <section
            id="itinerary-filters"
            className="itinerary-filters"
            aria-label="Itinerary filters"
        >
            <div className="filter-grid">
                <fieldset>
                    <legend>Date Range</legend>
                    <label>
                        From
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
                        To
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
                    <legend>Locations</legend>
                    {renderSelectAll(
                        "locations",
                        "Locations",
                        locations.length === 0
                    )}
                    <div className="filter-checkbox-list">
                        {locations.length > 0
                            ? renderCheckboxes(
                                locations.map((location) => ({
                                    value: location,
                                    label: location,
                                })),
                                "locations"
                            )
                            : <span className="filter-empty">No locations available</span>}
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Item Types</legend>
                    {renderSelectAll("itemTypes", "Item Types")}
                    {renderCheckboxes(ITEM_TYPE_OPTIONS, "itemTypes")}
                </fieldset>

                <fieldset>
                    <legend>Cost Status</legend>
                    {renderSelectAll("costStatuses", "Cost Statuses")}
                    {renderCheckboxes(COST_STATUS_OPTIONS, "costStatuses")}
                </fieldset>

                <fieldset>
                    <legend>Cost Range (¥)</legend>
                    <label>
                        Minimum
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
                        Maximum
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
                    <legend>Transportation Types</legend>
                    {renderSelectAll(
                        "transportationTypes",
                        "Transportation Types"
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
                    Reset filters
                </button>
            </div>
        </section>
    );
}

export default ItineraryFilters;
