// Imports
import LoginForm from "../components/auth/LoginForm.jsx";
import RegisterForm from "../components/auth/RegisterForm.jsx";

function AuthPage({
                      authMode,
                      setAuthMode,
                      handleLogin,
                      handleRegister,
                  }) {
    // Render
    return (
        <>
            {authMode === "login" ? (
                <LoginForm
                    onLogin={handleLogin}
                    onShowRegister={() =>
                        setAuthMode("register")
                    }
                />
            ) : (
                <RegisterForm
                    onRegister={handleRegister}
                    onCancel={() =>
                        setAuthMode("login")
                    }
                />
            )}
        </>
    );
}

export default AuthPage;