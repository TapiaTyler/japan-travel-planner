import { useState } from "react";

function LoginForm({ onLogin, onShowRegister }) {
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
            await onLogin(
                formData.username,
                formData.password
            );
        } catch (error) {
            setFormError(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>

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
                        autoComplete="current-password"
                    />
                </label>
            </div>

            <button type="submit">
                Login
            </button>

            <button
                type="button"
                onClick={onShowRegister}
            >
                Create Account
            </button>
        </form>
    );
}

export default LoginForm;