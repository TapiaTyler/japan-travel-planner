import { useState } from "react";
import logo from "../../assets/jtp-logo.png";

function AppHeader({
                       currentUser,
                       handleLogout,
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
            <div className="app-brand">
                <img src={logo} alt="" className="app-logo" />
                <h1>Japan Travel Planner</h1>
            </div>

            {currentUser && (
                <div className="user-controls">
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
                </div>
            )}
        </header>
    );
}

export default AppHeader;
