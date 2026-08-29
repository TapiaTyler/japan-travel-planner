import { useState } from "react";

function RegisterForm({ onRegister, onCancel }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
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
            await onRegister(
                formData.username,
                formData.password
            );
        } catch (error) {
            setFormError(error.message);
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>

            {formError && (
                <p className="form-error">
                    {formError}
                </p>
            )}

            <div>
                <label>
                    Username
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
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                </label>
            </div>

            <button
                type="submit"
                className="add-button"
            >
                Create Account
            </button>

            <button
                type="button"
                onClick={onCancel}
            >
                Back to Login
            </button>
        </form>
    );
}

export default RegisterForm;