import { useState } from "react";
import { useTranslation } from "react-i18next";

function RegisterForm({ onRegister, onCancel }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
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

        if (formData.password !== formData.confirmPassword) {
            setFormError(t("auth.passwordMismatch"));
            return;
        }

        setIsSubmitting(true);

        try {
            await onRegister(
                formData.username,
                formData.password
            );
        } catch (error) {
            setFormError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <h2>{t("auth.createAccount")}</h2>

            {formError && (
                <p className="form-error" role="alert">
                    {formError}
                </p>
            )}

            <div>
                <label>
                    {t("auth.username")}
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="username"
                    />
                </label>
            </div>

            <div>
                <label>
                    {t("auth.password")}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                </label>
            </div>

            <div>
                <label>
                    {t("auth.confirmPassword")}
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                </label>
            </div>

            <button
                type="submit"
                className="add-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? t("auth.creatingAccount") : t("auth.createAccount")}
            </button>

            <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
            >
                {t("auth.backToLogin")}
            </button>
        </form>
    );
}

export default RegisterForm;
