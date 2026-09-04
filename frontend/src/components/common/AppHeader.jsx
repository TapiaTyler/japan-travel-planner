import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound, LogOut, Moon, Settings, Sun } from "lucide-react";
import { Link, useLocation } from "react-router";
import logo from "../../assets/jtp-logo.png";

function AppHeader({
                       currentUser,
                       handleLogout,
                       theme,
                       onToggleTheme,
                   }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const userMenuTriggerRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (!isUserMenuOpen) return undefined;

        function handlePointerDown(event) {
            if (!userMenuRef.current?.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setIsUserMenuOpen(false);
                userMenuTriggerRef.current?.focus();
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isUserMenuOpen]);

    async function onLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await handleLogout();
        } finally {
            setIsLoggingOut(false);
            setIsUserMenuOpen(false);
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
                    {currentUser && (
                        <div className="user-menu" ref={userMenuRef}>
                            <button
                                ref={userMenuTriggerRef}
                                type="button"
                                className="user-menu-trigger"
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="menu"
                                aria-controls="user-menu-panel"
                                onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
                            >
                                <CircleUserRound size={21} aria-hidden="true" />
                                <span className="user-menu-username">{currentUser.username}</span>
                                <ChevronDown
                                    className={isUserMenuOpen ? "user-menu-chevron open" : "user-menu-chevron"}
                                    size={17}
                                    aria-hidden="true"
                                />
                            </button>

                            {isUserMenuOpen && (
                                <div id="user-menu-panel" className="user-menu-panel" role="menu" aria-label="User menu">
                                    <Link
                                        className="user-menu-item"
                                        to="/account"
                                        state={{ from: location.pathname }}
                                        role="menuitem"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <Settings size={18} aria-hidden="true" />
                                        <span>Account Settings</span>
                                    </Link>

                                    <button
                                        type="button"
                                        className="user-menu-item theme-menu-item"
                                        role="menuitemcheckbox"
                                        aria-checked={theme === "dark"}
                                        onClick={onToggleTheme}
                                    >
                                        {theme === "dark" ? (
                                            <Moon size={18} aria-hidden="true" />
                                        ) : (
                                            <Sun size={18} aria-hidden="true" />
                                        )}
                                        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                                        <span className="theme-switch" aria-hidden="true">
                                            <span className="theme-switch-thumb" />
                                        </span>
                                    </button>

                                    <div className="user-menu-divider" role="separator" />

                                    <button
                                        type="button"
                                        className="user-menu-item logout-menu-item"
                                        role="menuitem"
                                        onClick={onLogout}
                                        disabled={isLoggingOut}
                                    >
                                        <LogOut size={18} aria-hidden="true" />
                                        <span>{isLoggingOut ? "Logging Out..." : "Logout"}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AppHeader;
