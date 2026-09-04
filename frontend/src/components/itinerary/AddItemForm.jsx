import { useState } from "react";
import {
    COST_STATUS_OPTIONS,
    TRANSPORTATION_TYPE_OPTIONS,
} from "../../config/options.js";

function AddItemForm({ onCancel, onSave }) {
    const [itemType, setItemType] = useState("Activity");
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        cost: "",
        costStatus: "UNKNOWN",
        notes: "",

        location: "",
        date: "",
        startTime: "",
        endTime: "",

        transportationType: "",
        departureLocation: "",
        arrivalLocation: "",
        departureDate: "",
        departureTime: "",
        arrivalDate: "",
        arrivalTime: "",

        checkInDate: "",
        checkOutDate: "",
    });

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
            await onSave(itemType, formData);
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
                    Item Type
                    <select
                        value={itemType}
                        onChange={(event) => setItemType(event.target.value)}
                    >
                        <option value="Activity">Activity</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Lodging">Lodging</option>
                    </select>
                </label>
            </div>

            <div>
                <label>
                    Name
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
            </div>

            {itemType === "Activity" && (
                <>
                    <div>
                        <label>
                            Location
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
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
                                value={formData.date}
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
                                value={formData.startTime}
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
                                value={formData.endTime}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </>
            )}

            {itemType === "Transportation" && (
                <>
                    <div>
                        <label>
                            Type
                            <select
                                name="transportationType"
                                value={formData.transportationType}
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
                                value={formData.departureLocation}
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
                                value={formData.arrivalLocation}
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
                                value={formData.departureDate}
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
                                value={formData.departureTime}
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
                                value={formData.arrivalDate}
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
                                value={formData.arrivalTime}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </>
            )}

            {itemType === "Lodging" && (
                <>
                    <div>
                        <label>
                            Location
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
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
                                value={formData.checkInDate}
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
                                value={formData.checkOutDate}
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
                        defaultValue="0"
                        value={formData.cost}
                        onChange={handleChange}
                    />
                </label>
            </div>

            <div>
                <label>
                    Cost Status
                    <select
                        name="costStatus"
                        value={formData.costStatus}
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
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </label>
            </div>

            <button
                className="add-button"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Adding Item..." : "Add Item"}
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

export default AddItemForm;
