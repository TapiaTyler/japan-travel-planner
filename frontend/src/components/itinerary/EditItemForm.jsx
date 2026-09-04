import { useState } from "react";
import {
    COST_STATUS_OPTIONS,
    TRANSPORTATION_TYPE_OPTIONS,
} from "../../config/options.js";

function EditItemForm({ item, onCancel, onSave }) {
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
                    Name
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
                            Location
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
                            Date
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
                            Start Time
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
                            End Time
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
                            Type
                            <select
                                name="transportationType"
                                value={formData.transportationType ?? ""}
                                onChange={handleChange}
                            >
                                <option value="">Select type</option>

                                {TRANSPORTATION_TYPE_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div>
                        <label>
                            Departure Location
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
                            Arrival Location
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
                            Departure Date
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
                            Departure Time
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
                            Arrival Date
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
                            Arrival Time
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
                            Location
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
                            Check-In Date
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
                            Check-Out Date
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
                    Cost
                    <input
                        type="number"
                        name="cost"
                        min="0"
                        value={formData.cost ?? ""}
                        onChange={handleChange}
                    />
                </label>
            </div>

            <div>
                <label>
                    Cost Status
                    <select
                        name="costStatus"
                        value={formData.costStatus ?? "UNKNOWN"}
                        onChange={handleChange}
                    >
                        {COST_STATUS_OPTIONS.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div>
                <label>
                    Notes
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
                {isSubmitting ? "Saving..." : "Save"}
            </button>

            <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
            >
                Cancel
            </button>
        </form>
    );
}

export default EditItemForm;
