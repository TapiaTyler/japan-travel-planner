import { useEffect } from "react";
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
import AuthPage from "./pages/AuthPage.jsx";
import TripsPage from "./pages/TripsPage.jsx";
import TripDetailsPage from "./pages/TripDetailsPage.jsx";
import useAuth from "./hooks/useAuth.js";
import useTrips from "./hooks/useTrips.js";
import useItinerary from "./hooks/useItinerary.js";
import { getTripPath, getTripSlug } from "./utils/routingUtils.js";

function App() {
    const navigate = useNavigate();
    const tripRoute = useMatch("/trips/:tripId/:slug?");
    const auth = useAuth();

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

    const routedTripState = {
        ...tripState,
        handleBackToTrips,
    };

    if (auth.checkingSession) {
        return (
            <main className="route-status" aria-busy="true">
                <h1>Japan Travel Planner</h1>
                <p>Restoring your session...</p>
            </main>
        );
    }

    const tripsPage = (
        <TripsPage
            trips={tripState.trips}
            addingTrip={tripState.addingTrip}
            editingTrip={tripState.editingTrip}
            tripToDelete={tripState.tripToDelete}
            setAddingTrip={tripState.setAddingTrip}
            setEditingTrip={tripState.setEditingTrip}
            setTripToDelete={tripState.setTripToDelete}
            handleSelectTrip={handleSelectTrip}
            handleAddTrip={tripState.handleAddTrip}
            handleSaveTrip={tripState.handleSaveTrip}
            handleDuplicateTrip={tripState.handleDuplicateTrip}
            handleConfirmDeleteTrip={
                tripState.handleConfirmDeleteTrip
            }
        />
    );

    let tripDetailsPage;

    if (
        tripState.loadingTrips ||
        !tripState.hasLoadedTrips
    ) {
        tripDetailsPage = (
            <section className="route-status" aria-busy="true">
                <h2>Loading trip...</h2>
                <p>Retrieving your itinerary.</p>
            </section>
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
                <h2>Trip not found</h2>
                <p>
                    This trip may not exist or may not belong to your account.
                </p>
                <button type="button" onClick={handleBackToTrips}>
                    Back to Trips
                </button>
            </section>
        );
    }

    return (
        <main>
            <AppHeader
                currentUser={auth.currentUser}
                handleLogout={handleLogout}
            />

            {auth.sessionExpired && (
                <Modal
                    title="Session Expired"
                    onClose={auth.handleSessionExpired}
                >
                    <div className="session-expired-message">
                        <p>
                            Your session has expired. Please sign in again to
                            continue.
                        </p>

                        <button
                            type="button"
                            onClick={auth.handleSessionExpired}
                        >
                            Go to Login
                        </button>
                    </div>
                </Modal>
            )}

            <div className="main-wrapper">
                <Routes>
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
                        path="*"
                        element={
                            <Navigate
                                to={
                                    auth.currentUser
                                        ? "/trips"
                                        : "/login"
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
