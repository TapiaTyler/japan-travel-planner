// Imports
import { useEffect, useState } from "react";

import {
    getCurrentUser,
    login,
    logout,
    register,
} from "../api/api.js";

function useAuth() {
    // States
    const [currentUser, setCurrentUser] = useState(null);
    const [authMode, setAuthMode] = useState("login");
    const [checkingSession, setCheckingSession] = useState(true);
    const [authError, setAuthError] = useState("");
    const [sessionExpired, setSessionExpired] = useState(false);

    // Handlers
    async function handleLogin(username, password) {
        try {
            const user = await login(username, password);

            setCurrentUser({
                username: user.username,
            });

            setAuthMode("login");
            setSessionExpired(false);
            setAuthError("");

            return user;
        } catch (error) {
            setAuthError(error.message);
            throw error;
        }
    }

    async function handleRegister(username, password) {
        try {
            await register(username, password);

            await handleLogin(username, password);
        } catch (error) {
            setAuthError(error.message);
            throw error;
        }
    }

    async function handleLogout() {
        try {
            await logout();

            setCurrentUser(null);
            setAuthMode("login");
            setAuthError("");
        } catch (error) {
            setAuthError(error.message);
        }
    }

    function handleSessionExpired() {
        setSessionExpired(false);
        setAuthMode("login");
        setAuthError("");
    }

    function handleAccountDeleted() {
        setCurrentUser(null);
        setAuthMode("login");
        setAuthError("");
        setSessionExpired(false);
    }

    // Effects
    useEffect(() => {
        async function restoreSession() {
            try {
                const user = await getCurrentUser();

                if (user) {
                    setCurrentUser(user);
                }
            } catch (error) {
                setAuthError(error.message);
            } finally {
                setCheckingSession(false);
            }
        }

        restoreSession();
    }, []);

    useEffect(() => {
        function handleExpiredSession() {
            setCurrentUser(null);
            setAuthMode("login");
            setSessionExpired(true);
            setAuthError("");
        }

        window.addEventListener(
            "session-expired",
            handleExpiredSession
        );

        return () => {
            window.removeEventListener(
                "session-expired",
                handleExpiredSession
            );
        };
    }, []);

    return {
        currentUser,
        authMode,
        checkingSession,
        authError,
        sessionExpired,

        setAuthMode,

        handleLogin,
        handleRegister,
        handleLogout,
        handleSessionExpired,
        handleAccountDeleted,
    };
}

export default useAuth;
