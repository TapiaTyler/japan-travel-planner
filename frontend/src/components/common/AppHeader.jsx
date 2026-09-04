import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "../../assets/jtp-logo.png";

function AppHeader({
                       currentUser,
                       handleLogout,
                       theme,
                       onToggleTheme,
                   }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function onLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await handleLogout();
        } finally {
            setIsLoggingOut(false);
        }
    }

    // Render
    return (
        <header className="app-header">
            <div className="app-header-inner">
                <div className="app-brand">
                    <img src={logo} alt="" className="app-logo" />
                    <h1>Japan Travel Planner</h1>
                </div>

                <div className="user-controls">
                    <button
                        type="button"
                        className="theme-toggle"
                        onClick={onToggleTheme}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    >
                        {theme === "dark" ? (
                            <Sun size={19} aria-hidden="true" />
                        ) : (
                            <Moon size={19} aria-hidden="true" />
                        )}
                    </button>

                    {currentUser && (
                        <>
                        <span>
                            Signed in as {currentUser.username}
                        </span>

                        <button
                            type="button"
                            onClick={onLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? "Logging Out..." : "Logout"}
                        </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AppHeader;
