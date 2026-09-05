import { useState } from "react";
import { useTranslation } from "react-i18next";

function LoginForm({ onLogin, onShowRegister }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
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
            await onLogin(
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
            <h2>{t("auth.login")}</h2>

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
                        autoComplete="current-password"
                    />
                </label>
            </div>

            <button
                type="submit"
                className="add-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? t("auth.signingIn") : t("auth.login")}
            </button>

            <button
                type="button"
                onClick={onShowRegister}
                disabled={isSubmitting}
            >
                {t("auth.createAccount")}
            </button>
        </form>
    );
}

export default LoginForm;
