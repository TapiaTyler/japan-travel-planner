import { useState } from "react";
import { useTranslation } from "react-i18next";

function UseTemplateForm({ template, onCancel, onSave }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: template.name, startDate: "" });
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setFormError("");

        try {
            await onSave(formData);
        } catch (error) {
            setFormError(error.message);
            setIsSubmitting(false);
        }
    }

    return (
        <form className="template-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <p>{t("library.useHint", { days: template.durationDays })}</p>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <label>
                {t("trips.name")}
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    required
                />
            </label>
            <label>
                {t("trips.startDate")}
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />
            </label>
            <div className="modal-actions">
                <button type="button" onClick={onCancel} disabled={isSubmitting}>
                    {t("common.cancel")}
                </button>
                <button type="submit" className="add-button" disabled={isSubmitting}>
                    {isSubmitting ? t("library.creatingTrip") : t("library.createTrip")}
                </button>
            </div>
        </form>
    );
}

export default UseTemplateForm;
