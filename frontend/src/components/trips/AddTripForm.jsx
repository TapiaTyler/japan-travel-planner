import { useState } from "react";

function AddTripForm({ onCancel, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
        notes: "",
    });

    const [formError, setFormError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setFormError("");

        try {
            await onSave(formData);
        } catch (error) {
            setFormError(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            {formError && (
                <p className="form-error">
                    {formError}
                </p>
            )}

            <div>
                <label>
                    Trip Name
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
            </div>

            <div>
                <label>
                    Start Date
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                </label>
            </div>

            <div>
                <label>
                    End Date
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                    />
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

            <button type="submit">
                Create Trip
            </button>

            <button
                type="button"
                onClick={onCancel}
            >
                Cancel
            </button>
        </form>
    );
}

export default AddTripForm;