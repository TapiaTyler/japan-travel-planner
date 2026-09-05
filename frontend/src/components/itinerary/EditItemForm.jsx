import { useState } from "react";
import {
    COST_STATUS_OPTIONS,
    TRANSPORTATION_TYPE_OPTIONS,
} from "../../config/options.js";
import { useTranslation } from "react-i18next";

function EditItemForm({ item, onCancel, onSave }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        ...item,
    });

    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSubmitting) return;

        setFormError("");
        setIsSubmitting(true);

        try {
            await onSave(formData);
        } catch (error) {
            setFormError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} aria-busy={isSubmitting}>

            {formError && (
                <p className="form-error" role="alert">
                    {formError}
                </p>
            )}

            <div>
                <label>
                    {t("itinerary.name")}
                    <input
                        type="text"
                        name="name"
                        value={formData.name ?? ""}
                        onChange={handleChange}
                    />
                </label>
            </div>

            {item.itemType === "Activity" && (
                <>
                    <div>
                        <label>
                            {t("itinerary.location")}
                            <input
                                type="text"
                                name="location"
                                value={formData.location ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("itinerary.date")}
                            <input
                                type="date"
                                name="date"
                                value={formData.date ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("form.startTime")}
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime?.slice(0, 5) ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("form.endTime")}
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime?.slice(0, 5) ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </>
            )}

            {item.itemType === "Transportation" && (
                <>
                    <div>
                        <label>
                            {t("form.type")}
                            <select
                                name="transportationType"
                                value={formData.transportationType ?? ""}
                                onChange={handleChange}
                            >
                                <option value="">{t("form.selectType")}</option>

                                {TRANSPORTATION_TYPE_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {t(option.labelKey)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("transport.departure")}
                            <input
                                type="text"
                                name="departureLocation"
                                value={formData.departureLocation ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("transport.arrival")}
                            <input
                                type="text"
                                name="arrivalLocation"
                                value={formData.arrivalLocation ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("form.departureDate")}
                            <input
                                type="date"
                                name="departureDate"
                                value={formData.departureDate ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("transport.departureTime")}
                            <input
                                type="time"
                                name="departureTime"
                                value={formData.departureTime?.slice(0, 5) ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("form.arrivalDate")}
                            <input
                                type="date"
                                name="arrivalDate"
                                value={formData.arrivalDate ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("transport.arrivalTime")}
                            <input
                                type="time"
                                name="arrivalTime"
                                value={formData.arrivalTime?.slice(0, 5) ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </>
            )}

            {item.itemType === "Lodging" && (
                <>
                    <div>
                        <label>
                            {t("itinerary.location")}
                            <input
                                type="text"
                                name="location"
                                value={formData.location ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("form.checkInDate")}
                            <input
                                type="date"
                                name="checkInDate"
                                value={formData.checkInDate ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            {t("form.checkOutDate")}
                            <input
                                type="date"
                                name="checkOutDate"
                                value={formData.checkOutDate ?? ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </>
            )}

            <div>
                <label>
                    {t("itinerary.mapLocation")}
                    <input
                        type="text"
                        name="mapSearchQuery"
                        value={formData.mapSearchQuery ?? ""}
                        onChange={handleChange}
                        maxLength={500}
                    />
                    <span className="form-helper">
                        {t("itinerary.mapLocationHint")}
                    </span>
                </label>
            </div>

            <div>
                <label>
                    {t("itinerary.cost")}
                    <input
                        type="number"
                        name="cost"
                        min="0"
                        value={formData.cost ?? ""}
                        onChange={handleChange}
                    />
                    <span className="form-helper">
                        {t("itinerary.noCostHint")}
                    </span>
                </label>
            </div>

            <div>
                <label>
                    {t("itinerary.costStatus")}
                    <select
                        name="costStatus"
                        value={formData.costStatus ?? "UNKNOWN"}
                        onChange={handleChange}
                        disabled={formData.cost === "" || formData.cost === null}
                    >
                        {COST_STATUS_OPTIONS.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {t(option.labelKey)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div>
                <label>
                    {t("itinerary.notes")}
                    <textarea
                        name="notes"
                        value={formData.notes ?? ""}
                        onChange={handleChange}
                    />
                </label>
            </div>

            <button
                className="add-button"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? t("common.saving") : t("common.save")}
            </button>

            <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
            >
                {t("common.cancel")}
            </button>
        </form>
    );
}

export default EditItemForm;
