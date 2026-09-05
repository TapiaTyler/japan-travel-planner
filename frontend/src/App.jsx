import { useEffect, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useMatch,
    useNavigate,
} from "react-router";

import "./App.css";
import "@fontsource/noto-sans";

import AppHeader from "./components/common/AppHeader.jsx";
import Modal from "./components/common/Modal.jsx";
import LoadingState from "./components/common/LoadingState.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import TripsPage from "./pages/TripsPage.jsx";
import TripDetailsPage from "./pages/TripDetailsPage.jsx";
import AccountSettingsPage from "./pages/AccountSettingsPage.jsx";
import TripLibraryPage from "./pages/TripLibraryPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import useAuth from "./hooks/useAuth.js";
import useTrips from "./hooks/useTrips.js";
import useItinerary from "./hooks/useItinerary.js";
import useTheme from "./hooks/useTheme.js";
import { getTripPath, getTripSlug } from "./utils/routingUtils.js";
import { useTranslation } from "react-i18next";

function App() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const tripRoute = useMatch("/trips/:tripId/:slug?");
    const auth = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [modalAuthMode, setModalAuthMode] = useState("login");

    const tripState = useTrips(
        auth.currentUser,
        tripRoute?.params.tripId
    );

    const itinerary = useItinerary(
        tripState.selectedTrip
    );

    // Keep readable trip URLs canonical after opening or renaming a trip.
    useEffect(() => {
        if (
            !tripRoute ||
            !tripState.selectedTrip ||
            tripRoute.params.slug ===
                getTripSlug(tripState.selectedTrip.name)
        ) {
            return;
        }

        navigate(
            getTripPath(tripState.selectedTrip),
            { replace: true }
        );
    }, [navigate, tripRoute, tripState.selectedTrip]);

    async function handleLogin(username, password) {
        const user = await auth.handleLogin(username, password);
        navigate("/trips", { replace: true });
        return user;
    }

    async function handleRegister(username, password) {
        const user = await auth.handleRegister(username, password);
        navigate("/trips", { replace: true });
        return user;
    }

    async function handleModalLogin(username, password) {
        const user = await auth.handleLogin(username, password);
        setAuthModalOpen(false);
        return user;
    }

    async function handleModalRegister(username, password) {
        const user = await auth.handleRegister(username, password);
        setAuthModalOpen(false);
        return user;
    }

    async function handleLogout() {
        await auth.handleLogout();
        navigate("/login", { replace: true });
    }

    function handleSelectTrip(trip) {
        tripState.handleSelectTrip();
        navigate(getTripPath(trip));
    }

    function handleBackToTrips() {
        tripState.handleBackToTrips();
        navigate("/trips");
    }

    function handleAccountDeleted() {
        auth.handleAccountDeleted();
        navigate("/login", { replace: true });
    }

    function openAuthModal(mode = "login") {
        setModalAuthMode(mode);
        setAuthModalOpen(true);
    }

    async function handleTripCreatedFromTemplate(trip) {
        await tripState.loadTrips();
        navigate(getTripPath(trip));
    }

    async function handleSavedItemAdded(trip) {
        await tripState.loadTrips();
        navigate(getTripPath(trip));
    }

    const routedTripState = {
        ...tripState,
        handleBackToTrips,
    };

    if (auth.checkingSession) {
        return (
            <main>
                <LoadingState
                    title={t("app.name")}
                    message={t("status.restoring")}
                    fullPage
                    showBrand
                />
            </main>
        );
    }

    const tripsPage = (
        <TripsPage
            trips={tripState.trips}
            loadingTrips={tripState.loadingTrips}
            hasLoadedTrips={tripState.hasLoadedTrips}
            tripError={tripState.tripError}
            addingTrip={tripState.addingTrip}
            editingTrip={tripState.editingTrip}
            tripToDelete={tripState.tripToDelete}
            tripToTemplate={tripState.tripToTemplate}
            savedTemplateName={tripState.savedTemplateName}
            setAddingTrip={tripState.setAddingTrip}
            setEditingTrip={tripState.setEditingTrip}
            setTripToDelete={tripState.setTripToDelete}
            setTripToTemplate={tripState.setTripToTemplate}
            setSavedTemplateName={tripState.setSavedTemplateName}
            handleSelectTrip={handleSelectTrip}
            handleAddTrip={tripState.handleAddTrip}
            handleSaveTrip={tripState.handleSaveTrip}
            handleDuplicateTrip={tripState.handleDuplicateTrip}
            handleConfirmDeleteTrip={
                tripState.handleConfirmDeleteTrip
            }
            handleSaveTripAsTemplate={tripState.handleSaveTripAsTemplate}
        />
    );

    let tripDetailsPage;

    if (
        tripState.loadingTrips ||
        !tripState.hasLoadedTrips
    ) {
        tripDetailsPage = (
            <LoadingState
                title={t("status.loadingTrip")}
                message={t("status.loadingTripMessage")}
            />
        );
    } else if (tripState.selectedTrip) {
        tripDetailsPage = (
            <TripDetailsPage
                tripState={routedTripState}
                itinerary={itinerary}
            />
        );
    } else {
        tripDetailsPage = (
            <section className="route-status">
                <h2>{t("status.tripNotFound")}</h2>
                <p>
                    {t("status.tripNotFoundMessage")}
                </p>
                <button type="button" onClick={handleBackToTrips}>
                    {t("account.backToTrips")}
                </button>
            </section>
        );
    }

    return (
        <main>
            <AppHeader
                currentUser={auth.currentUser}
                handleLogout={handleLogout}
                theme={theme}
                onToggleTheme={toggleTheme}
                onLogin={() => openAuthModal("login")}
            />

            {auth.sessionExpired && (
                <Modal
                    title={t("status.sessionExpired")}
                    onClose={auth.handleSessionExpired}
                >
                    <div className="session-expired-message">
                        <p>
                            {t("status.sessionExpiredMessage")}
                        </p>

                        <button
                            type="button"
                            onClick={auth.handleSessionExpired}
                        >
                            {t("status.goToLogin")}
                        </button>
                    </div>
                </Modal>
            )}

            {authModalOpen && !auth.currentUser && (
                <Modal
                    title={modalAuthMode === "register"
                        ? t("auth.createAccount")
                        : t("auth.login")}
                    onClose={() => setAuthModalOpen(false)}
                    className="auth-modal"
                >
                    <AuthPage
                        authMode={modalAuthMode}
                        setAuthMode={setModalAuthMode}
                        handleLogin={handleModalLogin}
                        handleRegister={handleModalRegister}
                    />
                </Modal>
            )}

            <div className="main-wrapper">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <LandingPage
                                currentUser={auth.currentUser}
                                onStart={() => openAuthModal("register")}
                            />
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            auth.currentUser ? (
                                <Navigate to="/trips" replace />
                            ) : (
                                <AuthPage
                                    authMode={auth.authMode}
                                    setAuthMode={auth.setAuthMode}
                                    handleLogin={handleLogin}
                                    handleRegister={handleRegister}
                                />
                            )
                        }
                    />

                    <Route
                        path="/library"
                        element={
                            <TripLibraryPage
                                currentUser={auth.currentUser}
                                trips={tripState.trips}
                                onRequireAuth={() => openAuthModal("login")}
                                onTripCreated={handleTripCreatedFromTemplate}
                                onItemAdded={handleSavedItemAdded}
                            />
                        }
                    />

                    <Route
                        path="/trips"
                        element={
                            auth.currentUser ? (
                                tripsPage
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    <Route
                        path="/trips/:tripId/:slug?"
                        element={
                            auth.currentUser ? (
                                tripDetailsPage
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    <Route
                        path="/account"
                        element={
                            auth.currentUser ? (
                                <AccountSettingsPage
                                    currentUser={auth.currentUser}
                                    onAccountDeleted={handleAccountDeleted}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={
                                    auth.currentUser
                                        ? "/trips"
                                        : "/"
                                }
                                replace
                            />
                        }
                    />
                </Routes>
            </div>
        </main>
    );
}

export default App;
