import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound, LogOut, Moon, Settings, Sun } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import logo from "../../assets/jtp-logo.png";

function AppHeader({
                       currentUser,
                       handleLogout,
                       theme,
                       onToggleTheme,
                       onLogin,
                   }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const userMenuTriggerRef = useRef(null);
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const isJapanese = i18n.resolvedLanguage?.startsWith("ja");

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

    function toggleLanguage() {
        void i18n.changeLanguage(isJapanese ? "en" : "ja");
    }

    // Render
    return (
        <header className="app-header">
            <div className="app-header-inner">
                <Link className="app-brand" to={currentUser ? "/trips" : "/library"}>
                    <img src={logo} alt="" className="app-logo" />
                    <h1>{t("app.name")}</h1>
                </Link>

                <nav className="app-navigation" aria-label={t("navigation.primary")}>
                    <NavLink to="/library">{t("navigation.library")}</NavLink>
                    {currentUser && <NavLink to="/trips">{t("navigation.trips")}</NavLink>}
                </nav>

                <div className="user-controls">
                    <button
                        type="button"
                        className={isJapanese ? "language-switch japanese" : "language-switch"}
                        onClick={toggleLanguage}
                        role="switch"
                        aria-checked={isJapanese}
                        aria-label={t("language.switchTo")}
                        title={t("language.switchTo")}
                    >
                        <span className={!isJapanese ? "active" : ""}>EN</span>
                        <span className={isJapanese ? "active" : ""}>JP</span>
                    </button>

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
                                <div id="user-menu-panel" className="user-menu-panel" role="menu" aria-label={t("userMenu.label")}>
                                    <Link
                                        className="user-menu-item"
                                        to="/account"
                                        state={{ from: location.pathname }}
                                        role="menuitem"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <Settings size={18} aria-hidden="true" />
                                        <span>{t("userMenu.account")}</span>
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
                                        <span>{theme === "dark" ? t("userMenu.lightMode") : t("userMenu.darkMode")}</span>
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
                                        <span>{isLoggingOut ? t("userMenu.loggingOut") : t("userMenu.logout")}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!currentUser && location.pathname !== "/login" && (
                        <button type="button" className="header-login-button" onClick={onLogin}>
                            {t("auth.login")}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AppHeader;
