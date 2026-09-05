import { useState } from "react";
import { useTranslation } from "react-i18next";

function shiftDate(dateValue, dayOffset) {
    if (!dateValue) return undefined;
    const date = new Date(`${dateValue}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + dayOffset);
    return date.toISOString().slice(0, 10);
}

function AddSavedItemToTripForm({ item, trips, onCancel, onSave }) {
    const { t } = useTranslation();
    const [tripId, setTripId] = useState(String(trips[0]?.id ?? ""));
    const [date, setDate] = useState("");
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedTrip = trips.find((trip) => String(trip.id) === tripId);
    const endDateOffset = item.endDateOffset ?? 0;
    const minimumDate = shiftDate(selectedTrip?.startDate, -Math.min(endDateOffset, 0));
    const maximumDate = shiftDate(selectedTrip?.endDate, -Math.max(endDateOffset, 0));

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setFormError("");

        try {
            await onSave({ tripId: Number(tripId), date });
        } catch (error) {
            setFormError(error.message);
            setIsSubmitting(false);
        }
    }

    return (
        <form className="template-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <p>{t("libraryItems.addHint", { name: item.name })}</p>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <label>
                {t("libraryItems.destinationTrip")}
                <select
                    value={tripId}
                    onChange={(event) => {
                        setTripId(event.target.value);
                        setDate("");
                    }}
                    required
                >
                    {trips.map((trip) => (
                        <option key={trip.id} value={trip.id}>{trip.name}</option>
                    ))}
                </select>
            </label>
            <div>
                <label>
                    {t("libraryItems.anchorDate", { type: t(`itinerary.${item.itemType.toLowerCase()}`) })}
                    <input
                        type="date"
                        value={date}
                        min={minimumDate}
                        max={maximumDate}
                        onChange={(event) => setDate(event.target.value)}
                        aria-describedby={item.endDateOffset > 0 ? "saved-item-end-date-hint" : undefined}
                        required
                    />
                </label>
                {item.endDateOffset > 0 && (
                    <span id="saved-item-end-date-hint" className="form-helper">
                        {t("libraryItems.endDateHint", { count: item.endDateOffset })}
                    </span>
                )}
            </div>
            <div className="modal-actions">
                <button type="button" onClick={onCancel} disabled={isSubmitting}>
                    {t("common.cancel")}
                </button>
                <button type="submit" className="add-button" disabled={isSubmitting}>
                    {isSubmitting ? t("libraryItems.adding") : t("libraryItems.addToTrip")}
                </button>
            </div>
        </form>
    );
}

export default AddSavedItemToTripForm;
