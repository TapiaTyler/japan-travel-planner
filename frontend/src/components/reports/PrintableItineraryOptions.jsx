import { useState } from "react";

function PrintableItineraryOptions({
                                       baseItemCount,
                                       onCancel,
                                       onGenerate,
                                   }) {
    const [options, setOptions] = useState({
        activities: true,
        transportation: true,
        lodging: true,
        confirmed: true,
        estimated: true,
        unknown: true,
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
                Generating from {baseItemCount} currently visible itinerary{" "}
                {baseItemCount === 1 ? "item" : "items"}.
            </p>

            <div className="print-options-section">
                <h3>Itinerary Items</h3>

                <div className="print-options-grid">
                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="activities"
                            checked={options.activities}
                            onChange={handleCheckboxChange}
                        />
                        Activities
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="transportation"
                            checked={options.transportation}
                            onChange={handleCheckboxChange}
                        />
                        Transportation
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="lodging"
                            checked={options.lodging}
                            onChange={handleCheckboxChange}
                        />
                        Lodging
                    </label>
                </div>
            </div>

            <div className="print-options-section">
                <h3>Cost Status</h3>

                <div className="print-options-grid">
                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="confirmed"
                            checked={options.confirmed}
                            onChange={handleCheckboxChange}
                        />
                        Confirmed
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="estimated"
                            checked={options.estimated}
                            onChange={handleCheckboxChange}
                        />
                        Estimated
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="unknown"
                            checked={options.unknown}
                            onChange={handleCheckboxChange}
                        />
                        Unknown
                    </label>
                </div>
            </div>

            <div className="print-options-section">
                <h3>Additional Information</h3>

                <div className="print-options-grid">
                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="includeNotes"
                            checked={options.includeNotes}
                            onChange={handleCheckboxChange}
                        />
                        Include notes
                    </label>

                    <label className="print-option">
                        <input
                            type="checkbox"
                            name="includeCostSummary"
                            checked={options.includeCostSummary}
                            onChange={handleCheckboxChange}
                        />
                        Include cost summary
                    </label>
                </div>
            </div>

            <div className="modal-actions">
                <button
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    className="add-button"
                    type="submit"
                >
                    Generate Preview
                </button>
            </div>
        </form>
    );
}

export default PrintableItineraryOptions;
