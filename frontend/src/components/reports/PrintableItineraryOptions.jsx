import { useState } from "react";
import { useTranslation } from "react-i18next";

function PrintableItineraryOptions({
                                       baseItemCount,
                                       onCancel,
                                       onGenerate,
                                   }) {
    const { t } = useTranslation();
    const [options, setOptions] = useState({
        activities: true,
        transportation: true,
        lodging: true,
        confirmed: true,
        estimated: true,
        unknown: true,
        includeItemsWithoutCost: true,
        includeNotes: true,
        includeCostSummary: true,
    });

    function handleCheckboxChange(event) {
        const { name, checked } = event.target;

        setOptions((current) => ({
            ...current,
            [name]: checked,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        onGenerate(options);
    }

    return (
        <form
            className="print-options"
            onSubmit={handleSubmit}
        >
            <p className="print-source-summary">
                {t("report.sourceSummary", { count: baseItemCount })}
            </p>

            <div className="print-options-section">
                <h3>{t("report.itineraryItems")}</h3>

                <div className="print-options-grid">
                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="activities"
                            checked={options.activities}
                            onChange={handleCheckboxChange}
                        />
                        {t("cost.activities")}
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="transportation"
                            checked={options.transportation}
                            onChange={handleCheckboxChange}
                        />
                        {t("cost.transportation")}
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="lodging"
                            checked={options.lodging}
                            onChange={handleCheckboxChange}
                        />
                        {t("cost.lodging")}
                    </label>
                </div>
            </div>

            <div className="print-options-section">
                <h3>{t("cost.status")}</h3>

                <div className="print-options-grid">
                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="confirmed"
                            checked={options.confirmed}
                            onChange={handleCheckboxChange}
                        />
                        {t("cost.confirmed")}
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="estimated"
                            checked={options.estimated}
                            onChange={handleCheckboxChange}
                        />
                        {t("cost.estimated")}
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="unknown"
                            checked={options.unknown}
                            onChange={handleCheckboxChange}
                        />
                        {t("cost.unknown")}
                    </label>
                </div>
            </div>

            <div className="print-options-section">
                <h3>{t("report.additionalInformation")}</h3>

                <div className="print-options-grid">
                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="includeItemsWithoutCost"
                            checked={options.includeItemsWithoutCost}
                            onChange={handleCheckboxChange}
                        />
                        {t("report.includeNoCost")}
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="includeNotes"
                            checked={options.includeNotes}
                            onChange={handleCheckboxChange}
                        />
                        {t("report.includeNotes")}
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="includeCostSummary"
                            checked={options.includeCostSummary}
                            onChange={handleCheckboxChange}
                        />
                        {t("report.includeSummary")}
                    </label>
                </div>
            </div>

            <div className="modal-actions">
                <button
                    type="button"
                    onClick={onCancel}
                >
                    {t("common.cancel")}
                </button>

                <button
                    className="add-button"
                    type="submit"
                >
                    {t("report.generatePreview")}
                </button>
            </div>
        </form>
    );
}

export default PrintableItineraryOptions;
